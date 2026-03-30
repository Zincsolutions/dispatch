# DISPATCH HOMEPAGE — CLAUDE CODE BUILD INSTRUCTIONS

## PROJECT CONTEXT

You are building the homepage for **Dispatch** — an AI operating system for businesses. The domain is **dispatchvault.com** and there is already a working Vercel deployment. You will be building a brand new homepage that replaces whatever currently exists at the root route.

**Tech stack**: Next.js (App Router), Tailwind CSS, Framer Motion, TypeScript. Deploy to Vercel.

**Design references**: The visual language follows Monday.com (gradient keywords, rounded cards, interactive product tabs, soft shadows, generous whitespace). The content architecture follows Slack (benefit-statement headlines, alternating feature layouts, embedded metrics, confidence-led security section). Ignore both sites' colors — Dispatch has its own palette.

**Quality bar**: This must look like a Series B startup's homepage designed by a top-tier agency. Think Linear, Vercel, or Loom quality. Not a template. Not generic SaaS. Every section should feel intentional, polished, and scannable at scroll speed.

---

## TECHNICAL SETUP

1. Check if a Next.js project already exists in the repo. If yes, work within it. If not, initialize one with App Router + TypeScript + Tailwind.
2. Install dependencies: `framer-motion` for animations, `lucide-react` for icons if needed.
3. The homepage lives at the root route (`app/page.tsx` or `src/app/page.tsx`).
4. Use Tailwind CSS for all styling. Define a custom color palette in `tailwind.config.ts`.
5. Create reusable components in a `/components` directory.
6. All images that don't exist yet should use high-quality gradient placeholder containers with descriptive text labels (e.g., "Product Screenshot: Prompt Library") — styled to look intentional, not broken.
7. After building, verify the build succeeds with `npm run build` before committing.

---

## COLOR PALETTE (define in tailwind.config.ts)

```
colors: {
  dispatch: {
    navy: '#1A1A2E',       // Primary dark / headlines / dark sections
    blue: '#3B7DD8',       // Primary brand blue / CTAs / accents  
    'blue-light': '#5B9BF0', // Gradient end / hover states
    teal: '#06B6D4',       // Gradient accent / keyword highlights
    slate: '#334155',      // Body text
    'gray-600': '#64748B', // Secondary text
    'gray-400': '#94A3B8', // Muted text / placeholders
    'gray-100': '#F1F5F9', // Light backgrounds
    'gray-50': '#F8FAFC',  // Lightest backgrounds
    white: '#FFFFFF',
  }
}
```

---

## TYPOGRAPHY

Use Google Fonts. Load via `next/font/google`.

- **Display / Headlines**: `DM Sans` weight 700-800 (bold, modern, not generic)
- **Body**: `DM Sans` weight 400-500 (clean readability)
- Alternatively, use `Plus Jakarta Sans` or `Outfit` — anything with character. **NOT** Inter, Roboto, or Arial.

---

## GRADIENT KEYWORD TREATMENT (Critical Visual Signature)

This is the single most important design detail. Key words in headlines get a gradient text treatment:

