# Super Semantics

A responsive website with Python, TypeScript/JavaScript, and C#/.NET developer documentation for Super Semantics, built with React, TypeScript, Vite, Tailwind CSS, and Motion.

## Development

Use Node.js 22.16 or newer (compatible with Vite).

```sh
npm install
npm run dev
```

```sh
npm run build
npm run typecheck
npm run lint
npm run test:docs
npm run test:blogs
npm run preview
```

The build command validates blog content and checks TypeScript before generating `dist`. Deploy the contents of `dist` to a static host. No server, API keys, or environment variables are required.

The site uses client-side routes. Configure your host to serve `index.html` for non-file requests, including `/docs`, `/docs/*`, `/blogs`, and `/blogs/*`, so direct links and refreshes work. Existing asset requests must still resolve to their actual files.

## Blogs: publishing a Markdown file

Add a file directly inside `src/blogs/posts`, using a lowercase filename ending in `.md` or `.MD`. Separate words with spaces or hyphens; spaces become hyphens in URLs, so `my-article copy.md` appears at `/blogs/my-article-copy`. Filenames must produce unique URLs. No route, index, or component edits are needed.

Start with this format:

```md
---
title: "My article"
description: "A short summary shown on blog cards."
author: "Author name"
date: "2026-11-14"
---

## Introduction

Write your article in Markdown.
```

All four metadata fields are required. Dates must be valid `YYYY-MM-DD` calendar dates; quote metadata strings. Invalid metadata, empty articles, and duplicate URLs fail `npm run test:blogs` and `npm run build`. During development, blog loading errors display an explicit message without blanking the homepage; correct the file and reload the page. Articles are sorted newest first, with the latest three shown on the homepage. Dates are informational, not a scheduling mechanism: every file in this directory is public content, including future-dated articles.

Headings, lists, links, images, blockquotes, and fenced code blocks are supported. Raw HTML is omitted and unsafe link protocols are blocked by the Markdown renderer. MDX, embedded scripts, and GitHub-specific Markdown extensions such as tables are not supported. Put images in `public/blogs` and reference them with absolute paths, for example `![Diagram description](/blogs/diagram.png)`. Use `/docs` or `/blogs/article-slug` for internal page links; relative `.md` links are not rewritten.

During development, Vite automatically discovers added files. On the deployed website, merge the article into `main`, then rebuild and deploy the site through your existing hosting process. This change does not configure automatic deployment. Removing a file removes its article on the next deployment; changing its filename changes its URL. Blog pages are client-rendered like the rest of this site; per-article social previews and prerendered SEO pages are not generated.

### Restricting publishing to selected company members

Publishing access is controlled in GitHub, not by the article's `author` field or a website login:

1. Give repository write access only to approved company contributors and maintainers. Others can propose pull requests but cannot publish them.
2. Protect `main` with a repository ruleset requiring pull requests and at least one approval. Restrict bypass permissions and publication merges to designated maintainers where your GitHub plan supports it.
3. Require the **Validate website** status check before merging. `.github/workflows/validate.yml` runs the blog validation, production build, lint, and documentation tests on pull requests and pushes to `main`. Review article content and any code, dependency, or workflow changes.
4. Add a `CODEOWNERS` entry for `/src/blogs/posts/` using your actual approved reviewers, and require code-owner reviews in the ruleset. Protect the ownership and workflow configuration too.
5. Deploy production only from reviewed `main` commits. Do not give untrusted pull-request builds production deployment credentials.

An administrator must configure these GitHub settings; this implementation does not grant access or enforce branch protection automatically. Drafts and pull requests in a public repository are publicly visible, and published content remains in Git history. Keep confidential drafts outside public repositories.

## Python developer documentation

Open `/docs` for nine source-linked guides covering installation, first gates, thresholds, ledger evidence, testing, governance scanning, framework integrations, and API troubleshooting. All original Python URLs are preserved.

