/**
 * Double Escape clears a non-empty editor draft.
 *
 * Built-in double-Escape only acts on an *empty* editor (tree / fork / none via
 * `doubleEscapeAction`). When the editor has text, Escape is a no-op while idle.
 * This extension makes Escape → Escape (within 500ms) clear the draft instead.
 *
 * Streaming / bash abort paths are left to the app.
 */
import {
	CustomEditor,
	type ExtensionAPI,
	type KeybindingsManager,
} from "@earendil-works/pi-coding-agent";
import { matchesKey } from "@earendil-works/pi-tui";

const DOUBLE_ESC_MS = 500;

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
				// Match configured interrupt binding if available, else raw Escape.
				const isEscape =
					typeof keybindings.matches === "function"
						? keybindings.matches(data, "app.interrupt")
						: matchesKey(data, "escape");

				if (
					isEscape &&
					!editor.isShowingAutocomplete() &&
					ctx.isIdle() &&
					editor.getText().length > 0
				) {
					const now = Date.now();
					if (now - lastEscapeTime < DOUBLE_ESC_MS) {
						editor.setText("");
						lastEscapeTime = 0;
					} else {
						lastEscapeTime = now;
					}
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