```css
.gradient-text {
  background: linear-gradient(135deg, #3B7DD8, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Apply this to specific words in these headlines (the highlighted words should communicate the value even if someone reads nothing else):
- Hero: "a system your whole team can run on" → gradient on **"a system"** or **"your whole team can run on"**
- Pillars: "organize, amplify, and protect" → gradient on **"organize, amplify, and protect"**
- Final CTA: "How you use it is." → gradient on **"How you use it"**

---

## GLOBAL DESIGN RULES

- **Rounded corners**: 12-16px on all cards, containers, image frames
- **Shadows**: `shadow-lg` or custom `0 20px 60px rgba(0,0,0,0.08)` on product screenshots and cards
- **Section padding**: `py-24` to `py-32` (96-128px) between sections minimum. Be generous.
- **Max content width**: `max-w-7xl mx-auto` (1280px) with `px-6` padding
- **Animations**: Use Framer Motion. All scroll-triggered animations fire once. Respect `prefers-reduced-motion`.

---

## PAGE STRUCTURE — BUILD THESE SECTIONS IN ORDER

---

### SECTION 1: PROMOTION BAR

**Component**: `PromoBanner.tsx`

A thin, dismissible banner at the very top of the page.

- **Height**: 40-48px
- **Background**: Subtle gradient from `dispatch-navy` to slightly lighter navy, or a solid `dispatch-blue` at 10% opacity
- **Text**: `"Your team is using AI everywhere. And nowhere at the same time."` → followed by a `→ See how Dispatch fixes that` link styled slightly brighter
- **Dismiss**: Small X button on the right. On click, the bar animates out (slide up, 200ms). Use React state to hide.
- **Text size**: 14px, white or near-white, medium weight

---

### SECTION 2: NAVIGATION

**Component**: `Navbar.tsx`

Sticky navigation that transitions from transparent to white on scroll.

**Layout**: 
- Left: Dispatch logo (text logo "Dispatch" in bold DM Sans, or an SVG if you have one)
- Center: `Product` · `Use Cases` · `Pricing` · `Resources` (text links, 15px, medium weight)
- Right: `Log in` (text link) · `Get a Demo` (text link) · `Start Free Trial` (filled blue button, rounded-lg, 14px bold)

**Scroll behavior**:
- Initially: `bg-transparent`, text is white (over hero)
- On scroll (past ~80px): `bg-white/95 backdrop-blur-md shadow-sm`, text switches to dark
- Transition: 200ms ease

**Mobile**: Hamburger menu. `Start Free Trial` button always visible.

---

### SECTION 3: HERO

**Component**: `HeroSection.tsx`

The most important section. Two phases stacked vertically.

**Phase 1 — Text Block** (centered, above fold):

```
Stack order (all text-center):

1. Leading line (kicker):
   "Your teams are using AI everywhere. And nowhere at the same time."
   → 18px, font-medium, text-dispatch-gray-400 (muted), tracking-wide
   → Framer Motion: fadeIn + slideUp, delay 0.2s

2. Headline:
   "Turn AI chaos into a system your whole team can run on."
   → 52-64px (text-5xl md:text-6xl lg:text-7xl), font-bold, text-white
   → Apply gradient-text class to "a system" 
   → Framer Motion: fadeIn + slideUp, delay 0.4s

3. Subheadline:
   "Dispatch centralizes your prompts, workflows, tools, and outputs into one structured platform — so your team can collaborate, move faster, and scale what actually works."
   → 18-20px, font-normal, text-dispatch-gray-400, max-w-3xl mx-auto
   → Framer Motion: fadeIn, delay 0.6s

4. Supporting line:
   "A shared workspace for your team — with a secure vault for your most valuable AI assets."
   → 16px, font-medium, text-dispatch-gray-600
   → Framer Motion: fadeIn, delay 0.7s

5. CTA buttons (flex gap-4, centered):
   - "Get a Free Demo" → bg-dispatch-blue text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-dispatch-blue-light transition shadow-lg shadow-dispatch-blue/25
   - "Start Free Trial" → border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition

6. Micro-text:
   "No credit card needed ✦ Free plan available"
   → 13px, text-dispatch-gray-600

7. Trust logos:
   Horizontal row of 5-6 grayscale SVG logos (use placeholder gray rectangles with rounded corners if no real logos exist, labeled "Partner Logo")
   → opacity-40 hover:opacity-70 transition
   → Small label above: "Trusted by teams at" in 12px uppercase tracking-widest text-dispatch-gray-600