- [src/docs/content.ts](src/docs/content.ts): typed guide content, upstream references, and the local full-text search index.
- [src/docs/Documentation.tsx](src/docs/Documentation.tsx): documentation layout, keyboard search (Ctrl/Cmd+K), code copying, example downloads, and navigation.
- [src/docs/docs.css](src/docs/docs.css): responsive documentation styles. Documentation uses native scrolling rather than marketing-page effects.
- [src/docs/examples](src/docs/examples): executable examples and eight standard-library tests. These same files supply the displayed and downloadable examples.

Test the Python examples in an isolated Python 3.10+ environment:

```sh
python -m pip install super-semantics-vsl==0.3.1
python -m unittest discover -s src/docs/examples -p "test_*.py" -v
```

The examples were verified against upstream VSL-Core 0.3.1 source. The configured package mirror did not provide the distribution during development, so validation used the upstream checkout's `src` directory on `PYTHONPATH`, not an installed distribution. Framework snippets describe integration wiring, not fully configured live agents.

`npm run test:docs` checks all tracks' route/anchor uniqueness, internal links, isolated search indexes, and agreement between displayed and downloadable examples without requiring the governance libraries.

## TypeScript / JavaScript developer documentation

Open `/docs/typescript` for eight guides covering Node.js setup, first gates, strict Gamma thresholds, asynchronous evidence, testing, LangGraph.js wiring, and API troubleshooting. The sidebar language selector preserves the equivalent lesson where available; Python-only lessons switch to the other track's introduction.

- [src/docs/typescript.ts](src/docs/typescript.ts): source-backed TS/JS guide content and language-tabbed downloads.
- [src/docs/tracks.ts](src/docs/tracks.ts): track labels, runtime metadata, pages, and language-specific search.
- [src/docs/examples/tsjs](src/docs/examples/tsjs): three TypeScript examples, equivalent `.mjs` examples, and shared Node tests. These tutorial `.ts` files are raw documentation assets, excluded from the website compiler and compiled separately for validation.

The guide targets Node.js 22 LTS and ESM. In an isolated tutorial project, obtain `@supersemantics/vsl-core` through your approved package source. The upstream GitHub source install is documented, but its build tools may still require registry access. Do not bypass organizational package restrictions.

Download all seven examples into that project root, set `"type": "module"` in its `package.json`, and use the installation guide's NodeNext `tsconfig.json`:

```sh
npx tsc
node first_gate.mjs
node dist/first_gate.js
node --test test_gates.mjs
```

Core examples were compiled and executed against downloaded VSL-Corejs source with manifest version 0.2.2, using existing local TypeScript/Node tooling without installing packages. Public npm access was blocked by IT policy, so registry publication and registry-based installation were not verified. LangGraph.js 0.1.1 guidance was reviewed against upstream source, not run as a live graph; it explicitly documents the adapter's pinned older core dependency, caller-owned logging/retries, and fresh-denial-state requirements.

The JSONL example deliberately records an unresolved denied decision: integrity passes while lifecycle audit fails. Its persistent file must not be shared by multiple Node processes. None of the examples equates a valid hash chain, conformance, or an assurance declaration with independently verified compliance.

## C# / .NET developer documentation

Open `/docs/dotnet` for eight guides covering .NET 10 setup, first gates, strict Gamma thresholds, persistent evidence, testing, Microsoft Agent Framework integration, and API troubleshooting. The language selector preserves the equivalent lesson where available; Python-only lessons fall back to the selected track's introduction. Existing Python and TS/JS URLs are unchanged.

- [src/docs/dotnet.ts](src/docs/dotnet.ts): source-backed C# guides with commit-pinned upstream references.
- [src/docs/examples/dotnet](src/docs/examples/dotnet): a six-file .NET 10 console project. The displayed source and download links use these same files.
- [src/docs/Documentation.tsx](src/docs/Documentation.tsx): shared navigation, search, code copying, and C# syntax highlighting. The additional Prism grammar does not replace existing language grammars.

