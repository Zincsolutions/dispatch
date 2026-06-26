import type { BlogPost } from "@/lib/blog/types"

export const post: BlogPost = {
  slug: "get-cited-by-ai-engines",
  title: "How to Get Cited by ChatGPT, Perplexity & Google AI Overviews",
  metaTitle: "How to Get Cited by ChatGPT, Perplexity & AI Overviews",
  metaDescription: "Learn the practical steps to get your content cited as a source in ChatGPT, Perplexity, and Google AI Overviews - from structure to authority signals.",
  category: "AI Search Engines",
  excerpt: "A tactical playbook for earning citations inside AI answers - the structure, signals, and formats that make answer engines quote your pages.",
  image: "/blog/get-cited.png",
  date: "June 10, 2026",
  dateISO: "2026-06-10",
  author: "The Dispatch Team",
  readTime: "12 min read",
  faqs: [
    {
      q: "How do I get my website cited by ChatGPT?",
      a: "ChatGPT cites sources mainly through its search and browsing features, which retrieve live pages to answer a query. To get cited, make sure your pages are crawlable and indexed, answer the question in the first one or two sentences of a section, and use clear question-style headings that match how people ask. Strong authority signals and original data make a passage far more likely to be quoted."
    },
    {
      q: "What is the difference between getting cited and getting ranked?",
      a: "Ranking is about placing high in a traditional list of blue links, while getting cited is about being named or linked as a source inside a generated answer. The two overlap because engines like Google AI Overviews often draw citations from pages that already rank well. However, citation rewards passage-level clarity and quotability, so a page can be cited for one sharp paragraph even if it is not the top organic result."
    },
    {
      q: "Does Perplexity use Google rankings to choose sources?",
      a: "Perplexity runs its own live web search and retrieval rather than simply mirroring Google's rankings. It pulls a set of candidate pages for each query, then cites the ones whose passages best support the answer it generates. Being crawlable, fast, and clearly structured matters more for Perplexity than your exact position in Google's organic results."
    },
    {
      q: "Do I need schema markup to be cited by AI answer engines?",
      a: "Schema markup is not strictly required, but it helps engines parse your content with less ambiguity and makes specific facts easier to extract. FAQ, HowTo, Article, and Organization schema clarify what a page is about and who published it. Our guide to schema markup for AEO covers which types matter most and how to implement them without over-marking your pages."
    },
    {
      q: "How long does it take to start getting cited by AI engines?",
      a: "Live-retrieval engines like Perplexity, ChatGPT search, and Google AI Overviews can surface a new page within days of it being crawled and indexed. The main delays are crawl frequency and the time it takes to build the authority signals that make an engine trust your page. Publishing original data and earning credible mentions speeds this up more than waiting passively."
    },
    {
      q: "What content formats get cited most often by AI answers?",
      a: "Direct-answer paragraphs, definition blocks, comparison tables, step-by-step lists, and FAQ sections are cited most often because they map cleanly to how engines assemble answers. Original statistics and research are especially quotable because no competitor can reproduce them. Structuring a page around clear, self-contained passages gives an engine many discrete things to cite."
    },
    {
      q: "Can I block AI engines from using my content but still get cited?",
      a: "Generally no, because citation requires the engine to retrieve and read your page. If you disallow an engine's crawler in robots.txt or block its retrieval bot, you remove yourself from the candidate pool it cites from. Most publishers who want AI visibility allow the relevant crawlers and use llms.txt to guide them toward their best content."
    },
    {
      q: "Does freshness affect whether AI engines cite my page?",
      a: "Yes, freshness is a strong signal for queries that are time-sensitive or about evolving topics. Live-retrieval engines favor recently updated pages with visible publish and update dates. Keeping a page current, restating its data, and updating its timestamp when you make real changes all improve its odds of being cited over a stale competitor."
    }
  ],
  body: [
    {
      type: "p",
      text: "To get cited by ChatGPT, Perplexity, and Google AI Overviews, make every page easy to retrieve and easy to quote: ensure it is crawlable and indexed, then answer each question directly in the first sentence or two of a clearly labeled section. Earn citations by pairing that answer-first structure with strong authority signals - original data, credible authorship, and freshness - so the engine trusts your passage enough to name you as the source."
    },
    {
      type: "p",
      text: "Answer engines do not cite whole websites. They cite passages. A single well-built paragraph, table, or list on your page can be lifted into an AI answer and credited, even when the rest of the page goes unread. That changes how you write: instead of optimizing a page to rank as one unit, you optimize many discrete, self-contained passages that an engine can grab in isolation. This article is the tactical playbook for doing that, engine by engine."
    },
    {
      type: "p",
      text: "If you are new to the discipline, start with our guide to what answer engine optimization (AEO) is for the strategic frame, then read this piece for the hands-on tactics. The two fit together: AEO explains the why, and the steps below explain the how."
    },
    {
      type: "h2",
      text: "What does it actually mean to be cited by an AI engine?"
    },
    {
      type: "p",
      text: "Being cited means an answer engine names or links your page as a source inside the response it generates for a user. This is different from ranking. Ranking puts you in a list of links a person chooses from; citation puts your content inside the answer a person reads, often with a small numbered reference or a linked card. Most modern answer engines use retrieval-augmented generation, or RAG: they fetch a set of candidate documents for a query, ground the generated answer in those documents, and attach citations to the passages they leaned on."
    },
    {
      type: "p",
      text: "Two mechanics follow from that. First, you must be in the candidate pool the engine retrieves, which is a crawlability and indexing problem. Second, your passage must be the best available support for the specific claim the engine is making, which is a clarity, authority, and format problem. Win both and you get cited. Win only the first and you are retrieved but passed over for a clearer competitor."
    },
    {
      type: "h2",
      text: "How does each engine find and pick its sources?"
    },
    {
      type: "p",
      text: "ChatGPT, Perplexity, and Google AI Overviews all use retrieval plus ranking, but they assemble the candidate pool differently, and those differences change where you should spend effort."
    },
    {
      type: "h3",
      text: "ChatGPT search and browsing"
    },
    {
      type: "p",
      text: "ChatGPT answers from its training data unless its search or browsing capability is invoked, at which point it retrieves live pages from the web through a search index and reads them to ground its answer. When it browses, it favors pages that load cleanly, expose their content in HTML rather than hiding it behind heavy client-side rendering, and answer the query plainly. To be in its pool, your site needs to be crawlable by the relevant OpenAI crawler and indexable, and your passages need to read like direct answers rather than buried prose."
    },
    {
      type: "h3",
      text: "Perplexity live search"
    },
    {
      type: "p",
      text: "Perplexity is built around live web search. For each query it retrieves a fresh set of candidate pages, generates an answer grounded in them, and shows numbered citations inline. It does not simply replay Google's rankings; it runs its own retrieval and weights passage relevance heavily. Because Perplexity is so retrieval-driven and citation-forward, it is often the fastest engine to start citing a new, well-structured page - if the page is crawlable, fast, and clearly answers the question."
    },
    {
      type: "h3",
      text: "Google AI Overviews and AI Mode"
    },
    {
      type: "p",
      text: "Google AI Overviews and the more conversational AI Mode generate answers grounded in Google's existing search systems. This means your traditional organic visibility matters more here than with the other engines: pages that already rank well for a query, and that Google already trusts, are the most likely to be pulled into an Overview. Strong classic SEO is a prerequisite, and on top of it you layer passage-level clarity so Google can extract a clean, quotable snippet. Bing and Copilot work on a similar principle, grounding answers in Bing's index, so the same crawlable-plus-clear formula applies there too."
    },
    {
      type: "table",
      headers: ["Engine", "How it retrieves sources", "What it tends to cite", "How to influence it"],
      rows: [
        ["ChatGPT (search and browsing)", "Live web retrieval via a search index when browsing is triggered", "Pages that load cleanly and answer the query in plain HTML", "Allow the OpenAI crawler, stay indexable, lead each section with a direct answer"],
        ["Perplexity", "Its own live web search and retrieval per query", "Passages that best support the generated answer, shown as inline citations", "Be crawlable and fast, use question headings, supply original quotable data"],
        ["Google AI Overviews and AI Mode", "Grounded in Google's existing index and ranking systems", "Pages that already rank and that Google trusts, distilled into snippets", "Win classic SEO first, then add clear passages and structured data"],
        ["Bing and Copilot", "Grounded in Bing's index with live retrieval", "Indexed, authoritative pages with extractable passages", "Stay in the Bing index, keep content crawlable, mark up key facts"]
      ]
    },
    {
      type: "h2",
      text: "What makes a passage citable?"
    },
    {
      type: "p",
      text: "An engine cites a passage when it can lift that passage out of your page and drop it into an answer with minimal editing and maximum confidence. The most citable passages share four traits."
    },
    {
      type: "ul",
      items: [
        "A clear claim: the passage makes one specific, checkable statement rather than hedging across several ideas.",
        "Answer-first: the point comes in the first sentence, before context or caveats, so an engine can extract it without reading the whole paragraph.",
        "Self-contained: the passage makes sense on its own, with no unresolved 'as mentioned above' references that break when it is lifted out.",
        "Quotable: it is concise, concrete, and ideally backed by a number, date, or named source the engine can attribute to you."
      ]
    },
    {
      type: "p",
      text: "Compare two versions of the same idea. A weak passage reads: 'There are a lot of factors at play, and it really depends, but generally speaking many teams find that response times can sometimes improve.' A citable passage reads: 'Teams that answer support tickets within one hour resolve them 30 percent faster than teams that reply the next day.' The second version is one claim, stated first, self-contained, and quotable. That is what gets pulled into an answer."
    },
    {
      type: "h2",
      text: "Which on-page tactics earn citations?"
    },
    {
      type: "p",
      text: "Once you understand what a citable passage looks like, you can engineer pages full of them. These on-page tactics consistently raise the odds of being quoted."
    },
    {
      type: "h3",
      text: "Use question-style headings"
    },
    {
      type: "p",
      text: "Phrase your H2s and H3s the way users ask questions, because that is how queries arrive at the engine. A heading like 'How much does answer engine optimization cost?' maps directly to a real prompt, and the paragraph beneath it becomes the natural answer. This is also why our guide to generative engine optimization (GEO) stresses building content around the literal questions in your space."
    },
    {
      type: "h3",
      text: "Lead with the answer, then expand"
    },
    {
      type: "p",
      text: "Under each heading, state the answer in the first sentence, then use the rest of the section to add nuance, examples, and caveats. This inverted-pyramid pattern gives the engine a clean extraction target up top and gives human readers the depth they need below it. You serve both audiences without compromise."
    },
    {
      type: "h3",
      text: "Use lists, tables, and definitions"
    },
    {
      type: "p",
      text: "Structured formats are disproportionately cited because they map cleanly onto how engines assemble answers."
    },
    {
      type: "ul",
      items: [
        "Numbered and bulleted lists give an engine ready-made steps or option sets it can reproduce verbatim.",
        "Comparison tables let an engine answer 'X versus Y' queries by lifting a row or column.",
        "Definition blocks - a term followed by a tight one-sentence meaning - are ideal for 'what is X' prompts.",
        "FAQ sections package a question and its self-contained answer in exactly the shape an engine wants."
      ]
    },
    {
      type: "h3",
      text: "Add stats, dates, and freshness signals"
    },
    {
      type: "p",
      text: "Original statistics and quotable data points are among the most cited content on the web, because no competitor can reproduce a number only you measured. Pair that with visible publish and update dates, and refresh time-sensitive pages so the timestamp reflects real changes. Live-retrieval engines favor fresh pages for evolving topics, so freshness is a direct lever on citation, not a vanity metric."
    },
    {
      type: "h2",
      text: "How do authority and E-E-A-T signals influence citations?"
    },
    {
      type: "p",
      text: "Retrieval gets you considered; authority gets you chosen. Engines weigh signals of experience, expertise, authoritativeness, and trust - the E-E-A-T framework - when deciding which retrieved passage to ground an answer in. A clear passage from a source the engine trusts beats an equally clear passage from a source it does not."
    },
    {
      type: "ul",
      items: [
        "Named, credentialed authors with real bios signal expertise and experience rather than anonymous content.",
        "Citations to primary sources and credible references show your claims are grounded, which engines reward.",
        "Mentions and links from reputable sites in your field build the authoritativeness that makes you a default source.",
        "Consistent identity across the web - the same organization name, descriptions, and entity details - helps engines resolve who you are and trust you.",
        "First-hand experience, original research, and proprietary data demonstrate that you know the topic rather than summarizing others."
      ]
    },
    {
      type: "p",
      text: "These signals compound. A page with original data, a credible author, and inbound mentions from trusted sources is far more likely to be cited than a thinner page covering the same query, even if both are perfectly structured."
    },
    {
      type: "h2",
      text: "What technical foundations do answer engines require?"
    },
    {
      type: "p",
      text: "If an engine cannot retrieve, read, or parse your page, none of your writing matters. The technical baseline for citation is the same discipline as good technical SEO, with a few AI-specific additions."
    },
    {
      type: "ol",
      items: [
        "Make pages crawlable: do not block the AI crawlers you want citing you in robots.txt, and confirm key pages are reachable through internal links.",
        "Stay indexable: avoid noindex on pages you want surfaced, and serve primary content in HTML rather than locking it behind heavy client-side rendering.",
        "Be fast and stable: slow or error-prone pages get dropped from candidate pools, so keep load times low and uptime high.",
        "Add structured data: use Article, FAQPage, HowTo, and Organization schema to remove ambiguity about what a page says and who published it.",
        "Consider an llms.txt file: this emerging convention points AI systems toward your most important, citation-worthy content in a clean, machine-readable form.",
        "Keep robots and sitemaps clean: an accurate sitemap and a deliberate robots policy make sure the right pages are found and the wrong ones are not."
      ]
    },
    {
      type: "p",
      text: "Structured data deserves special attention because it directly improves extractability. When you mark up an FAQ, you hand the engine a pre-packaged question-and-answer pair. Our guide to schema markup for AEO walks through which types matter most and how to implement them without over-marking, so you get the parsing benefit without tripping spam heuristics."
    },
    {
      type: "callout",
      title: "Key takeaways",
      text: "Answer engines cite passages, not whole sites, so build pages full of self-contained, answer-first paragraphs an engine can lift in isolation. To enter the candidate pool you must be crawlable, fast, and indexable; to win the citation you must be the clearest, most authoritative source for the specific claim. ChatGPT and Perplexity rely on live retrieval, while Google AI Overviews leans on existing rankings, so strong classic SEO still matters. Original data, credible authorship, structured data, and freshness are the levers that turn a retrieved page into a cited one. Treat every section as a discrete answer and you give engines many reasons to name you."
    },
    {
      type: "h2",
      text: "Which content formats get cited most often?"
    },
    {
      type: "p",
      text: "Some formats are cited far more often than others because they require almost no transformation to fit into an answer. If you want to maximize citations, weight your content toward these shapes."
    },
    {
      type: "ul",
      items: [
        "Direct-answer paragraphs that resolve a question in one or two sentences before expanding.",
        "Definition blocks that pair a term with a crisp, standalone explanation for 'what is' queries.",
        "Comparison tables that let an engine answer 'X versus Y' by quoting a single row.",
        "Step-by-step ordered lists that reproduce cleanly as how-to instructions.",
        "FAQ sections, especially when reinforced with FAQ schema, that match the question-and-answer shape of a prompt.",
        "Original statistics, benchmarks, and research that competitors cannot reproduce and engines love to attribute."
      ]
    },
    {
      type: "p",
      text: "The practical move is to take a long article and audit it for these shapes. Where you have a wall of prose, ask whether a table, a definition, a list, or a quotable stat would serve the same point in a more citable form. Usually it would."
    },
    {
      type: "h2",
      text: "What is a practical checklist to earn citations?"
    },
    {
      type: "p",
      text: "Use this checklist when publishing or refreshing any page you want answer engines to cite. It moves from foundation to format to authority, mirroring how engines evaluate a page."
    },
    {
      type: "ol",
      items: [
        "Confirm the page is crawlable and indexable, and that the AI crawlers you want are allowed.",
        "Check load speed and that primary content renders in HTML, not only after JavaScript runs.",
        "Write each H2 and H3 as a real question users ask in your space.",
        "Lead every section with a one-sentence direct answer, then expand below it.",
        "Convert dense prose into tables, lists, definitions, and FAQ blocks where it fits.",
        "Add at least one original data point, statistic, or first-hand insight no competitor has.",
        "Attribute the page to a named, credible author and link to primary sources.",
        "Implement Article, FAQPage, and Organization schema to clarify meaning and authorship.",
        "Show visible publish and update dates, and refresh time-sensitive pages on a schedule.",
        "Track which queries cite you and iterate on the passages that win - and the ones that should."
      ]
    },
    {
      type: "p",
      text: "Run this list as a repeatable process rather than a one-time pass. Citation is competitive and continuous: as rivals improve their passages and engines update their retrieval, the page that was cited last month can be displaced. Re-auditing your top pages on a cadence keeps you in the answer."
    },
    {
      type: "quote",
      text: "Stop optimizing the page as one unit and start optimizing the paragraph as the unit. The paragraph is what gets cited.",
      cite: "The Dispatch Team"
    },
    {
      type: "h2",
      text: "Frequently asked questions"
    },
    {
      type: "faq",
      items: [
        {
          q: "How do I get my website cited by ChatGPT?",
          a: "ChatGPT cites sources mainly through its search and browsing features, which retrieve live pages to answer a query. To get cited, make sure your pages are crawlable and indexed, answer the question in the first one or two sentences of a section, and use clear question-style headings that match how people ask. Strong authority signals and original data make a passage far more likely to be quoted."
        },
        {
          q: "What is the difference between getting cited and getting ranked?",
          a: "Ranking is about placing high in a traditional list of blue links, while getting cited is about being named or linked as a source inside a generated answer. The two overlap because engines like Google AI Overviews often draw citations from pages that already rank well. However, citation rewards passage-level clarity and quotability, so a page can be cited for one sharp paragraph even if it is not the top organic result."
        },
        {
          q: "Does Perplexity use Google rankings to choose sources?",
          a: "Perplexity runs its own live web search and retrieval rather than simply mirroring Google's rankings. It pulls a set of candidate pages for each query, then cites the ones whose passages best support the answer it generates. Being crawlable, fast, and clearly structured matters more for Perplexity than your exact position in Google's organic results."
        },
        {
          q: "Do I need schema markup to be cited by AI answer engines?",
          a: "Schema markup is not strictly required, but it helps engines parse your content with less ambiguity and makes specific facts easier to extract. FAQ, HowTo, Article, and Organization schema clarify what a page is about and who published it. Our guide to schema markup for AEO covers which types matter most and how to implement them without over-marking your pages."
        },
        {
          q: "How long does it take to start getting cited by AI engines?",
          a: "Live-retrieval engines like Perplexity, ChatGPT search, and Google AI Overviews can surface a new page within days of it being crawled and indexed. The main delays are crawl frequency and the time it takes to build the authority signals that make an engine trust your page. Publishing original data and earning credible mentions speeds this up more than waiting passively."
        },
        {
          q: "What content formats get cited most often by AI answers?",
          a: "Direct-answer paragraphs, definition blocks, comparison tables, step-by-step lists, and FAQ sections are cited most often because they map cleanly to how engines assemble answers. Original statistics and research are especially quotable because no competitor can reproduce them. Structuring a page around clear, self-contained passages gives an engine many discrete things to cite."
        },
        {
          q: "Can I block AI engines from using my content but still get cited?",
          a: "Generally no, because citation requires the engine to retrieve and read your page. If you disallow an engine's crawler in robots.txt or block its retrieval bot, you remove yourself from the candidate pool it cites from. Most publishers who want AI visibility allow the relevant crawlers and use llms.txt to guide them toward their best content."
        },
        {
          q: "Does freshness affect whether AI engines cite my page?",
          a: "Yes, freshness is a strong signal for queries that are time-sensitive or about evolving topics. Live-retrieval engines favor recently updated pages with visible publish and update dates. Keeping a page current, restating its data, and updating its timestamp when you make real changes all improve its odds of being cited over a stale competitor."
        }
      ]
    },
    {
      type: "h2",
      text: "Keeping citation-worthy content organized with Dispatch"
    },
    {
      type: "p",
      text: "Citation-worthy content is built on a trail of prompts, briefs, source notes, and data points - the raw material behind every quotable passage. Dispatch is the system of record for AI, where teams keep those prompts and briefs organized, versioned, and reusable so the next writer can extend a winning page instead of rebuilding its reasoning from scratch. When your AEO inputs are as well-structured as the pages they produce, earning citations becomes a repeatable process rather than a lucky hit."
    }
  ],
}