```

**Hero background**: The entire hero section has a dark background. Use `bg-dispatch-navy` with a subtle radial gradient overlay or a mesh gradient pattern for depth. Something like:
```css
background: radial-gradient(ellipse at 50% 0%, rgba(59,125,216,0.15) 0%, transparent 60%), #1A1A2E;
```

**Phase 2 — Product Tab Showcase** (below trust logos, still within hero or immediately after):

**Component**: `ProductShowcase.tsx`

Interactive tab switcher modeled after Monday.com's hero.

- **Tab bar**: Horizontal, centered. 4 tabs: `Prompts` | `Workflows` | `Images` | `Insights`
  - Tab style: `px-6 py-3 rounded-full text-sm font-medium`
  - Inactive: `text-dispatch-gray-400 hover:text-white`
  - Active: `bg-white/10 text-white` or `bg-dispatch-blue text-white`
  - Active indicator: subtle bottom border or pill highlight

- **Content panel**: Below the tabs, display a large product screenshot placeholder
  - Container: `rounded-2xl overflow-hidden shadow-2xl border border-white/10`
  - Size: Full width of content area, aspect-ratio ~16:10
  - Transition: `AnimatePresence` with cross-fade (opacity 0→1, 300ms)
  - Each tab shows a different styled placeholder with:
    - A gradient background (each tab uses slightly different gradients)
    - Large centered label: "Prompt Library Interface", "Workflow Builder", "Image Management System", "Analytics Dashboard"
    - Subtle UI wireframe elements (lines, dots, rectangles) to suggest a real interface
  - Below the screenshot: A caption in 14px text-dispatch-gray-400

- **Caption per tab**:
  - Prompts: "Your team's best prompts, organized and accessible."
  - Workflows: "Turn your best processes into repeatable systems."
  - Images: "AI imagery that stays on-brand, every time."
  - Insights: "See what's working. Double down on it."

---

### SECTION 4: PROBLEM / TENSION

**Component**: `ProblemSection.tsx`

Dark section that creates contrast. This is the "before" state.

- **Background**: `bg-dispatch-navy` or even darker (#12122A). Consider a subtle noise texture overlay for depth.
- **Layout**: Centered text, max-w-3xl

**Content**:
```
Headline: "Most companies are using AI. Few are using it well."
→ text-3xl md:text-4xl font-bold text-white text-center

Narrative (below headline, 20px gap):
"Your marketing lead has a killer prompt in ChatGPT that's generating great copy. Meanwhile, someone in sales is struggling with inconsistent results — unaware that a better prompt already exists."
→ text-lg text-gray-400 text-center max-w-2xl mx-auto

"Multiply that across teams, and you're leaking time, quality, and momentum every single day."
→ text-lg text-gray-400 text-center max-w-2xl mx-auto

Problem bullets (grid grid-cols-1 md:grid-cols-2 gap-4, max-w-3xl mx-auto, mt-12):
Each bullet is a small card with an icon + text:
- Icon (24px, text-dispatch-blue) + "Prompts are scattered across chats, docs, and personal files"
- Icon + "Workflows vary from person to person — nothing is repeatable"  
- Icon + "Teams operate in silos, using different tools in different ways"
- Icon + "Knowledge is lost, duplicated, or impossible to find"
- Icon + "Sensitive inputs and outputs live in places they shouldn't"

Icons to use (from lucide-react): FileSearch, Shuffle, Users, Search, ShieldAlert

Closing line:
"AI is being used. But it isn't being managed."
→ text-xl font-bold text-white text-center mt-12
```

- **Scroll animation**: Section headline fades in when 20% visible. Bullet cards stagger in (0.1s delay each).

---

### SECTION 5: VALUE PROPOSITION PILLARS

**Component**: `ValuePillars.tsx`

Bright section after the dark problem section. Three cards.

- **Background**: `bg-white` or `bg-dispatch-gray-50`
- **Layout**: Centered headline, then `grid grid-cols-1 md:grid-cols-3 gap-8`

**Section headline**:
```
"One platform to organize, amplify, and protect your AI."
→ text-3xl md:text-4xl font-bold text-dispatch-navy text-center
→ Apply gradient-text to "organize, amplify, and protect"
```

**Three pillar cards** (each card):
```
Container: bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300

