# Dispatch Full Audit — June 10, 2026

Scope: live site (dispatchvault.com), marketing homepage, logged-in app, Supabase data layer, security, SEO, performance, accessibility. Build verified locally (`npm run build` passes clean on Next 16.2.1).

## TL;DR

The foundation is genuinely solid: multi-tenant isolation is correctly enforced at the database level (Row Level Security on all 10 tables), no secrets have ever been committed to the public repo, the architecture follows modern Next.js patterns with good type safety, and the production build is clean. The prose copy on the homepage is strong.

The problems cluster in four areas:

1. **One real security bug** — anyone who signs up with an organization name that already exists gets added as an *owner* of that existing org, with full read/write/delete access to its data.
2. **Credibility risks on the live homepage** — fabricated testimonials with invented names/companies, made-up metrics ("60% less time") animated as if measured, and literal "Partner 1…5" placeholder boxes.
3. **Reliability gaps in the app** — sessions are never refreshed (users get silently logged out), there are zero loading/error states, and failed deletes are swallowed silently.
4. **Dead ends everywhere on the marketing site** — nav links to pages that don't exist (Pricing, Resources), 13 footer links pointing at `#` including Privacy Policy and Terms, no robots.txt/sitemap/OG image.

---

## P0 — Fix immediately

### P0-1. Org-takeover via signup slug collision (SECURITY)
`src/lib/actions/auth.ts:104-128`. `createOrgAndMembership` uses the service-role client to look up an org by slug; if one exists it adds the new user as `role: "owner"` of it — no check that the org is empty. Anyone signing up with org name "Acme" becomes co-owner of the existing Acme org and can read/write/delete all its prompts, workflows, agents, and context.
**Fix:** only reuse an org if it has zero members; otherwise suffix the slug (`acme-2`) or reject with "name taken."

### P0-2. Fabricated social proof on the live site (CREDIBILITY/LEGAL)
- `src/components/homepage/SocialProof.tsx:6-22` — three invented testimonials with names, titles, companies ("Sarah Chen, Meridian Growth Co.", etc.) and a fabricated "saving 8–10 hours a week" claim, under the headline "Teams are already building on Dispatch."
- Invented metrics presented as measurements: 60%/100%/3x/2x in `src/app/page.tsx:21-56`, 60%/3x counters in SocialProof, "50% faster client onboarding" in `UseCases.tsx:38`. CountUp animation makes them look measured.
- Placeholder logo strips: "Trusted by teams at" + gray "Partner 1–5" boxes (`HeroSection.tsx:70-86`), "Recognized by" + empty rectangles (`SocialProof.tsx:80-89`).

This is FTC-endorsement-rule territory and instantly destroys trust if a visitor googles the companies.
**Fix:** remove testimonials/logo strips (or reframe honestly: "Early access — be one of the first teams on Dispatch"); cut or reframe metrics as product promises ("100% of source prompts preserved" is defensible; "60% less time" is not).

