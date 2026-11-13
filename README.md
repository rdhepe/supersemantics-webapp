# Super Semantics

A responsive website with Python and TypeScript/JavaScript developer documentation for Super Semantics, built with React, TypeScript, Vite, Tailwind CSS, and Motion.

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
npm run preview
```

The build command checks TypeScript before generating `dist`. Deploy the contents of `dist` to a static host. No server, API keys, or environment variables are required.

The site uses client-side routes. Configure your host to serve `index.html` for non-file requests, including `/docs` and `/docs/*`, so direct links and refreshes work. Existing asset requests must still resolve to their actual files.

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

`npm run test:docs` checks both tracks' route/anchor uniqueness, internal links, isolated search indexes, and agreement between displayed and downloadable examples without requiring the governance libraries.

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