Structure per card:
1. Icon (48-56px): Custom or lucide-react icon in dispatch-blue
2. Title: "Organize" / "Amplify" / "Protect" → text-xl font-bold text-dispatch-navy
3. Subhead: → text-base font-semibold text-dispatch-slate
4. Body: → text-base text-dispatch-gray-600 leading-relaxed
5. Bold closer: → text-base font-semibold text-dispatch-navy italic
```

**Card 1 — Organize**:
- Icon: `Layers` or `FolderOpen` from lucide
- Subhead: "Bring everything into one system."
- Body: "Prompts, workflows, tools, brand assets, and outputs — all in one structured platform your whole team can access. No more hunting through chats, docs, and shared drives."
- Closer: "The days of 'Where's that prompt?' are over."

**Card 2 — Amplify**:
- Icon: `TrendingUp` or `Zap`
- Subhead: "Scale what works. Stop rebuilding what you've already perfected."
- Body: "When one team finds a workflow that delivers, Dispatch helps you turn it into a repeatable system the whole organization can use. Rate what performs, surface best practices, and let your wins compound."
- Closer: "Your best work should multiply, not evaporate."

**Card 3 — Protect**:
- Icon: `Shield` or `Lock`
- Subhead: "A secure home for your most valuable AI assets."
- Body: "Your prompts, proprietary workflows, and brand-critical assets deserve better than a shared Google Doc. Dispatch provides a centralized, controlled environment — a vault at the core of your workspace."
- Closer: "Think of it as a workspace with a vault at its core."

**Animation**: Cards stagger in on scroll (fade up, 0.3s each, 0.15s stagger).

---

### SECTION 6: FEATURE DEEP DIVES

**Component**: `FeatureSection.tsx` (reusable, called 4 times with different props)

Four feature sections with **alternating layouts**: text-left/image-right, then image-left/text-right.

Each feature section includes:
1. Feature headline (28-36px bold)
2. Supporting paragraph
3. **SO WHAT statement** (visually distinct — use a left blue border, like a blockquote)
4. **Embedded metric** (large bold number + small descriptor)
5. Product screenshot placeholder (on the opposite side)

**Layout per feature**:
```
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  {/* Text column */}
  <div className={index % 2 === 0 ? 'order-1' : 'order-2 lg:order-1'}>
    <h3 className="text-3xl font-bold text-dispatch-navy mb-4">{headline}</h3>
    <p className="text-lg text-dispatch-gray-600 mb-6">{body}</p>
    
    {/* SO WHAT — distinct visual treatment */}
    <div className="border-l-4 border-dispatch-blue pl-6 py-4 bg-dispatch-blue/5 rounded-r-lg mb-8">
      <p className="text-base text-dispatch-slate">
        <span className="font-bold text-dispatch-blue">SO WHAT: </span>
        {soWhat}
      </p>
    </div>
    
    {/* Embedded metric */}
    <div className="flex items-baseline gap-3">
      <span className="text-5xl font-bold text-dispatch-navy">{metric}</span>
      <span className="text-base text-dispatch-gray-600">{metricDesc}</span>
    </div>
  </div>
  
  {/* Screenshot column */}
  <div className={index % 2 === 0 ? 'order-2' : 'order-1 lg:order-2'}>
    {/* Styled placeholder with gradient bg, rounded-2xl, shadow-2xl */}
  </div>
