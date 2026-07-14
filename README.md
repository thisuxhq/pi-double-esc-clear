# @thisux/pi-double-esc-clear

Clear a non-empty [Pi](https://pi.dev) editor draft with **double Escape**.

Built-in double-Esc only acts when the editor is empty (default: open `/tree`). This package fills the gap when you have draft text and want out of it fast.

## Install

```bash
pi install npm:@thisux/pi-double-esc-clear
```

If Pi is already running:

```text
/reload
```

Or try without writing settings:

```bash
pi -e npm:@thisux/pi-double-esc-clear
```

## Usage

1. Type something in the editor.
2. Press **Esc Esc** within ~500ms.
3. The draft is cleared.

| Editor state | Double Escape |
|---|---|
| Has draft text, agent idle | Clears the draft |
| Empty, agent idle | Built-in action (`tree` / `fork` / `none`) |
| Agent streaming / bash running | Abort (Pi default) |
| Autocomplete open | Cancel autocomplete (Pi default) |

## Notes

- Empty-editor double-Esc is unchanged (`doubleEscapeAction` in settings).
- If you still have a personal copy at `~/.pi/agent/extensions/double-esc-clear.ts`, remove it after installing so the extension does not load twice.

```bash
rm -f ~/.pi/agent/extensions/double-esc-clear.ts
```

- Check it's enabled with `pi list` or `pi config`.

## Release flow

This repo mirrors [@thisux/sveltednd](https://github.com/thisuxhq/sveltednd):

1. Merge PRs to `main` using [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …).
2. [release-please](https://github.com/googleapis/release-please) opens a release PR (version + `CHANGELOG.md`).
3. Merge the release PR → GitHub Release + tag → CI runs `bun publish`.

Manual republish of an existing tag: GitHub Actions → **Release** → **Run workflow**.

Requires repo secret `NPM_TOKEN` (npm automation token with publish access to `@thisux`).

## License

MIT · [ThisUX](https://thisux.com/)
