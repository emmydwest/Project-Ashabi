# Ashabi — first public experience

This Next.js App Router project implements the first website milestone from the parent build pack. All catalog entries are explicitly marked as concept material. Original artwork and specifications remain untouched in the parent folder.

## Run locally

Use Node.js 20.9 or newer.

- Install: npm install
- Preview: npm run dev
- Format: npm run format
- Lint: npm run lint
- Typecheck: npm run typecheck
- Production export: npm run build

## Milestone scope

Public home, URL-based discovery and search, concept story detail pages, creator information, and about page. Supplied artwork is compressed to WebP. The design uses the supplied palette, responsive layouts, custom SVG controls, and reduced-motion support.

## Next implementation stage

Authentication and server-side roles must precede reader saves/history, creator applications, upload endpoints, studio access, and moderation. Choose and configure a mature identity provider, relational storage, and private object storage. This static first milestone does not simulate accounts or accept submissions.

No chapters, real creator identities, age classifications, platform metrics, or legal agreements were provided. These must be supplied and cleared before the respective live features are enabled. Source and prototype permission metadata are retained on every concept title in src/lib/stories.ts.

Do not use browser storage as a replacement for authenticated reader data. Do not publish protected studio or admin pages without server-side authorization.
