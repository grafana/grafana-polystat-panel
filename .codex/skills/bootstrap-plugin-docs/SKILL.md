---
name: bootstrap-plugin-docs
description: Fills the scaffolded plugin docs stubs from the panel's source code, migrates any existing README documentation into them and trims the README back to its pitch. Use right after `create-plugin add docs`.
---

# Bootstrap Plugin Docs

## Usage

```
/bootstrap-plugin-docs
```

Run once after `create-plugin add docs`. The skill works on greenfield panels (no existing docs - drives content from source) and on brownfield panels (a README full of documentation - moves it onto pages, then trims the README back to what the Overview tab needs). Both paths are first-class.

Read `.config/AGENTS/plugin-docs.md` before starting - it holds the frontmatter shape, the folder conventions, the source-to-page mapping and the style rules. Claude Code loads it automatically through the plugin's agent instructions; other agents need to open it.

This is a one-shot bootstrap. Ongoing per-page updates are routine work - edit the pages directly against those conventions, no skill needed.

## Steps

1. Inventory everything available. Read in parallel:
   - `src/plugin.json` (plugin type, name, declared `includes`, `info.description`)
   - `src/module.ts` (the `PanelPlugin` builder chain - the load-bearing file for option extraction)
   - The panel React component referenced from `module.ts` (commonly `src/components/<PanelName>.tsx` or `src/<PanelName>.tsx`)
   - `src/types.ts` and any other source entry points
   - `provisioning/dashboards/*.json` if present - bundled example dashboards. These are the canonical source for `catalogDocs/examples.md`: real working panel configs that already exercise the plugin's features. Prefer lifting examples from here over inventing them.
   - `README.md` and `CHANGELOG.md` if present (these may be near-empty boilerplate for fresh panels - that's fine)
   - Image assets under `src/img/`, `src/img/screenshots/`, `screenshots/`, `catalogDocs/img/`. If usable screenshots already exist in any of these locations, you may copy the relevant files into `catalogDocs/img/` during the fill pass and reference them from the doc pages. If no usable screenshots exist, flag the gap in the final summary - never generate new images.

2. **Build a working understanding from the `PanelPlugin` builder. This step is mandatory; do not skip even when README is rich.** Locate `new PanelPlugin(...)` in `src/module.ts` (or wherever the default export lives). Walk the chained methods and extract:
   - **Panel purpose** (one sentence). Combine `plugin.json.info.description`, the React component's leading docstring and any descriptive `description:` strings inside `setPanelOptions` calls.

   - **Panel options** (`setPanelOptions((builder) => ...)`). For each `.add*({...})` call on the builder, capture the literal values of these object properties: `name`, `description`, `defaultValue`, `category`. For `defaultValue`, also resolve what it evaluates to (see the Default rule in step 6) - the literal is for your working notes, the resolved value is what gets published. Record the builder method name so you can derive a Type label using the table below.

     | Builder method     | Type label   |
     | ------------------ | ------------ |
     | `addBooleanSwitch` | Toggle       |
     | `addTextInput`     | Text         |
     | `addTextArea`      | Text area    |
     | `addNumberInput`   | Number       |
     | `addRadio`         | Radio        |
     | `addSelect`        | Select       |
     | `addMultiSelect`   | Multi-select |
     | `addColorPicker`   | Color        |
     | `addSliderInput`   | Slider       |
     | `addUnitPicker`    | Unit         |
     | `addCustomEditor`  | Custom       |
     | anything else      | Custom       |

   - **Standard field options** (`useFieldConfig({...})`). Three cases:
     - No `.useFieldConfig(...)` call at all → no Standard field options section. Remove the empty section from `options.md` during the fill pass.
     - `.useFieldConfig()` or `.useFieldConfig({})` or any call without a `standardOptions` key → the panel enables all standard options. Document this as "all standard options".
     - `.useFieldConfig({ standardOptions: [FieldConfigProperty.Min, FieldConfigProperty.Decimals, ...] })` → list only the named ones.

     Friendly labels for the common `FieldConfigProperty` values:

     | Property      | Label          |
     | ------------- | -------------- |
     | `Min`         | Min            |
     | `Max`         | Max            |
     | `Unit`        | Unit           |
     | `Decimals`    | Decimals       |
     | `Thresholds`  | Thresholds     |
     | `Mappings`    | Value mappings |
     | `Color`       | Color scheme   |
     | `DisplayName` | Display name   |
     | `NoValue`     | No-value text  |
     | `Links`       | Data links     |
     | `Filterable`  | Filterable     |

   - **Custom field options** (`useFieldConfig({ useCustomConfig: (builder) => ... })`). Same walker as `setPanelOptions`. These appear under the **Overrides** picker in the panel editor.

   - **Data support** (`setDataSupport({ annotations: true, alertStates: true })`). Each truthy flag is a capability worth a feature bullet in the plugin's own `README.md`, which is the Overview tab:
     - `annotations: true` → "Reads from annotations queries"
     - `alertStates: true` → "Visualises alert state on the panel"

   - **Suggestions / presets suppliers** (`setSuggestionsSupplier(...)` / `setPresetsSupplier(...)`). Presence → README feature bullets: "Appears in the Suggestions list when data shape matches" and "Ships preset configurations".

   If source is genuinely thin (a barely-modified scaffold), say so in the final summary; do not invent.

3. **Plan the README migration.** First decide whether there is anything to migrate. Skip this step entirely when `README.md` says nothing specific to this plugin - the `create-plugin` scaffold ships a generic one titled "Grafana panel plugin template" that explains what panel plugins are in general, plus getting-started and contributing boilerplate. Generic boilerplate is not documentation: do not move it onto pages. The test is whether a sentence would still be true of a different plugin; if so, leave it. Otherwise the README is this plugin's existing documentation and the job is to _move_ it into the multi-page structure, not to copy it and leave a duplicate behind:
   - For each README section, decide which scaffolded stub page it belongs on (`catalogDocs/options.md`, `catalogDocs/data-formats.md`, `catalogDocs/examples.md`, `catalogDocs/troubleshooting.md`, etc.).
   - Note content that does not map to any existing stub - those become candidates for new pages.
   - Quote verbatim when the README's existing style already matches those conventions; rewrite when it does not.
   - Mark what stays behind. Only the pitch survives in the README: what the plugin does, the problem it solves and the feature list. Everything instructional - option tables, data-shape rules, query examples, troubleshooting, configuration walkthroughs - moves to a page.
   - Write the plan down before editing anything, so nothing is dropped between moving it out and trimming the README in step 7.

4. Detect optional features the codemod could not auto-scaffold and propose pages for them. The codemod has already scaffolded the baseline set (`index.md`, `options.md`, `data-formats.md`, `examples.md`, `troubleshooting.md`). The catalog below covers softer features that need contextual judgment - propose these pages to the user when you detect the trigger. Ask before scaffolding.

   **Panel soft-signal catalog** (trigger → filename → scope):

   | Trigger                                                                            | Filename                       | Scope                                                        |
   | ---------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
   | `setSuggestionsSupplier(...)` in source                                            | feature bullet in `README.md`  | When this panel surfaces in the Suggestions list.            |
   | `setPresetsSupplier(...)` in source                                                | `catalogDocs/presets.md`       | The presets the panel ships, when each applies, screenshots. |
   | RBAC role declarations in `plugin.json`                                            | `catalogDocs/permissions.md`   | What each role grants, default assignments.                  |
   | Substantial accessibility considerations (keyboard shortcuts, screen reader notes) | `catalogDocs/accessibility.md` | Keyboard interaction, ARIA, contrast, motion preferences.    |

5. **Prompt the author for context that source and README genuinely can't supply.**

   These docs render on a single, general page on the plugin catalog (`grafana.com/grafana/plugins/<slug>/docs/`), read by anyone evaluating or using the plugin. There's no persona segmentation to ask about - do not ask who the target user is.

   **Panel purpose.** Check whether step 2 (source) or step 3 (README) already yields a clear one-sentence statement of what problem the panel solves. If so, state that sentence back to the author for a quick confirm rather than an open question, for example: "I read the purpose as: '<sentence>' (from README.md). Confirm or correct?" Only ask the open question - "In one sentence, what problem does this panel solve for users?" - when neither source nor README gives a usable answer.

   **Ask only what source and README can't answer.** Candidates:

   > "What data shape does the panel expect, and what kinds of queries produce it (time series, table, traces, logs)?" - only when the panel reads query data and source doesn't make the shape clear. Skip it for panels that don't read data at all.
   > "Are there topics that don't map to source - prerequisites, conceptual overviews, troubleshooting scenarios, FAQs? List them and I'll scaffold them as new pages."

   Questions never block the work. Ask them once, then keep writing. If no answer arrives, go with what source supports, write down each assumption you made and list them in the final summary so the author can correct them. Each topic the author names becomes a new page.

6. For every page in the resulting list (scaffolded stubs + new pages):
   - Write the page following the conventions in `.config/AGENTS/plugin-docs.md`.
   - Pass the source understanding (always present), README excerpts (only when harvested in step 3) and author answers (only when given in step 5) as the page brief.

   **Special case: `catalogDocs/options.md`.** Use the source understanding from step 2 to populate the page directly:
   - For the `## Panel options` section, emit a markdown table with columns `Option | Type | Default | Description` and one row per `setPanelOptions` `.add*` call. Match the Grafana built-in panel docs style (see https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/logs/#logs-options for the reference shape).
     - `Option`: the `name` value, verbatim.
     - `Type`: the friendly Type label from the builder method table above.
     - `Default`: the value a reader sees in the panel editor, as inline code (`` `false` ``, `` `100` ``, `` `Time` ``). Resolve source expressions before publishing: an enum member such as `ClockMode.time` becomes the label of the matching `options` entry (`Time`), a constant becomes its value and a translation call such as `t('panel.mode.time', 'Time')` becomes its default string. Keep the source expression only when you can't resolve it, and list that row in the gaps summary. Empty cell when no default.
     - `Description`: the `description` value, verbatim. When source has none, write one short sentence describing what the option does, based on how the panel component uses it. Stay within what the code shows, and list the rows you wrote in the summary so the author can review them.
     - Escape pipes (`|`) inside any cell value as `\|`.

   - For the `## Standard field options` section, emit a bulleted list of the friendly labels. When the panel enables all standard options, prefix the list with a sentence noting that.

   - For the `## Custom field options` section, emit a table with the same shape as Panel options.

   - If `setPanelOptions` is absent, drop the `## Panel options` section. If `useFieldConfig` is absent, drop both Standard and Custom field options sections. Same for Tooltip and Legend - if the panel has no options under those categories (check the `category:` field in `setPanelOptions` add calls), remove the empty sections rather than leaving placeholder briefs.

   **Verbatim-and-flag rule.** When a source `description:` string contradicts observable behaviour elsewhere in source (for example, the description lists option values that don't appear in the matching `options:` array, names a default the constructor doesn't actually set, or describes a constraint the validator doesn't enforce), keep the description verbatim AND add a row to the gaps summary in step 9 with file + line references. Do not silently paraphrase the discrepancy away. Do not invent corrected wording. The author resolves the contradiction; the agent surfaces it.

   **Special case: `catalogDocs/data-formats.md`.** For every query-backed data shape described on the page, immediately after the prose description add a `#### Example` subsection containing a Markdown table. The table headers must be the actual field names the panel reads - draw them from query field pickers in source (look for `queryField`, `fieldName`, or `FieldNamePicker` in `setPanelOptions` / component props) and from `queryField` values in any provisioning JSON. Populate 3-5 rows with realistic sample values that match the declared types. This is the minimal artifact that lets a dashboard author write a working query or a test datasource payload - without it the page is descriptive but not actionable. If source contains no field-name evidence, flag the gap in the summary rather than omitting the subsection silently.

   **Special case: `catalogDocs/examples.md`.** If `provisioning/dashboards/*.json` exists, lift example configurations from there before falling back to invented ones. Find panels of this plugin type (match the `type` field against `plugin.json.id`) and choose 1-3 representative ones - the basic setup plus the variations that show distinct features. Don't include every matching panel. Publish an excerpt of each, not the full panel object: keep `type` and `options`, plus `fieldConfig` and `targets` when the example depends on them. Drop `id`, `gridPos`, `pluginVersion`, datasource UIDs, timestamps and options left at their defaults. Link to the full dashboard file in the plugin's repository for readers who want the complete JSON - use its `https://` URL, since relative links can't point outside the docs folder. Pair each example with a one-paragraph explanation of which features it exercises and what data shape it expects. If the provisioning directory is missing or has no relevant panels, only then construct examples from the source understanding plus author input.

   **Estimate per-page length.** Project the final size based on the content the page will absorb. If any threshold will be exceeded, plan to split the page into a folder:
   - More than 6 H2 sections, or
   - More than ~400 lines, or
   - More than ~3,000 words

   Pages that commonly need this split: `examples.md` (many distinct scenarios) and `options.md` (an overview plus a page per option category, as the authoring guide shows). `index.md` is a router and should never split.

   **Group closely-coupled pages into folders.** When two or more pages in the resulting set share a single topic, make them a folder with an `index.md` parent and per-aspect children rather than flat siblings. Set `sidebar_position` on each child to control nav order within the folder.

7. **Rewrite `README.md` down to its job.** Only once every page from step 6 is written, so no content is lost in transit. Skip this step entirely when you skipped step 3 - a plugin whose README was already at scaffold default has nothing to migrate and nothing to trim. The README is the Overview tab, seen mostly by people who have not installed the plugin yet and are deciding whether to. It should end up as:
   - One or two paragraphs saying what the plugin does and which problem it solves. Lead with the problem, not the implementation.
   - A short list of features as bullet points - concrete capabilities, one per bullet.
   - A screenshot near the top if the repo has a usable one.
   - Whatever non-documentation sections the project already had and still needs: badges, licence, contributing, support links.

   Delete the instructional sections you moved to pages. Do not leave a condensed copy - two versions of the same guidance drift apart, and the reader is better served by a link. Where the README previously explained something at length, a single sentence pointing into the docs is enough.

   Never invent a pitch. If the README has no clear statement of purpose and step 2 could not derive one from source, ask the author rather than writing marketing copy for them. Preserve any existing badges, licence text and links verbatim.

8. After all pages are written, run `yarn run docs:validate:release` and fix what it reports. Repeat until it passes. Use this script, not `docs:validate`: `docs:validate` reports unfilled section briefs as notes and still passes, so it can't tell you the work is finished. `docs:validate:release` runs the same check the plugin validator runs at release, where a leftover brief is an error.

9. Report a summary to the user:
   - Pages drafted from source-only understanding (note when source was thin).
   - Pages drafted with README content layered in.
   - Pages drafted from `provisioning/dashboards/*.json` content.
   - Pages added for detected optional features.
   - Pages added from author-named topics.
   - Screenshots copied from `src/img/screenshots/` (or similar) into `catalogDocs/img/`. List which pages they landed on. Flag pages that would benefit from screenshots but where none exist in the repo.
   - Gaps flagged for the author:
     - Description-vs-source contradictions kept verbatim per the verbatim-and-flag rule (cite file and line).
     - Option descriptions you wrote because source had none, so the author can review them.
     - Defaults you couldn't resolve and left as source expressions.
     - Assumptions you made where an author question went unanswered.
     - Purpose unclear from source.
     - README content that did not get routed to any page.
     - README sections you removed, and which page each moved to, so the author can spot-check the migration.
     - Pages that would benefit from a screenshot but the repo has none.
   - Final `docs:validate:release` result.

## Notes

- The README stays and remains the Overview tab's source, whether or not `docsPath` is set. `index.md` never appears on Overview - it is the Documentation tab's landing page, written for a reader who has already installed the plugin and clicked through from Overview. Bootstrap never deletes the README; on a brownfield plugin it moves the instructional content out and trims what is left to the pitch.
- The skill works on greenfield panels (no existing docs) and brownfield panels (a README full of documentation to migrate). Greenfield runs lean on source code and author prompts and leave the README alone beyond the pitch. Brownfield runs move README content onto pages and then trim the README. Both paths are first-class.
- **Edge cases when walking the builder chain:**
  - **Multi-file builder chains.** If `setPanelOptions(builder => buildOptions(builder))` delegates to a helper function in another file, follow the import and walk the helper too. If you can't reasonably resolve the chain, document the source location and flag the gap in the summary.
  - **Computed defaults.** Resolve enum members, constants and translation calls to the value the reader sees. When `defaultValue: getDefaultThreshold()` calls a function you can't evaluate from source, render the source text in backticks (`` `getDefaultThreshold()` ``) and flag the row so the author can replace it with the resolved value.
  - **`useFieldConfig()` with no arguments.** Treat as `kind: 'all'`; list the standard options in the Standard field options section.
- The bootstrap workflow is one-shot. Subsequent doc updates are ordinary edits against the conventions in `.config/AGENTS/plugin-docs.md`.
