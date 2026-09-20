# Mixenza SEO working package

Start with [the main report](../SEO_AUDIT_MIXENZA_PAKISTAN.md), then use the tables below. CSV files are UTF-8 and can be imported into the team’s task system. None of these files changes the live store.

| File | Use |
| --- | --- |
| [Requirements coverage](requirements-coverage.md) | See completed fields and explicit access limitations |
| [Keyword map](keyword-map.csv) | 139 Pakistan keyword candidates with intent, page, cluster and evidence status |
| [Category copy](category-copy.md) | All 15 buckets; intros, bottom copy, FAQs, links and decisions |
| [Metadata database](metadata-database.csv) | 48 exact URL/title/meta/H1 records |
| [Six-month calendar](six-month-content-calendar.csv) | 50 topics with secondary keywords and resolved product/category URLs |
| [Top 10 briefs](top-10-content-briefs.md) | Titles, metas, reader, H2/H3 outline, questions, evidence and CTAs |
| [Internal links](internal-links.csv) | 50 exact source/target/anchor opportunities |
| [Existing articles](existing-content-audit.csv) | 21 record-level editorial decisions and alias risks |
| [URL decisions](url-decisions.csv) | Retained slugs and exact legacy-ID redirects |
| [Competitor evidence](competitor-evidence.md) | Direct HTML observations with source URLs |
| [Backlinks](backlink-opportunities.md) | 30 vetted types/prospects and outreach assets |
| [HTTP crawl](http-crawl.csv) | Statuses, redirect chains, metadata, canonicals and schema counts |
| [Partial crawl depth](sample-crawl-depth.csv) | Discovery evidence; not a definitive orphan audit |
| [Live evidence](live-evidence.json) | Timestamped raw observations supporting findings |

Reproduce the evidence with `node scripts/seo-evidence.mjs`. Generate working tables with `node scripts/build-seo-deliverables.mjs`. Regeneration overwrites generated working files; edit editorial-data.mjs to change category/topic drafts. The main report and backlink brief are authored separately.