</div>
```

**Feature 1 — Prompts** (Text Left / Screenshot Right):
- Headline: "Stop guessing. Start engineering your prompts."
- Body: "Create, refine, and share prompts that consistently produce high-quality output — stored in a centralized system your team can trust."
- SO WHAT: "Without this, your best prompts live in one person's ChatGPT history. When they leave, take PTO, or just forget — that knowledge vanishes. Dispatch means your team's prompt intelligence is an organizational asset, not a personal secret."
- Metric: "60%" / "less time spent finding or rebuilding prompts"

**Feature 2 — Images** (Screenshot Left / Text Right):
- Headline: "AI imagery that actually stays on brand."
- Body: "Manage prompts, references, and outputs so your visuals are consistent, repeatable, and aligned — without losing track of source inputs."
- SO WHAT: "Every brand team has experienced this: someone generates a great AI image, but nobody can recreate it because the prompt is gone. Dispatch keeps the recipe next to the result — so your team can reproduce, iterate, and maintain visual consistency at scale."
- Metric: "100%" / "of source prompts preserved with outputs"

**Feature 3 — Workflows** (Text Left / Screenshot Right):
- Headline: "Turn AI into a repeatable process."
- Body: "Build structured workflows that connect tools and steps into systems your team can follow — and scale with confidence."
- SO WHAT: "Right now, your top performer's process lives in their head. If they're sick on launch day, the team scrambles. Dispatch externalizes expertise into documented, shareable workflows — so your team's capability doesn't depend on any single person."
- Metric: "3x" / "faster onboarding to AI processes"

**Feature 4 — Ratings** (Screenshot Left / Text Right):
- Headline: "Finally know what works."
- Body: "Rate and refine prompts, workflows, and tools so your best-performing systems rise to the top."
- SO WHAT: "Most teams have no idea which AI processes actually perform and which waste time. Dispatch surfaces this — so you double down on what delivers and stop investing in what doesn't. That's how AI becomes a compounding advantage instead of a cost center."
- Metric: "2x" / "improvement in output quality from rated workflows"

**Screenshot placeholders**: Each should be a unique styled container with:
- `rounded-2xl overflow-hidden shadow-2xl`
- Aspect ratio ~16:10
- Gradient background (vary per feature: blue-to-teal, purple-to-blue, teal-to-green, blue-to-indigo)
- Centered label text and subtle UI wireframe lines suggesting an interface
- Framer Motion: slides in from left or right depending on position, 0.5s ease, when 30% visible

**Metric animation**: The numbers count up from 0 when the section scrolls into view. Use a simple counter animation with Framer Motion's `useInView` + `useMotionValue` + `animate`.

---

### SECTION 7: INTEGRATIONS

**Component**: `IntegrationsPanel.tsx`

Lightweight logo grid section.

- **Background**: `bg-dispatch-gray-50`
- **Layout**: Centered text + horizontal logo row

```
Headline: "Works with the tools your team already uses."
→ text-3xl font-bold text-dispatch-navy text-center
→ Apply gradient-text to "already uses"

Subtext: "From ChatGPT to Claude to Zapier — Dispatch brings your entire AI stack into one system."
→ text-lg text-dispatch-gray-600 text-center max-w-2xl mx-auto

Logo grid: flex flex-wrap justify-center gap-8 items-center
→ 8-12 logos: ChatGPT, Claude, Midjourney, DALL-E, Zapier, n8n, Notion, Slack, Google Docs, Figma
→ Each: grayscale, 40-48px height, opacity-40 hover:opacity-100 transition
→ Use placeholder rounded rectangles with tool names if no SVGs available

