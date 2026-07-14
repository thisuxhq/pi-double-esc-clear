# @thisux/pi-double-esc-clear

Clear a non-empty [Pi](https://pi.dev) editor draft with **double Escape**.

Built-in double-Esc only acts when the editor is **empty** (default: open `/tree` via `doubleEscapeAction`). If you've started typing a prompt and want to throw it away, two quick Esc presses clear the draft without aborting a run or opening the session tree.

## Install

```bash
pi install npm:@thisux/pi-double-esc-clear
```

Already in a session?

```text
/reload
```

One-off try (no settings write):

```bash
pi -e npm:@thisux/pi-double-esc-clear
```

Update later:

```bash
pi update npm:@thisux/pi-double-esc-clear
```

## Usage

1. Type a draft in the editor while the agent is idle.
2. Press **Esc Esc** within ~500ms (same window Pi uses for empty double-Esc).
3. The draft clears. Empty-editor double-Esc still does whatever `doubleEscapeAction` is set to.

| Editor state | Double Escape |
|---|---|
| Has draft text, agent idle | Clears the draft |
| Empty, agent idle | Built-in action (`tree` / `fork` / `none`) |
| Agent streaming or bash running | Abort (Pi default) |
| Autocomplete open | Cancel autocomplete (Pi default) |

Escape is matched against your `app.interrupt` keybinding if you've remapped it.

## Notes

- Does not change empty-editor behavior or streaming abort.
- Prefer the package over a hand-copied `~/.pi/agent/extensions/double-esc-clear.ts` — remove the loose file so it doesn't load twice:

  ```bash
  rm -f ~/.pi/agent/extensions/double-esc-clear.ts
  ```

- Enable/disable via `pi config`. Confirm with `pi list`.

## Links

- [npm](https://www.npmjs.com/package/@thisux/pi-double-esc-clear)
- [pi package catalog](https://pi.dev/packages)
- [Repo](https://github.com/thisuxhq/pi-double-esc-clear)

## Release flow

Same automation as [@thisux/sveltednd](https://github.com/thisuxhq/sveltednd):

1. Land PRs on `main` with [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …).
2. [release-please](https://github.com/googleapis/release-please) opens a release PR (version bump + `CHANGELOG.md`).
3. Merge the release PR → GitHub Release/tag → CI runs `bun publish`.

Manual republish: Actions → **Release** → **Run workflow** (pass an existing tag).

Needs repo secret `NPM_TOKEN` (npm automation token allowed to publish under `@thisux`).

## License

MIT · [ThisUX](https://thisux.com/)
