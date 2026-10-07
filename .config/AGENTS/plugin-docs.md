---
name: plugin docs authoring guide
description: Guides how AI agents author, maintain, review and validate the multi-page docs for Polystat
---

# Plugin docs authoring

`catalogDocs/` contains the multi-page documentation for the **Polystat** plugin. `@grafana/plugin-docs-cli` builds and validates those pages, and they are published to `grafana.com/grafana/plugins/<slug>/docs/<page>`.

If you are filling in stub pages, maintaining docs alongside code changes or adding new pages, read this file first. It is the source of truth for how these docs are written. A single skill, `bootstrap-plugin-docs`, handles the one-shot initial fill; everything after that is ordinary editing against the conventions below.

## Keeping docs in sync with source

**Whenever you add, change or remove a feature in `src/`, update the matching pages in this folder in the same change:**

- Added feature → extend the relevant page (new panel option, new supported field type, new data-format constraint etc.).
- Changed feature → update the page text and any tables so they match the current behaviour.
- Removed feature → delete the section or page and fix any cross-references that pointed to it.

This is routine work, not a special workflow: edit the page directly, follow the conventions in this file, then run `yarn run docs:validate`.

## Page shape

Every page is plain Markdown with a YAML frontmatter block. `title`, `description` and `sidebar_position`
are all required.

```yaml
---
title: Configuration
description: Learn how to configure the panel's axis and legend options.
sidebar_position: 2
---
```

One Markdown file per page, and nested folders become nested URLs Docusaurus-style, so
`catalogDocs/options/legend.md` is served at `.../catalogDocs/options/legend`.

`yarn run docs:validate` enforces the rest - filenames, frontmatter fields and lengths, image formats and
sizes, link resolution and what Markdown is allowed. Do not try to remember those rules. Write the page, run
validate and fix what it reports.

### Group closely-coupled pages into folders

Start flat. When a page outgrows itself - more than about six H2 sections, or a topic that clearly has several independent aspects - split it into a folder rather than letting it sprawl. `options.md` is the usual candidate: an overview plus one page per option category.

```
catalogDocs/options/index.md      # overview, shared context, links to children
catalogDocs/options/tooltip.md    # tooltip-specific options
catalogDocs/options/legend.md     # legend-specific options
```

Rather than:

```
catalogDocs/options.md
catalogDocs/tooltip.md      # less discoverable, scope ambiguous
catalogDocs/legend.md
```

The folder's `index.md` is the parent page (carries the topic overview and links to the children). Each child gets its own `sidebar_position` to control nav order within the folder. Apply this whenever you have a page-level relationship that's tighter than "they both happen to exist in the docs folder".

## Style

These pages follow the [Grafana Writers' Toolkit](https://grafana.com/docs/writers-toolkit/). `docs:validate`
checks structure, frontmatter, images and links - it does not check prose, so getting these right is on you:

1. **Active voice.** Not "the request is processed by the server" - "the server processes the request".
2. **Second person.** Address the reader as "you", not "we" or "our".
3. **Bold for UI elements.** "Click **Save & test**." Not italics, not code formatting.
4. **Code formatting for commands, paths and values.** "Set `region` to `us-east-1`."
5. **Descriptive link text.** Never "click here" or "this link", and never a bare filename. Use the target page's own title, so the text still makes sense out of context.
6. **Sentence case for headings.** "Before you begin", not "Before You Begin". Product names keep their own capitalization.
7. **Present tense, no filler.** "The panel renders", not "the panel will render". Cut "just", "simply",
   "easy", "obviously" and "of course" - they tell the reader nothing and imply the task is easier than it is.
8. **"refer to", not "see"** when pointing at another page.

## The Section-brief protocol

Section briefs are written for whoever fills the section - human author or AI agent. Read the brief, write the section content in its place, then strip the `<!-- section-brief:start --> ... <!-- section-brief:end -->` block.

Scaffolded pages contain blocks like this under each section heading:

```markdown
## Panel options

<!-- section-brief:start -->

> 📝 **Fill this in:** Emit a markdown table with these columns - one row per option registered through `setPanelOptions` in `src/module.ts`. Match the Grafana built-in panel docs style.

If the panel does not call `setPanelOptions`, remove this section entirely.

<!-- section-brief:end -->
```

Only the primary instruction paragraph gets the `> 📝 **Fill this in:**` prefix. A supplementary paragraph after it (like the "If the panel does not..." line above) stays a plain, unprefixed paragraph - it's context for you, not part of the quoted instruction.

Each block narrowly scopes the section it sits under. When filling a section:

1. Read the brief.
2. Write the section using the brief as scope guidance. For source-backed sections, read the source files implied by the page title and brief (the bootstrap-plugin-docs skill's page catalog lists conventional source-to-page mappings for the plugin type).
3. Strip the brief block (`<!-- section-brief:start --> ... <!-- section-brief:end -->`) once the section is filled, including the blockquote and any supplementary paragraphs inside it.

Section-brief blocks are plain HTML comments, so the parser ignores them if accidentally left in - but strip them anyway, they are noise.

## Which source backs which page

When updating a page after a code change, read the source that page documents:

| Page                 | Source of truth                                                                        |
| -------------------- | -------------------------------------------------------------------------------------- |
| `index.md`           | Nothing - it is a curated router. Update it when pages are added or removed.           |
| `options.md`         | `setPanelOptions` and `useFieldConfig` in `src/module.ts`                              |
| `data-formats.md`    | The panel component's data handling, plus any field pickers in `src/module.ts`         |
| `examples.md`        | `provisioning/dashboards/*.json` if present, otherwise the panel's own option defaults |
| `troubleshooting.md` | Real reported failures. Do not invent failure modes.                                   |

## Skill

One skill supports docs work: **`bootstrap-plugin-docs`**, a one-shot helper to run once after
`create-plugin add docs`. It mines `README.md` plus source files, routes existing content to the right
stub pages and prompts for topics that source cannot supply.

Everything after the bootstrap is ordinary editing. Follow the conventions in this file, then run
`yarn run docs:validate` and fix what it reports.

## Adding a new page

The `bootstrap-plugin-docs` skill carries a page catalog with conventional filenames for the optional pages the codemod doesn't scaffold up front. Consult it for the canonical name. If no entry fits, pick a `kebab-case` filename and choose a `sidebar_position` that puts the page where it belongs in the nav order. Add the new page to `index.md`'s task list so it is reachable.

## Do not

Validation cannot catch any of these, so they are on you.

- Invent query fields, configuration options or behaviours. If a page is source-backed, document only what is visible in the source files you read.
- Generate images. Flag missing images for the author to add.
- Reference one-click installation - it has been removed from the plugin catalog.
- Link to internal-only URLs, anything on `*.grafana-ops.net` or a staging environment.

## Validation

```bash
yarn run docs:validate            # while writing; unfilled briefs are notes
yarn run docs:validate -- --json  # machine-readable output
yarn run docs:validate:release    # ready to publish; unfilled briefs are errors
yarn run docs:serve               # local preview on port 3001
```

A freshly scaffolded docs folder validates clean. Unfilled `<!-- section-brief -->` blocks are reported as
notes rather than errors, so the count is a to-do list: `✓ Documentation is valid (17 notes)`. Everything
else - frontmatter, links, images - is checked normally the whole time, so fix those as they appear.

Leftover briefs do block publishing. Strip every one before release: the marker is removed when the page is
rendered, but the `📝 Fill this in` text is not, so a leftover brief ships to the catalog verbatim. When you
finish a docs task, run `docs:validate:release` - a pass from `docs:validate` alone doesn't mean the docs are done.