Closing line: "It doesn't replace your tools. It organizes them."
→ text-lg font-semibold text-dispatch-navy text-center mt-8
```

---

### SECTION 8: USE CASES

**Component**: `UseCases.tsx`

Interactive tab section.

- **Background**: `bg-white`
- **Layout**: Centered headline + tab bar + content panel

```
Headline: "Built for teams doing real work."
→ text-3xl md:text-4xl font-bold text-dispatch-navy text-center
```

**Tab bar**: Horizontal, centered, `flex gap-2` with pill-shaped tabs.
- Active: `bg-dispatch-navy text-white`
- Inactive: `bg-dispatch-gray-100 text-dispatch-gray-600 hover:bg-dispatch-gray-200`
- Each tab: `px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition`

**5 Tabs + Content**:

1. **Marketing** (default active):
   - Headline: "Scale campaigns faster with shared prompts and on-brand imagery."
   - Body: "Your whole marketing team running on the same playbook — shared prompt libraries, consistent brand visuals, and repeatable content workflows that anyone can follow."
   - Bullets: "Shared prompt library for campaigns" · "On-brand AI image management" · "Repeatable content workflows"

2. **Sales**:
   - Headline: "Make every rep perform like your best rep."
   - Body: "Standardize outreach, proposals, and follow-up sequences so your entire sales team operates at the level of your top performer."
   - Bullets: "Standardized outreach templates" · "Proposal workflows" · "Performance-rated sequences"

3. **Operations**:
   - Headline: "Build processes that scale without you."
   - Body: "Document and connect repeatable workflows that reduce manual effort and scale with confidence — even when you're not in the room."
   - Bullets: "Documented AI workflows" · "Tool-connected processes" · "Team-wide adoption tracking"

4. **Leadership**:
   - Headline: "See what's working. Invest in what compounds."
   - Body: "For the first time, visibility into how your teams are using AI — what's performing, what's wasted, and where to double down."
   - Bullets: "AI usage visibility" · "Performance analytics" · "Investment prioritization"

5. **Agencies**:
   - Headline: "Multi-client output without losing quality."
   - Body: "Templatized systems that maintain consistency across every account — with half the onboarding time for new clients."
   - Bullets: "Client-specific workspaces" · "Templatized workflows" · "50% faster client onboarding"

**Tab content panel**: 
- `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- Left: Text content (headline, body, bullets)
- Right: Styled product screenshot placeholder (different per tab)
- Transition: `AnimatePresence` with fade + slight slide (300ms)

---

### SECTION 9: SECURITY & CONTROL

**Component**: `SecuritySection.tsx`

Confident, minimal section.

- **Background**: `bg-dispatch-gray-50` or `bg-white`
- **Layout**: Centered, max-w-4xl

```
Headline: "Organized. Controlled. Protected."
→ text-3xl md:text-4xl font-bold text-dispatch-navy text-center
→ This is THREE WORDS. Like Slack's "Secure. Scaleable. Silo-free." — confident, assertive.

Subheadline: "Dispatch gives your team a centralized environment for managing AI workflows — so important data, prompts, and assets aren't scattered across tools."
→ text-lg text-dispatch-gray-600 text-center max-w-2xl mx-auto

4 bullets in a 2x2 grid (md:grid-cols-2 gap-6, max-w-3xl mx-auto):
Each is a small card with icon + text:
- Shield icon + "Centralized access to prompts, workflows, and assets"
- Eye icon + "Clear visibility into how AI is being used across teams"
- Home icon + "A reliable home for proprietary and sensitive work"
- Link icon + "Reduced reliance on fragmented, untracked tools"

Card style: bg-white rounded-xl p-6 border border-gray-100 flex gap-4 items-start
Icon: 24px text-dispatch-blue flex-shrink-0
Text: text-base text-dispatch-slate

Closing line: "A shared workspace — with a vault at its core."
→ text-lg font-semibold text-dispatch-navy text-center mt-10 italic
```

---

### SECTION 10: SOCIAL PROOF & TESTIMONIALS

**Component**: `SocialProof.tsx`

Three sub-sections stacked.

**10A — Testimonials**:
```
Headline: "Teams are already building on Dispatch."
→ text-3xl font-bold text-dispatch-navy text-center

3-4 testimonial cards in a horizontal row (grid grid-cols-1 md:grid-cols-3 gap-8):

Card style: bg-white rounded-2xl p-8 shadow-lg border border-gray-100

Card content:
1. Quote text in text-base text-dispatch-slate italic leading-relaxed (use real quotation marks " ")
2. Divider: thin line (border-t border-gray-100 my-4)
3. Attribution: flex items-center gap-3
   - Circle avatar placeholder (48px, bg-gradient-to-br from-dispatch-blue to-dispatch-teal, with initials)
   - Name (text-sm font-bold text-dispatch-navy)
   - Title + Company (text-xs text-dispatch-gray-600)
```

**Use these 3 testimonials**:

Card 1:
- Quote: "We had prompts in Slack, workflows in Google Docs, and brand assets spread across three different tools. Nobody could find anything. Dispatch gave us one place for all of it — and for the first time, our whole team is actually on the same page."
- Name: Sarah Chen
- Title: Head of Marketing, Meridian Growth Co.

