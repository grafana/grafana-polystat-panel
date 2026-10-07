# Polystat documentation

This folder contains the multi-page documentation for **Polystat**, published at `grafana.com/grafana/plugins/grafana-polystat-panel/docs/<page>`.

## Why multi-page docs

This lets you write Polystat's documentation as lightweight markdown pages, Docusaurus-style: one file per topic, each with its own frontmatter, grouped into folders if you need to. No build step and no HTML, just markdown that gets validated for you and rendered on grafana.com. Styling is controlled by Grafana, not by you, so every plugin's docs look and feel consistent across the catalog.

Your plugin's page at `grafana.com/grafana/plugins/grafana-polystat-panel/` has four tabs, each sourced differently:

| Tab           | Source                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overview      | Your plugin's top-level `README.md`, sanitized and rendered as-is. This is your pitch to people who have not installed yet - see below. Nothing in this folder replaces or adds to it.     |
| Installation  | Generated automatically by the catalog from `plugin.json` - do not create an installation page in `docs/`.                                                                                 |
| Changelog     | Your plugin's top-level `CHANGELOG.md` - not sourced from `docs/`, do not create a changelog page here either.                                                                             |
| Documentation | This folder, shown once `docsPath` is set and the docs pass validation. Its own landing page is `index.md` - a curated router you write, not an auto-generated tree of every page below it |

### Your README sells the plugin

Overview is the first thing someone sees, and most of them have not installed Polystat yet. They
are deciding whether it is worth their time. So your top-level `README.md` needs to answer that in the
first screenful:

1. **One or two sentences on what Polystat does and which problem it solves.** Lead with the
   problem, not the implementation. "Plots geospatial data on an interactive map so you can spot
   regional outliers at a glance" tells a reader more than "A panel plugin built with deck.gl".
2. **Then a short list of features as bullet points.** Concrete capabilities, not adjectives - what
   the panel can actually do, one bullet each.
3. A screenshot early on, if you have one. For a panel, seeing it is worth a paragraph of prose.

Everything in this folder is written for the opposite reader: someone who already installed the plugin
and needs to get it working. Keep the two apart. Reference material, option tables and troubleshooting
belong here, not on Overview - and the pitch belongs on Overview, not here.

## What to document

Document every feature of the panel. The codemod scaffolded these pages as stubs — fill in each one:

| File                 | Purpose                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `index.md`           | Landing page for this folder: orient a reader who already has the panel, then route them to the task pages below. See note below. |
| `data-formats.md`    | The data shape the panel consumes; field types and which field plays which role in the visualization.                             |
| `options.md`         | Panel-specific options the editor exposes (panel, tooltip, legend) beyond Grafana's standard options.                             |
| `examples.md`        | Worked configurations in `dashboard.json` panel format.                                                                           |
| `troubleshooting.md` | Real failures users hit, with diagnostic steps.                                                                                   |

### `index.md` is not a second Overview

`index.md` never appears on the Overview tab and never replaces your `README.md` - that keeps shipping
to grafana.com untouched, `docsPath` or not. `index.md` is the landing page for _this_ folder, for a
reader who already has Polystat installed and clicked into Documentation from the Overview tab.
Its job is orientation, not re-introduction: a couple of sentences on how the docs are organized, a
recommended reading order, then links to common tasks phrased as jobs ("shape your query results", "fix
a panel that won't render") rather than page titles.

Do not restate your README's description, feature list or requirements here - the reader has already
seen those on Overview. Do not turn this into a flat list of every page in this folder either - the
sidebar already lists them all; repeating that list in prose adds nothing.

## AI authoring assistance

The authoring conventions for these docs live in `.config/AGENTS/plugin-docs.md` - the page shape, the
judgement calls validation cannot make, which source file backs which page and what belongs on the Overview
tab versus here. Your coding agent picks that up automatically through the plugin's own agent instructions,
so it applies to ordinary editing without you invoking anything.

One skill is scaffolded alongside it: **`bootstrap-plugin-docs`**, a one-shot helper for the initial fill.
Run it once, after scaffolding:

```
/bootstrap-plugin-docs
```

It reads your panel's source plus any existing README content, drafts the stub pages from what it finds and
asks you about anything the source can't answer. Greenfield panels work too - with no README to mine it
leans on source analysis and prompts you for the rest.

After that, editing docs is ordinary work. Change a panel option, update `options.md` in the same change.
Your agent already has the conventions, so no special command is needed.

## Preview and validate locally

```bash
yarn run docs:serve             # local preview at http://localhost:3001 with live reload
yarn run docs:validate          # check for issues while you write
yarn run docs:validate:release  # check the docs are ready to publish
```

`docs:validate` checks structure, frontmatter, images and links. It does not check your prose - for that,
follow the [Grafana Writers' Toolkit](https://grafana.com/docs/writers-toolkit/).

**Freshly scaffolded docs validate clean.** The `<!-- section-brief -->` notes are reported as notes, not
errors, so you get `✓ Documentation is valid (17 notes)` and the count is your to-do list. Everything else -
frontmatter, links, images - is checked from the start, and CI stays green while you write.

Leftover briefs do block publishing, and for good reason: the marker itself is stripped when the page is
rendered, but the `📝 Fill this in` text is not. A brief you forget to remove ships to grafana.com as
visible text. Before you release, run `docs:validate:release`: it runs the same check as the release
pipeline, so any brief still left is an error.

## How docs are published

Multi-page docs are only published when `docsPath` is set in `src/plugin.json`. If it is not set, this folder is ignored by the publishing pipeline.

When `docsPath` is set:

1. The `validate-docs.yml` workflow runs `docs:validate` on every PR that touches `docs/**` or `src/plugin.json`. Unfilled briefs don't fail it, so you can merge docs in progress.
2. On tag push (release), the docs validator runs again as part of the plugin-validator step. Errors at this stage fail the release.
3. On successful validation, `plugin-docs-cli` builds the docs and writes `dist/docs/` — the manifest plus all markdown and image files.
4. `dist/docs/` rides along inside the plugin archive (`.zip`) uploaded to GCS.
5. Grafana's plugin publishing flow syncs the archive to the CDN, then surfaces the docs at `grafana.com/grafana/plugins/grafana-polystat-panel/docs/`.

## How to disable multi-page docs

If you no longer want multi-page docs for this plugin:

1. Remove the `docsPath` field from `src/plugin.json`.
2. Cut a new release. The next deploy publishes the plugin without the docs subtree; existing pages at `grafana.com/grafana/plugins/grafana-polystat-panel/docs/` stop being served once the new version replaces the old one.

You can leave this folder in place — the publishing pipeline ignores it without `docsPath`. Delete it if you want a clean tree.