### P0-3. Sessions never refresh — users silently logged out (RELIABILITY)
`src/proxy.ts` (Next 16's middleware convention — it IS invoked; build shows "ƒ Proxy (Middleware)") is deliberately a no-op. The complete, working `updateSession` implementation sits unused in `src/lib/supabase/proxy.ts`. Server components can't persist refreshed auth cookies (`src/lib/supabase/server.ts:22-29` swallows the write, with a comment assuming middleware refresh that doesn't happen). Result: refreshed tokens are never written back; sessions expire mid-use and users get bounced to /login.
**Fix:** call `updateSession(request)` from `proxy()` (env vars are available on Vercel). Remove the three `console.log`s that log user IDs (`lib/supabase/proxy.ts:37,44,51`) when wiring it up.

### P0-4. Legal pages missing while collecting signups
Footer "Privacy Policy" and "Terms of Service" are `href="#"` (`Footer.tsx:7-25`); no such pages exist. The site collects emails/passwords via Supabase auth.
**Fix:** ship real /privacy and /terms pages and link them (also from the signup form).

## P1 — High-priority (this week)

### Marketing site
- **Dead nav/CTAs** (`Navbar.tsx:8-13,57-62`): "Pricing" → `#pricing` and "Resources" → `#resources` anchor to nothing (confirmed live: /pricing 404s); "Get a Demo" → `href="#"`. Remove until real, or point Demo at a mailto/contact form. Both hero CTAs route to /signup — a "Get a Free Demo" button landing on self-serve signup breaks the promise.
- **SEO infrastructure absent** (confirmed live: robots.txt 404): no robots.ts, no sitemap.ts, no OG image, no twitter card, no canonical, no `metadataBase`, no structured data. ~20 lines + one 1200×630 image fixes social sharing and crawler guidance. Also: meta title and og:title carry two different positionings (`layout.tsx:25,29`) — pick one. /login and /signup export no metadata.
- **Blog section is a dead end** (`BlogSection.tsx`): cards with "Read more →" but no links, no blog exists. Flag `SHOW_BLOG = false` already exists at line 5 — flip it.

### App
- **Zero `loading.tsx` / `error.tsx` files.** Every query throws raw on error → unstyled crash screen; no pending feedback on nav/search. One shared skeleton covers all four list sections.
- **Delete failures silently swallowed** (`confirm-dialog.tsx:33-38`): dialog closes, no toast, item still there. Capture the action result and `toast.error`.
- **PostgREST filter injection in search** (`lib/queries/prompts.ts:19-21` + same in workflows/agents/context): raw `?search=` interpolated into `.or(\`title.ilike.%${search}%\`)` — commas/parens are query syntax; at minimum 500s the page. Sanitize the term. RLS bounds the blast radius but fix it.
- **Open redirect in auth callback** (`src/app/auth/callback/route.ts:7,13`): `next` param accepted unvalidated; `//evil.com` can bounce users off-site from an emailed link. Allowlist internal paths (`startsWith("/") && !startsWith("//")`).
- **No rate limiting** on login/signup. Confirm Supabase Auth rate limits/captcha in the dashboard; consider Upstash ratelimit on the actions.

## P2 — Product gaps (highest-leverage features)

1. **Copy-to-clipboard on prompts/context** — zero clipboard code in a prompt library. The single core action of the product is missing. Cheapest, highest-value fix in the app.
2. **Member invitations** — settings lists members read-only; there is *no way to add a teammate*. The only path to a multi-user org today is the P0-1 bug. Invite-by-email (Supabase `inviteUserByEmail` + pending-invite table) unlocks the entire team value prop.
3. **Real product screenshots on the homepage** — every "screenshot" is a gray wireframe placeholder, but the actual app exists and looks real. Replace at least the hero ProductShowcase tabs with screenshots of the real dashboard/prompts/workflows.
4. **Pagination + sort** — all lists hard-truncate at 50 with no indication; fixed sort.
5. **Tags are write-only** — settable everywhere, filterable nowhere. Make them clickable filters.
6. **Prompt versioning** — edits overwrite in place; the draft/approved/archived status implies a review workflow that history would complete.
7. **Duplicate/clone action** for prompts and workflows; **global search** (cmd-K) across entities; **dashboard substance** (counts, "drafts awaiting approval" queue).
8. **Inline form validation** — react-hook-form + zod resolvers are installed but unused; server errors arrive as one concatenated toast. Adopt or remove the deps.

## P3 — Code health, performance, accessibility

- **~75% copy-paste across the four CRUD sections** (~1,400 of ~1,850 lines). Every cross-cutting change currently costs 4×. Extract shared list/detail components and a CRUD action/query factory before building P2 features.
- **Homepage fully client-rendered**: all 15 sections `"use client"`, hero h1 starts at `opacity:0` until JS hydrates (hurts LCP and no-JS crawlers). Keep content server-rendered; restrict framer-motion to decoration.
- **Query efficiency**: `getCurrentUserWithOrg()` (3 queries) uncached and re-run per layout+action — wrap in React `cache()`. `getWorkflowById` issues up to 8 round trips — use PostgREST embedded selects.
- **Non-atomic workflow updates** (`lib/actions/workflows.ts:131-163`): delete-all-then-reinsert join rows with no transaction; mid-failure loses links. Move to a Postgres RPC.
- **Wrong empty state when filtering**: "Create your first prompt" shows even when emptiness is due to a search filter (all four lists).
- **Contrast failures**: `text-[#999]` on white ≈ 2.8:1 (hero eyebrow, microcopy, captions) — bump to ~#717171; footer `white/40` → `white/60`.
- **ARIA-incomplete tabs** (ProductShowcase, UseCases): tablist/tab roles without tabpanel/aria-controls/arrow keys. No `<main>` landmark on homepage.
- **Asset hygiene**: 1.36 MB `public/logo-dispatch.svg` used in app sidebar (an 8 KB version exists); unused Next starter SVGs and `.DS_Store` in public/; three font families loaded where one is used; `PromoBanner.tsx` dead code; hardcoded "© 2026".
- Misc: topbar initials crash on empty email (`topbar.tsx:32`); missing `aria-label`s on icon buttons; sidebar lacks `aria-current`; `shadcn` CLI listed as runtime dependency.

## Verified clean
- RLS on all 10 tables, org-scoped, join tables covered — no cross-tenant read/write (apart from P0-1's bootstrap path).
- No secrets in working tree or anywhere in git history of the public repo; `.env*` properly ignored; service-role key server-only.
- Uncommitted local changes are benign: the migration diff is a trailing newline; untracked `src/lib/supabase/proxy.ts` is the (unused) session-refresh implementation referenced in P0-3.
- `npm run build` passes with zero errors. Live /dashboard correctly redirects unauthenticated visitors to /login.
- zod validation on all entity mutations; owner-role check on org settings; destructive actions behind confirm dialogs; reduced-motion respected in homepage animations; responsive breakpoints consistent; homepage prose copy is strong.

## Suggested sequence
1. **Day 1:** P0-1 signup fix, P0-3 session refresh, strip fake social proof/metrics/logo strips, prune dead nav/footer links, flip SHOW_BLOG off.
2. **Day 2:** Privacy/Terms pages, SEO pack (robots/sitemap/OG/canonical/metadata), auth-callback allowlist, search sanitization, loading/error states, delete-failure toasts.
3. **Week 1-2:** copy-to-clipboard, member invites, real screenshots on homepage, pagination, clickable tags.
4. **Then:** CRUD de-duplication refactor (before more features), versioning, global search, dashboard upgrade, homepage server-rendering pass.