Card 2:
- Quote: "Our senior strategist built an incredible content workflow, but it only lived in her head. When she went on leave, the team fell apart. Now every process is documented in Dispatch — anyone can pick it up and run it."
- Name: Marcus Rivera
- Title: COO, BrightPath Agency

Card 3:
- Quote: "We were spending hours every week rebuilding prompts that someone on another team had already perfected. Dispatch cut that to zero. Our team estimates we're saving 8–10 hours a week in duplicated effort alone."
- Name: Jessica Tran
- Title: Director of Content, Vantage Digital

**10B — Metric Strip**:
```
Three large numbers in a horizontal row (grid grid-cols-3 gap-8, text-center):

1. "60%" → text-5xl md:text-6xl font-bold text-dispatch-navy
   "less time rebuilding prompts" → text-sm text-dispatch-gray-600

2. "3x" → same styling
   "faster AI workflow onboarding" → same

3. "1" → same styling
   "single source of truth for AI" → same

Each number: animate counting up from 0 when section enters viewport.
Use framer-motion useInView + useMotionValue + animate.
Duration: 1.5s. Only fire once.
```

**10C — Trust Logos**:
```
Small label: "Recognized by" → text-xs uppercase tracking-widest text-dispatch-gray-400 text-center
Row of 4-6 grayscale logo placeholders → flex justify-center gap-12 items-center opacity-30
```

---

### SECTION 11: BLOG (CONDITIONAL)

**Component**: `BlogSection.tsx`

Only include if it adds value. Build it but it can be easily toggled off.

```
Headline: "How the best teams are using AI right now."
→ text-3xl font-bold text-dispatch-navy text-center

3 article cards (grid grid-cols-1 md:grid-cols-3 gap-8):

Card style: bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition group

Each card:
1. Thumbnail: aspect-video bg-gradient placeholder with article topic icon
2. Body: p-6
   - Title (text-lg font-bold text-dispatch-navy group-hover:text-dispatch-blue transition)
   - Description (text-sm text-dispatch-gray-600 mt-2)
   - "Read more →" link (text-sm font-medium text-dispatch-blue mt-4)

Articles:
1. "Why Your Best Prompts Keep Disappearing (And What to Do About It)"
   Desc: "The hidden cost of prompt fragmentation — and a better way to manage your team's AI knowledge."

2. "The Hidden Cost of AI Silos: What Fragmented Teams Are Really Losing"
   Desc: "When AI efforts don't compound, you're not just losing efficiency — you're losing competitive advantage."

3. "From Experiment to System: How to Make AI Compound Across Your Team"
   Desc: "The framework for turning scattered AI experiments into organizational capability."
```

---

### SECTION 12: FINAL CTA

**Component**: `FinalCTA.tsx`

Full-width closing section. Same visual weight as hero.

```
Background: bg-dispatch-navy with the same radial gradient as the hero
  background: radial-gradient(ellipse at 50% 50%, rgba(59,125,216,0.2) 0%, transparent 60%), #1A1A2E;

Padding: py-32 (generous)

Headline: "AI isn't the advantage. How you use it is."
→ text-4xl md:text-5xl font-bold text-white text-center
→ Apply gradient-text to "How you use it" (use a lighter gradient: dispatch-blue-light to white)

Subheadline: "Dispatch gives your team the system to collaborate, scale, and get more from AI — without the chaos."
→ text-xl text-gray-400 text-center max-w-2xl mx-auto mt-6

CTAs (flex gap-4 justify-center mt-10):
- "Get a Free Demo" → bg-white text-dispatch-navy px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg
- "Start Free Trial" → border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition
```

---

### SECTION 13: FOOTER

**Component**: `Footer.tsx`