Download all six files into a separate directory before building: `VslGuide.csproj`, `Program.cs`, `RefundPolicy.cs`, `ThresholdPolicy.cs`, `LedgerEvidence.cs`, and `GateChecks.cs`. Use an approved .NET 10 **SDK**, not only the runtime:

```sh
dotnet restore
dotnet run -- first
dotnet run -- threshold
dotnet run -- ledger
dotnet run --configuration Release -- test
```

The console project's test mode throws on failed checks, including in Release builds; it is not a `dotnet test` project. The ledger lesson appends to `dotnet-decisions.jsonl` in the tutorial working directory and intentionally leaves a denial unresolved: integrity passes while lifecycle audit fails. Test mode uses a unique temporary ledger and cleans up its data and lock file.

The tutorial pins core manifest version 0.1.2, reviewed at commit `b27d7a7ea2183a5239aec12a57d113ccccdf4019`. All four console modes, including the Release-mode checks, were compiled and executed against that source using the installation guide's source-reference path. The configured package mirror did not provide `SuperSemantics.Vsl`, so NuGet publication and registry-based installation remain unverified. The Microsoft Agent Framework adapter was reviewed at `ff554ae19b685445f8561927823ba13a58ad1537`; it builds against core 0.1.1 and `Microsoft.Agents.AI` 1.28.0. Integration snippets require an application-owned `IChatClient`, do not execute real refunds, and were not validated as a live provider integration. For an executable offline framework example, the guide links to the upstream `PurchaseApproval` project.

## Content and design

- [src/content.ts](src/content.ts): product copy, lifecycle stages, use cases, research, and external destinations.
- [src/App.tsx](src/App.tsx): homepage sections, accessible tab interactions, mobile navigation, and motion.
- [src/index.css](src/index.css): reusable theme tokens, responsive layouts, and reduced-motion behavior.
- [src/motion.tsx](src/motion.tsx): shared word reveals, parallax, scroll progress, smooth scrolling, and motion preferences.
- [public/brand-mark.png](public/brand-mark.png): cropped, resized derivative of the supplied brand artwork, preserving its original colors.
- [public/favicon.png](public/favicon.png): matching favicon derived from the same artwork.

Fonts are served locally through Fontsource. The animated governance flow and code panels are labelled as illustrations, not live product output or executable VSL syntax.

The homepage's floating **Contact us** button opens a keyboard-accessible form for name, email address, optional company, and message. **Open email draft** validates the required fields and opens the visitor's configured email application with the details addressed to `hello@supersemantics.org`. The visitor must review and send the draft; the website does not send, store, or confirm delivery of messages. If no email app opens, the form retains the details for copying and provides the direct email address. Existing contact links still open a blank email. There is no submission backend. Scanner, GitHub, and Zenodo links point to the existing external services.

Keyboard users can navigate lifecycle tabs with Left/Right and use-case tabs with Up/Down; Home/End select the first/last item. The mobile menu supports Escape and returns focus to its toggle.

## Motion and scrolling

Lenis adds gentle desktop wheel smoothing and eased anchor navigation without scroll snapping or locking. Touch devices keep native scrolling. Anchors retain URL hashes and move keyboard focus to the destination after scrolling; the skip link remains native. Navigation stays visible with a thin page-progress indicator.

Headings reveal word by word, the hero illustration has subtle parallax, and tabs use sliding indicators and staggered panel transitions. Decorative animations include a governance marquee, signal flow, diagram scanning, research circles, and contact orbits. The marquee and hero loops pause when offscreen.

All motion respects `prefers-reduced-motion`, including preference changes while the page is open. The footer's **Pause motion** control also disables decorative animations, transitions, parallax, and enhanced scrolling. Device-level reduced motion cannot be overridden by this control.
