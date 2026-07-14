/**
 * Double Escape clears a non-empty editor draft.
 *
 * Built-in double-Escape only acts on an *empty* editor (tree / fork / none via
 * `doubleEscapeAction`). When the editor has normal draft text, Escape is a
 * no-op while idle. This extension makes Escape → Escape (within 500ms) clear
 * that draft instead.
 *
 * Must not steal these built-in Escape paths:
 * - streaming abort
 * - bash-running abort
 * - bash-mode (`!…`) single-Esc clear/exit
 * - autocomplete cancel
 * - empty / whitespace-only double-Esc (`doubleEscapeAction`)
 */
import {
	CustomEditor,
	type ExtensionAPI,
	type KeybindingsManager,
} from "@earendil-works/pi-coding-agent";
import { matchesKey } from "@earendil-works/pi-tui";

const DOUBLE_ESC_MS = 500;

/** Draft Pi would leave alone on Escape (not empty, not `!` bash mode). */
function isClearableDraft(text: string): boolean {
	const trimmed = text.trim();
	if (trimmed.length === 0) return false;
	// Bash mode is exited with a single Escape by the app.
	if (text.trimStart().startsWith("!")) return false;
	return true;
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		if (ctx.mode !== "tui") return;

		const previous = ctx.ui.getEditorComponent();

		ctx.ui.setEditorComponent((tui, theme, keybindings: KeybindingsManager) => {
			const editor =
				previous?.(tui, theme, keybindings) ??
				new CustomEditor(tui, theme, keybindings);

			if (!(editor instanceof CustomEditor)) {
				return editor;
			}

			// Framework rebinds onEscape after the factory returns, so intercept
			// handleInput rather than assigning onEscape here.
			const originalHandleInput = editor.handleInput.bind(editor);
			let lastEscapeTime = 0;

			editor.handleInput = (data: string) => {
				const isEscape =
					typeof keybindings.matches === "function"
						? keybindings.matches(data, "app.interrupt")
						: matchesKey(data, "escape");

				if (
					isEscape &&
					!editor.isShowingAutocomplete() &&
					// Streaming / non-idle abort stays with the app.
					ctx.isIdle() &&
					isClearableDraft(editor.getText())
				) {
					const now = Date.now();
					if (now - lastEscapeTime < DOUBLE_ESC_MS) {
						// Second Esc on a plain draft → clear. Built-in onEscape is a
						// no-op for this case, so we do not fall through.
						editor.setText("");
						lastEscapeTime = 0;
						return;
					}
					// First Esc: arm timer, then fall through so bash-running /
					// other app Escape handlers still run when applicable.
					lastEscapeTime = now;
					originalHandleInput(data);
					return;
				}

				if (!isEscape) {
					lastEscapeTime = 0;
				}

				originalHandleInput(data);
			};

			return editor;
		});
	});
}