```
Background: bg-dispatch-navy (darker shade, #12122A if possible) or border-t on navy

Layout: max-w-7xl mx-auto, grid grid-cols-2 md:grid-cols-4 gap-8

Column 1 — Product:
- Dispatch logo
- "The system of record for AI." tagline in text-sm text-gray-500 italic
- Social icons (Twitter, LinkedIn, GitHub placeholders)

Column 2 — Product links:
"Product" header → Prompts, Workflows, Images, Ratings, Integrations

Column 3 — Company links:
"Company" header → About, Blog, Careers, Contact

Column 4 — Resources:
"Resources" header → Documentation, Help Center, Privacy Policy, Terms of Service

All text: text-sm text-gray-400 hover:text-white transition
Headers: text-sm font-semibold text-white uppercase tracking-wider mb-4

Bottom bar: border-t border-white/10 mt-12 pt-8
"© 2026 Dispatch. All rights reserved." → text-xs text-gray-500 text-center
```

---

## ANIMATION IMPLEMENTATION NOTES

Create a reusable hook or wrapper component:

```tsx
// components/AnimateOnScroll.tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function AnimateOnScroll({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

Create a reusable counter component for metrics:

```tsx
// components/CountUp.tsx  
// Animates a number from 0 to target when in view
// Handle "60%", "3x", "100%" formats
```

---

## IMPORTANT IMPLEMENTATION RULES

1. **Build quality over speed**. Every pixel matters. Check spacing, alignment, font sizes on every section.
2. **No placeholder text that looks broken**. Every placeholder (screenshots, logos) should be a styled gradient container that looks intentional.
3. **Test at 1440px, 1024px, 768px, and 375px widths**. The page must look excellent at all breakpoints.
4. **Run `npm run build` before committing**. Fix all TypeScript errors and build warnings.
5. **Commit with clear messages** describing what was built.
6. **After the full page is built**, push to the repo and Vercel will auto-deploy. Verify at dispatchvault.com.

---

## FILE STRUCTURE

```
src/
  app/
    page.tsx          ← Homepage (imports and stacks all sections)
    layout.tsx        ← Root layout with fonts, metadata
    globals.css       ← Tailwind directives + custom gradient-text class
  components/
    PromoBanner.tsx
    Navbar.tsx
    HeroSection.tsx
    ProductShowcase.tsx
    ProblemSection.tsx
    ValuePillars.tsx
    FeatureSection.tsx
    IntegrationsPanel.tsx
    UseCases.tsx
    SecuritySection.tsx
    SocialProof.tsx
    BlogSection.tsx
    FinalCTA.tsx
    Footer.tsx
    AnimateOnScroll.tsx
    CountUp.tsx
tailwind.config.ts    ← Custom colors, fonts
```

---

## METADATA (in layout.tsx)

```tsx
export const metadata = {
  title: 'Dispatch — Turn AI chaos into a system your team can run on',
  description: 'Dispatch centralizes your prompts, workflows, tools, and outputs into one structured platform. Organize, amplify, and protect how your team uses AI.',
  openGraph: {
    title: 'Dispatch — The AI Operating System for Your Business',
    description: 'One platform to organize, amplify, and protect how your team uses AI.',
    url: 'https://dispatchvault.com',
    siteName: 'Dispatch',
    type: 'website',
  },
};
```

---

## FINAL CHECKLIST BEFORE DEPLOY

- [ ] All 13 sections render correctly
- [ ] Gradient text treatment visible on hero headline, pillar headline, and final CTA headline
- [ ] Tab switcher in hero works (click tabs, content cross-fades)
- [ ] Tab switcher in use cases works
- [ ] Promo bar dismisses on X click
- [ ] Navbar transitions from transparent to white on scroll
- [ ] Scroll animations fire once per section
- [ ] Metric numbers count up on scroll
- [ ] Mobile responsive at 375px — everything stacks, readable, no horizontal overflow
- [ ] Tablet responsive at 768px — feature sections stack, tabs scroll
- [ ] `npm run build` succeeds with zero errors
- [ ] Push to repo → Vercel auto-deploys → verify at dispatchvault.com
