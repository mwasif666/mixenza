// Prints an apply_patch patch. It does not modify the authored report itself.
import fs from 'node:fs';
import {categories,topics} from '../seo-deliverables/editorial-data.mjs';
const name='SEO_AUDIT_MIXENZA_PAKISTAN.md';
const original=fs.readFileSync(name,'utf8');
const section=process.argv[2];
const extract=n=>{const marker='## '+n+'\n';const start=original.indexOf(marker);if(start<0)throw Error('Missing section '+n);const end=original.indexOf('\n## ',start+marker.length);return original.slice(start,end<0?undefined:end).trimEnd();};
const content=n=>fs.readFileSync('seo-deliverables/'+n,'utf8').replace(/^# [^\n]+\n/,'').replace(/^## /gm,'### ').trim();
const matrix=(cols,rows)=>'| '+cols.join(' | ')+' |\n| '+cols.map(()=>'---').join(' | ')+' |\n'+rows.map(r=>'| '+r.map(x=>String(x).replace(/\|/g,'\\|')).join(' | ')+' |').join('\n');
const fragments={};
fragments['Category SEO']='[Editable category copy](seo-deliverables/category-copy.csv) covers every source category, including decisions for the two generic buckets. Category metadata is also in the consolidated database.\n\n'+content('category-copy.md');
fragments['Product SEO']=content('product-implementation.md').replaceAll('(url-decisions.csv)','(seo-deliverables/url-decisions.csv)');
fragments['Keyword Research']='[Editable keyword map](seo-deliverables/keyword-map.csv) contains 139 candidates with all requested fields: keyword, intent, recommended page, current page, new-page decision, priority, cluster, funnel and evidence status. Search volume requires Keyword Planner/Ahrefs/Semrush verification. Roman Urdu variants are hypotheses for validation, not measured queries.\n\n'+extract('Keyword Research').split('\n').slice(1).join('\n').replace('/shop/kitchen-gadgets','/shop/kitchenware').replace('Rename/migrate','Improve label; retain URL')+'\n\nCannibalization here means an architecture risk, not a proven ranking conflict. Use GSC query-to-page exports to confirm whether URLs alternate for the same query and user task. Keep electronics focused on gadgets, Home Essentials on practical household needs, and Home & Lifestyle on decor. A money-counting machine is not a UV detector; no stock of counting machines was established, so do not target that term with a misleading product/category page. City variants belong in one accurate delivery policy, not six cloned city pages.';
fragments['Competitor Analysis']=content('competitor-evidence.md')+'\n\n'+matrix(['Segment','Verified/discovered examples','Implication'],[
 ['A. Large marketplaces','Daraz massage-gun results; Markaz kitchenware','Compete on specific product information and support, not inventory breadth.'],
 ['B. Niche gadget stores','MZ Trends search discovery; D-Tech live homepage','Use problem-led categories. MZ Trends raw HTML is minimal; absence of rendered schema cannot be confirmed.'],
 ['C. Kitchen/home','WeHome and Traderz category HTML','Both supply descriptive category context and links; adopt useful guidance without copying wording or claims.'],
 ['D. Product-specific','Spector Gadgets fan; Action.pk water pump; Galaxiee massagers','Model-specific pages match transactional searches. Compare complete offers including shipping.'],
 ['E. Content','Galaxiee massage buying guide; Pakistani reviewer videos surfaced in search','Use original tests and documented limitations. Do not repeat competitor medical claims.']
 ])+'\n\nCategory depth: WeHome exposes granular kitchen navigation and FAQs; Markaz separates kitchen types and budgets; Traderz has commercial category copy. Galaxiee has a collection plus an Article-marked buying guide. Spector and Action contain Product JSON-LD. Traderz returned more than one BreadcrumbList object; that is a duplication to inspect, not automatically a validation error. Mixenza returned no JSON-LD in the sampled templates. Source schema was identified from raw HTML, not passed through Rich Results Test. Competitor backlinks, traffic, ranking positions and link strengths: Requires verification in Google Search Console / Google Keyword Planner / Ahrefs / Semrush.';
fragments['Site Architecture']=`Retain existing public paths to protect any undiscovered history. A logical parent does not require a nested URL. Improve labels and inventory assignments first.

\`\`\`text
/
├── /shop                              All products
│   ├── /shop/electronics-gadgets        Broad electronics parent
│   │   ├── /shop/portable-fans
│   │   ├── /shop/money-detectors
│   │   └── /shop/office-accessories
│   ├── /shop/kitchenware               Label: Kitchen Gadgets & Accessories
│   │   └── /shop/drinkware
│   ├── /shop/home-essentials            Functional household products
│   │   ├── /shop/cleaning-products
│   │   └── /shop/organizers
│   ├── /shop/home-lifestyle             Decor and room accessories
│   └── /shop/health-beauty
│       ├── /shop/hair-care
│       └── /shop/wellness
├── /product/{existing-slug}             One canonical per product
├── /blog/{new-guide-slug}               Keep existing editorial route
└── /pages/{about,contact,faqs}           Rewrite existing pages
    /pages/{shipping,returns,privacy,terms}  New factual policies
\`\`\`

The 15 current category buckets contain 208 bundled products; Shop (87) and General (20) need reassignment. Preserve product URLs when moving categories. A small category can remain useful if it answers a distinct task; there is no minimum SKU count dictated by Google. Do not publish extra subcategories simply to occupy keywords.

Wholesale decision: 147 bundled product names contain “Minimum Order Quantity,” while product/cart templates behave like retail. This does not prove that Mixenza offers wholesale; it proves unresolved imported terms. Confirm unit price, pack quantity, MOQ and available stock per SKU. Temporarily disable ambiguous offers until confirmed. If wholesale is real, introduce /wholesale with separate quantity tiers and enquiry/order rules; distinct bulk offers may have their own pages. Do not remove MOQ wording while leaving a conditional per-unit price purchasable as one retail piece.`;
fragments['Homepage SEO']=`Primary commercial target: useful products online Pakistan. Secondary: online shopping Pakistan, useful gadgets, home essentials, kitchen tools. Broad “online shopping Pakistan” is a long-term supporting target, not a promised near-term win.

Title: Useful Gadgets & Home Products in Pakistan | Mixenza

Meta: Browse useful gadgets, kitchen tools and everyday home products at Mixenza. Compare PKR prices and product details, and contact us for help choosing.

H1: Useful everyday products for homes in Pakistan

Recommended page order: H1/value statement → category links → stocked product cards → comparison help → factual support block → relevant guides → FAQs → policy footer. Give the tumbler campaign an H2/H3. The current H1 exists but only says “Sip in style, all day long.”

### Ready-to-use homepage copy

**Useful everyday products for homes in Pakistan**

Find practical products for the kitchen, home, desk and personal routine. Browse Mixenza’s gadgets and everyday accessories, compare prices in Pakistani rupees, and choose the items that fit your needs.

**H2: Shop by what you need**

**H3: Kitchen tools for everyday preparation** — Explore choppers, weighing tools and kitchen accessories. Check the size, capacity and care instructions before choosing. [Browse kitchen tools](/shop/kitchenware).

**H3: Practical products for your home** — Compare bottle pumps, organisers and cleaning tools by fit and purpose. [Explore home essentials](/shop/home-essentials).

**H3: Portable fans and useful gadgets** — Find personal cooling options, desk accessories and small electronics. Compare charging and controls on the exact model. [Browse portable fans](/shop/portable-fans).

**H3: UV tools for cash inspection** — Compare pen-style and handheld UV inspection tools. Check their limitations and the banknote issuer’s guidance before use. [View money detectors](/shop/money-detectors).

**H2: Take a closer look before you buy**

Open a product page to check the current price and available information. Look at measurements, included accessories and compatibility, and ask us about anything that is missing. A similar-looking item may have different specifications.

**H2: Need help choosing?**

Contact Mixenza at mixenza@gmail.com or +92301-3769247 for product and order questions. Share the product name or link so the team can help with the right item. [Contact Mixenza](/pages/contact).

**H2: Guides for practical choices**

Learn what to compare in a money detector, bottle pump or kitchen scale. Our buying guides will link to the relevant products and explain what to check before ordering. Publish this block only when the approved guides are live.

**H2: Common questions**

- What does Mixenza sell? Mixenza lists home and kitchen tools, personal-care accessories, portable fans, UV inspection tools and other everyday products.
- Which currency are prices in? Prices are displayed in Pakistani rupees (PKR).
- How can I check whether a product fits? Compare its listed dimensions or model requirements; contact support if a measurement is missing.
- Does Mixenza deliver to my city? Contact support to confirm service and charges for your address until the verified delivery estimator and policy are available.
- Is cash on delivery available? The current checkout displays COD, but fulfilment is not verified by this audit. For publishable copy until order integration is complete: “Please contact support to confirm the available payment options for your order.”
- How do returns work? Request the applicable terms before ordering until an approved return policy is published; do not repeat the unsupported free 14-day return claim.

Nationwide-delivery copy may be activated after operational confirmation: “Delivery is available across Pakistan within our courier coverage. Check the fee and estimated delivery time for your address before confirming an order.” Do not state free shipping, every address, COD or a delivery duration without confirmed rules.

Schema: Organization and WebSite with real identity/contact details. Google retired sitelinks search-box display in 2024, so SearchAction has no priority here. [Google announcement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box).`;
fragments['Existing Content Audit']='[Record-by-record CSV](seo-deliverables/existing-content-audit.csv).\n\n'+content('existing-content-audit.md');
fragments['New Content Strategy']=content('six-month-content-calendar.md')+'\n\n### Top ten detailed content briefs\n\n'+content('top-10-content-briefs.md');
fragments['Internal Linking']=content('internal-links.md')+'\n\nEvery proposed link must resolve to a useful published 200 page. Homepage → category links should be ordinary anchors. Blog → category links follow selection advice; blog → product links belong beside exact-model discussion. Product → category belongs in the breadcrumb; category → product uses visible cards; product → related product explains the difference; category → related category reflects the next task. Do not add an identical exact-match anchor to every paragraph. For new guides, include one relevant same-cluster guide only after both pages exist.';
fragments['Backlink Strategy']=content('backlink-opportunities.md');
fragments['Metadata Database']='[Editable 48-row metadata CSV](seo-deliverables/metadata-database.csv).\n\n'+content('metadata-database.md');
fragments['Priority Matrix']=`P0 means a revenue, misleading-offer or trust defect requiring immediate attention. P1 means high-priority discovery/relevance work. P2 improves quality or performance after foundations. P3 is optional or data-gated.

${matrix(['Quadrant','Mixenza work'],[
 ['Quick wins','Remove default ratings, wrong policy links, irrelevant brand tags and contradictory support/shipping claims; correct duplicated title suffix.'],
 ['High impact / low effort','Accurate homepage/category metadata; self-canonicals; approved sitemap; replace About/FAQ template copy; link useful categories.'],
 ['High impact / high effort','Persist real orders and validate totals; verify MOQ/price basis/stock; classify 107 generic-category records; full product descriptions; optimised catalog delivery and original photos.'],
 ['Low priority','Cosmetic URL changes, SearchAction, artificial city pages, mass subcategories and broad news.']
 ])}

Top ten issues, in order: order persistence; accurate unit/pack offers; fake ratings and conflicting policies; About/FAQ integrity; utility/demo/alias index decisions; canonical/title metadata; product/category data; crawlable catalog and image performance; revenue tracking validation; product-led content and earned mentions.`;
fragments['90-Day SEO Roadmap']=matrix(['Period','Task','Priority','Expected impact','Difficulty','Responsible','Dependency / acceptance'],[
 ['Days 1–7','Create server order flow; remove simulated success','P0','Restores measurable conversion capability','High','Backend + frontend','Persist unique order ID; reject invalid stock/price/shipping; test failure without false confirmation'],
 ['Days 1–7','Confirm unit price/MOQ for 147 flagged records and stock','P0','Prevents misleading or unfulfillable orders','High','Merchandising + operations','Pause uncertain offers; explicit retail/bulk decision'],
 ['Days 1–7','Remove default stars, fake urgency and conflicting delivery/support claims','P0','Improves credibility','Low','Frontend + operations','No stars without real review records; single approved policy source'],
 ['Days 1–7','Rewrite About/FAQ; correct policy links','P0','Provides business/transaction information','Medium','Content + operations','Real business identity and approved shipping/return/payment facts'],
 ['Days 1–7','Capture GSC/GA4 baseline and URL inventory','P1','Protects history and makes outcomes measurable','Medium','SEO + analytics','Account access; record unknown baseline rather than zeros'],
 ['Days 8–14','Retain useful URLs; redirect aliases; remove/noindex junk','P1','Consolidates discovery and relevance','Medium','SEO + frontend','Check URL clicks/backlinks/logs; correct 301/404/410 and crawlable noindex'],
 ['Days 8–14','Add canonical/title metadata, robots and sitemap','P1','Improves search understanding','Medium','Frontend','Correct origin; canonical 200 URLs only; noindex URLs not robots-blocked'],
 ['Days 8–14','Assign 107 Shop/General records','P1','Improves browsing and category relevance','High','Merchandising + SEO','Taxonomy confirmed; product URLs preserved'],
 ['Days 15–30','Write 20 priority products and useful categories','P1','Better qualified visits and purchase decisions','High','Content + merchandising','Verified specifications, current stock and original images'],
 ['Days 15–30','Add Product/Offer/Breadcrumb and site schema','P1','Potential product-result eligibility','Medium','Frontend + SEO','Schema matches visible data; Rich Results Test passes'],
 ['Days 15–30','Implement crawlable pagination and bounded data payloads','P1','Improves discovery and mobile load cost','High','Frontend/backend','Distinct page URLs; no duplicate products or infinite states'],
 ['Days 15–30','Verify GA4 ecommerce and order reconciliation','P1','Accurate organic order/revenue reporting','Medium','Analytics + backend','One purchase per actual order; PII excluded; PKR currency'],
 ['Days 31–60','Publish distinct approved briefs and contextual links','P2','Builds long-tail discovery','High','Content + SEO','Avoid overlapping guides; show genuine model evidence'],
 ['Days 31–60','Merchant Center beta-market pilot','P2','Additional product discovery where eligible','Medium','SEO + feed developer','Pakistan destination eligible; checkout/policies/feed match'],
 ['Days 31–60','Measure mobile CWV and optimise images/scripts','P1','Improves real user experience','High','Frontend + QA','PSI/lab plus field baseline; regression checks'],
 ['Days 61–90','CTR/positions 4–20 optimisation','P1','Uses existing impressions more effectively','Medium','SEO','Pakistan query-page-device segments; avoid arbitrary aggregate CTR targets'],
 ['Days 61–90','Targeted editorial outreach','P2','Earns useful referral traffic/mentions','Medium','PR/content','Original asset ready; prospect verified; no paid-link scheme'],
 ['Days 61–90','Review revenue, COD cancellations and content assists','P1','Aligns SEO with realised sales','Medium','Analytics + operations','Order-status exports; same attribution and comparison windows']
 ]);
fragments['KPIs']=`Use a comparable 28-day baseline and the same Pakistan/device filters each month. Set numeric business growth targets after revenue and margin baselines exist; no ranking or traffic forecasts are supported yet.

${matrix(['KPI','Definition/source','Monthly decision'],[
 ['Organic clicks / impressions','GSC web search, Pakistan','Separate brand and non-brand; report categories/products independently'],
 ['Non-brand clicks','Exclude Mixenza and observed spelling variants; document regex','Find acquisition beyond existing brand searches'],
 ['Category / product page clicks','GSC path groups /shop/ and /product/','Evaluate revenue-priority landing pages, not broad blog growth alone'],
 ['CTR','Clicks / impressions within comparable query-position-device cohorts','Test title/snippet changes; never interpret rank shifts as pure CTR wins'],
 ['Approved indexed URLs','GSC inspection/indexing against approved inventory','Distinguish not indexed from blocked/duplicate/intentional exclusion'],
 ['Top 3 / 10 / 20','A fixed Pakistan keyword cohort and consistent rank tool; alternatively label GSC average-position buckets as averages','Do not report fluctuating query samples as exact daily rankings'],
 ['Organic add-to-cart / checkout / purchases','GA4 session-source attribution, event deduplication, stable item IDs','Locate product-to-cart and checkout drop-offs'],
 ['Organic order revenue','GA4 orders; reconcile backend IDs','Detect missing/duplicate analytics and unsupported success screens'],
 ['Organic realised revenue','Fulfilled/collected COD orders less refunds/cancellations, using documented attribution','Measure actual sales rather than uncollected COD order totals'],
 ['Organic conversion rate','Organic sessions with an order / organic sessions; also report fulfilled-order rate separately','Do not change denominator between months'],
 ['Revenue per organic visitor','Attributed revenue / organic users (specify order vs realised revenue)','Segment by landing-page type and device'],
 ['Average order value','Revenue / corresponding order count','Look for useful complements, not misleading price promotions'],
 ['Field CWV','75th percentile mobile LCP/INP/CLS; GSC/CrUX','Target good thresholds where sufficient data exists'],
 ['Content assists','GA4 paths plus category/product clicks from guides','Keep useful guides, consolidate pages without commercial or informational value']
 ])}

Operational completion targets for the first 30 days: audit 100% of the 147 MOQ-labelled products before enabling ambiguous offers; classify all 107 generic-category products; remove all hardcoded review claims in active flows; deliver distinct metadata and self-canonicals for every approved indexable URL; reconcile every staging test order across backend and analytics without duplicates. These are team acceptance targets, not predicted organic growth.

Monthly reporting structure: reporting period and comparison → attribution/data-quality note → order and realised organic revenue → non-brand and page-type visibility → query/page opportunities → indexing/CWV → shipped changes and observed outcomes → next month's owners and deadlines. Mark unavailable metrics UNKNOWN, never zero.`;
fragments['Exact Next Actions']=`### Developer Tasks

- [ ] Replace checkout setDone-only submission with a server order request and persisted order ID; never show success on an error.
- [ ] Recalculate product prices, quantities, stock, discounts and shipping on the server; ignore client ship parameter as authority.
- [ ] Make repeat add-to-cart merge the same variant, keep selected quantity separate from stock, and persist/recover carts deliberately.
- [ ] Remove unimplemented payment choices and fake payment/trust badges; make Buy Now enter checkout with the chosen item.
- [ ] Remove hardcoded review counts, countdown urgency, viewer counts, fixed delivery dates and supplier tags from active/shared components.
- [ ] Remove nested demo menus rather than only hiding them with CSS; verify the rendered header and links at mobile widths.
- [ ] Implement exact UUID/query alias 301s from url-decisions.csv; preserve current product/category slugs.
- [ ] Add self-canonicals, unique metadata, truthful JSON-LD, crawlable page links, robots and approved sitemap.
- [ ] Keep noindex/404/410 routes crawlable until Google can process the directive; omit them from sitemap.
- [ ] Bound catalog fetching by category/page; provide honest unavailable states if live offer data fails instead of silently selling stale fallback stock.
- [ ] Enable image optimisation on supported Cloudinary images, retain reserved aspect ratios, and measure before/after payload and LCP.
- [ ] Connect policy footer links to separate factual pages and add accessible labels to checkout fields.

### SEO Tasks

- [ ] Review all 79 HTTP evidence rows and compare with the approved full URL inventory.
- [ ] Export GSC history/backlinks before retiring any article, demo alias or product URL.
- [ ] Validate the 139 candidate keywords in Pakistan Keyword Planner/Ahrefs/Semrush; record device/location/date for SERP checks.
- [ ] Assign each commercial cluster one primary category and each product its exact-model intent.
- [ ] Implement the 48 metadata records; do not publish gated subcategories until useful inventory and distinct intent exist.
- [ ] Apply 50 internal-link opportunities only after their target pages are useful and live.
- [ ] Run Rich Results Test and a full rendered crawl after deployment; confirm unknown orphan/mobile findings.

### Content Tasks

- [ ] Replace About celebrity copy and all Mango.com FAQ answers with real business/support information.
- [ ] Verify the legal business identity, service hours, delivery coverage, prices, payment methods, warranties and returns with operations.
- [ ] Review all 147 MOQ-labelled offers; confirm unit/pack price and distinguish retail from wholesale before rewriting claims.
- [ ] Assign the 107 Shop/General products and write the category intros, guidance and FAQs from category-copy.csv.
- [ ] Rewrite 20 priority products from exact-model specifications and add full descriptions beyond the current 140-character excerpt.
- [ ] Review all 21 blog records and aliases using existing-content-audit.csv; preserve valuable URLs or close replacements.
- [ ] Use the six-month calendar and ten briefs; merge overlapping fan/UV topics rather than publishing thin variants.

### Design/CRO Tasks

- [ ] Put true delivered cost, payment options and return eligibility next to purchase decisions.
- [ ] Provide dimensions, package contents and original unit photographs, especially for pumps, fans, tumblers and UV tools.
- [ ] Distinguish Add to Cart and Buy Now; show honest empty-cart, stock-error and no-review states.
- [ ] Verify 360px and 390px layouts, keyboard use, visible field labels, modal dismissal and checkout without horizontal overflow.
- [ ] Replace global fashion modals, foreign shipping destinations and fabricated scarcity copy.

### Google Search Console Tasks

- [ ] Verify Domain property and retain existing properties/history; submit only the new canonical sitemap.
- [ ] Inspect home, 13 useful categories, 20 products and representative revised/new articles after deployment.
- [ ] Export Pakistan query/page/device data for baseline and every monthly comparison.
- [ ] Investigate crawled/discovered-not-indexed, canonical conflicts and soft 404s; do not request indexing indiscriminately.
- [ ] Review field CWV if data exists; record no-data conditions explicitly.

### Off-Page SEO Tasks

- [ ] Prepare an original fan, kitchen-tool or cash-inspection asset before pitching.
- [ ] Qualify the 30 prospect types; the three named publishers are active, but placements are not secured.
- [ ] Seek honest independent coverage, relevant genuine supplier mentions and accurate business citations.
- [ ] Disclose paid/gifted collaborations appropriately; reject ranking-link packages and mass submissions.

### Top 10 Actions to Start Today

1. Make checkout create a real server-validated order; return an order ID and test error handling.
2. Verify the 147 MOQ-labelled offers and 199 repeated stock=1 records; pause ambiguous unit/pack prices or stock.
3. Remove default stars/review counts and hardcoded urgency, delivery dates and viewer numbers.
4. Replace About/FAQ template content, confirm real policies, and repair policy/social links.
5. Capture GSC/backlink history and approve URL decisions before removing demo or article routes.
6. Deploy alias 301s, canonicals, unique titles, crawlable noindex rules and an approved sitemap.
7. Reclassify the 107 Shop/General products while retaining established product URLs.
8. Publish the category copy and 20 reviewed product records with accurate Product/Offer/Breadcrumb data.
9. Verify GA4 purchase IDs against backend orders and track realised COD revenue separately.
10. Publish the first distinct product-led guides with the prepared internal links, then pitch original evidence to relevant Pakistan publishers.`;

const techAppend=`

### Additional verified defects and acceptance criteria

${matrix(['Issue','URL / source','Severity','SEO or revenue impact','Exact fix'],[
 ['No real order submission','/checkout; src/app/checkout/page.tsx','P0','Simulated success cannot establish revenue','Call order API, store order, validate totals/stock and use returned ID; no purchase analytics on setDone'],
 ['Shipping controlled by query parameter','/checkout?ship=...','P0','Incorrect delivered total and offer trust','Calculate rates server-side; reject invalid/negative rates and unsupported destinations'],
 ['Repeated cart adds append duplicates','src/context/CartContext.tsx ADD_TO_CART','P1','Quantity/total confusion and checkout friction','Merge by product+variant; test repeat clicks and quantity updates'],
 ['MOQ and stock ambiguity','147 MOQ-labelled titles;199 stock=1 in fallback snapshot','P0','Potentially wrong unit prices and false scarcity','Reconcile admin stock and pack/MOQ pricing; do not infer retail availability from bundled snapshot'],
 ['Stale fallback masks API failure','src/lib/backendCatalog.ts','P1','Removed/outdated offers can reappear','Use validated last-known-good catalog for browsing with freshness policy; require live server validation for orders'],
 ['Full description not shown','SourceProductDetail displays description.slice(0,140)','P1','Missing compatibility/use information despite source data','Render editorial short and long descriptions separately, with factual specification table'],
 ['Incorrect supplier brand assignment','backendCatalog maps DARAZ SKU to Pickora.pk, others to Mixenza','P1','Misleading manufacturer/brand data','Separate seller, source and manufacturer fields; omit unknown brand in schema'],
 ['Nested theme menus and global modals','About/FAQ HTML and root modal components','P1','Hundreds of irrelevant links and misleading text in HTML','Remove unused components at render/import level; do not rely solely on CSS hiding'],
 ['Foreign estimator locations and fake quick-view claims','Global modal HTML includes France/Spain/UK/USA, 1.234 reviews, 38 viewers and January dates','P0','Misleads Pakistan shoppers when modal is opened','Build estimator from confirmed Pakistan coverage; remove non-data-backed claims'],
 ['Correct status handling found','Random missing top-level and product URLs','Pass','Both returned HTTP 404 in sample','Keep correct status; test deployed streamed route behavior'],
 ['Correct slash redirect found','/shop/ → /shop','Pass','308 single-hop normalisation','Retain consistent no-trailing-slash internal links'],
 ['Temporary demo redirect','/shop/breadcrumb1 → /shop','P1','307 alias remains temporary','Use permanent 301 for this verified equivalent; do not treat every demo as a live independent page']
 ])}

Measured sample: home response body 106,698 bytes; shop 562,252 bytes; kitchen category 553,464 bytes; JC-205 product 74,757 bytes. These are decompressed HTML bytes, not compressed wire transfer or total page weight. The shop response headers took about 3.2s in this one remote sample; that is not a field TTFB baseline. The source fetches all catalog pages with no-store and up to a 15-second timeout and serializes the full result into SourceCatalog. Investigate bounded backend queries and request-level deduplication before selecting a cache policy; stock freshness must be preserved.

Mobile/CWV/unused-script measurements are **unverified**, because no browser provider or field-data account was available. Run mobile Lighthouse/PSI on home/category/product/checkout, review the actual LCP element, JavaScript coverage and network waterfall, and obtain GSC/CrUX mobile 75th-percentile data. Good targets are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; no failing values were invented. [Web Vitals definitions](https://web.dev/articles/vitals).

Pagination already renders the first 24 cards in server HTML; client state controls later pages. Add real href pagination and fetch/render that page on the server, self-canonicalising each useful page. Sorting/tracking copies can canonicalise to their equivalent, while unsupported facets get crawlable noindex; do not canonicalise dissimilar content indiscriminately. [Google ecommerce URL guidance](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites).

Robots is not a removal mechanism: Google must fetch a page to see noindex. Keep retiring URLs crawlable while their noindex/404/410 is processed; robots disallow can be considered later for crawl traps where noindex discovery is not needed. [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).`;
fragments['Technical SEO Audit']=extract('Technical SEO Audit').split('\n').slice(1).join('\n')+techAppend;
fragments['E-E-A-T / Trust']=`Live [About](https://mixenza.com/pages/about) contains Pippa Middleton/Kim Kardashian fashion copy, and [FAQs](https://mixenza.com/pages/faqs) repeatedly mention Mango.com. Footer Shipping and Privacy links both lead to FAQs; Returns leads to order tracking; social icons lead to platform homepages. These are verified destination/content problems, not merely missing SEO keywords.

The Contact page does contain mixenza@gmail.com, +92301-3769247 and Mon–Sat 10am–7pm PKT support hours. Those conflict with homepage 24/7 messaging. It describes Pakistan coverage, while the homepage Benefit component says worldwide shipping. A Karachi office, legal seller identity, courier contract, active payment integrations and actual response times were not verified.

Publish one approved source of business facts. Replace the placeholder social links with owned profiles only after ownership confirmation. Show the real business name and support route; provide an address where operationally appropriate, not an invented location. The customer-feedback page and demo review sources need order-level provenance before reuse. Named theme authors are not evidence of real expertise. Guides need accountable authors, primary sources, original photos and dates of substantive updates.

For each shipping/return/payment policy, specify coverage, fees, dispatch vs transit time, exclusions, who pays return carriage, request method and refund method after operations/legal review. Do not manufacture terms in an SEO copy rewrite. Support links should resolve to those exact policies rather than an FAQ page with unrelated text.

Google Business Profile requires qualifying in-person contact. An online store with courier delivery alone is not enough. No fake city pages or rented-address profiles; use consistent public identity on real profiles and genuine partner listings. [Google eligibility rules](https://support.google.com/business/answer/13763036?hl=en).`;
fragments['CRO Recommendations']=extract('CRO Recommendations').split('\n').slice(1).join('\n')+`\n\n### Checkout and offer acceptance tests\n\nBefore acquiring more paid or organic traffic, prove: one valid COD order is persisted once; retries do not duplicate it; failed requests keep the cart and show an error; stock and final delivered cost are server-authoritative; an unavailable card method cannot be selected; quantity=2 is correctly reflected; repeated Add to Cart clicks do not duplicate the same variant; refresh behavior is intentional; Buy Now and Add to Cart do distinct things. Test in staging without creating real orders from this audit.\n\nDiscount display: originPrice and discountPrice produce sale percentages, but historical reference-price validity is unverified. Keep only defensible comparison prices; do not use importer MRPs as automatic proof of a genuine discount. On small screens show current price, selection, stock, delivery cost and CTA before long copy. Remove surprise newsletter interruptions and irrelevant fashion quick-view controls. WhatsApp links must use the confirmed business number and should not claim a response time or automatic order confirmation that is not implemented.`;
fragments['Search Console Strategy']=extract('Search Console Strategy').split('\n').slice(1).join('\n')+`\n\n### Revenue instrumentation specification\n\n${matrix(['Event','Exact trigger','Required context','Validation'],[
 ['view_item_list','Visible category/search/home product list','item_list_id/name, stable item_id, item_category, price, index','Do not repeatedly count invisible pagination pages'],
 ['select_item','User opens one product from a list','Same list context and selected item','Keep identity consistent on the product page'],
 ['view_item','Valid product detail becomes visible','item_id, item_name, PKR, price','No event for 404 or phantom fallback offers'],
 ['add_to_cart','Cart successfully changes','Selected quantity and variant, current unit price, PKR value','Count actual increment; errors must not emit success'],
 ['begin_checkout','User reaches valid checkout with items','Items and corresponding monetary values','Empty cart is not a started order'],
 ['purchase','Backend accepts and persists order','Unique transaction_id, items, value, currency=PKR, shipping/tax separately','Deduplicate reloads/retries; never trigger from setDone alone'],
 ['search','User submits search','search_term with no personal data','Avoid sending typed phone numbers/emails or private order IDs']
 ])}\n\nChoose a documented GA4 value convention and apply it consistently; report shipping and tax in their own fields. COD order placement is an order, not collected cash. Join transaction IDs to fulfilled/cancelled/refunded status for realised revenue. Send refund adjustments where implemented and disclose attribution differences between GA4 and backend reports. Enable Google Ads/Meta events only if the business uses those channels; deduplicate server/client conversions and apply the required consent handling. Do not put personal information in analytics payloads. [GA4 ecommerce reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce).\n\nCTR shortlist: use the last 28 days, Pakistan, non-brand, device and page; initially consider at least 100 impressions if the site has sufficient data, otherwise extend the period. This threshold is a working rule, not a search-engine standard. Compare queries at similar positions; inspect the actual SERP, improve misleading titles and snippets, annotate the change, and compare another equivalent period. Positions 4–20 are an opportunity filter only; choose pages with matching products and revenue potential. Average position is not a fixed daily rank.`;
fragments['Schema']=extract('Schema').split('\n').slice(1).join('\n')+`\n\nUse one stable entity ID per organisation/site/product; avoid emitting independent conflicting Product objects in both layout and detail components. Output JSON-LD safely and escape less-than characters in serialized user-controlled data. Offer availability must use confirmed stock and price must match the visible purchasable unit/pack; include genuine shipping/return policy data only once verified. Omit manufacturer brand/GTIN if unknown; seller identity is separate.\n\nNo JSON-LD blocks were found on sampled Mixenza pages; this is an absence finding, not a validator-error count. CollectionPage/ItemList provide semantic organisation but do not automatically create a shopping carousel. Product/Offer and visible accurate content are the commercial priority. [Google product structured data](https://developers.google.com/search/docs/appearance/structured-data/product).\n\nVisible FAQs help customers, but Google FAQ rich results are restricted to eligible authoritative government/health sites; ordinary Mixenza shopping FAQs should not be budgeted as FAQ rich-result opportunities. [Google FAQ eligibility](https://developers.google.com/search/docs/appearance/structured-data/faqpage).`;
fragments['Image SEO']=extract('Image SEO').split('\n').slice(1).join('\n')+`\n\nObserved implementation: Cloudinary is already in next.config.js remotePatterns. Product cards/detail use unoptimized, so the configured Next.js image service is bypassed there. Existing aspect-ratio containers reserve display space. Database image alts are often empty but rendered product images already use product.name; do not report all live alts as missing. Improve gallery-specific alts (front, controls, package) based on what the photo actually depicts.\n\nThe home slider marks multiple images as priority and global logo/modal images also contribute requests. Identify the actual mobile LCP element before changing priority; preload only the essential above-fold image, resize Cloudinary output to displayed width, and lazy-load other photos. Actual image-byte measurements, cache headers, content types, AVIF/WebP negotiation and the effect on LCP remain to be profiled in a browser waterfall. Renaming existing indexed image URLs has little benefit without preserving redirects; use descriptive filenames for new photography.`;

if(!fragments[section])throw Error('No replacement for '+section);
const old=extract(section);
const replacement=('## '+section+'\n\n'+fragments[section]).replaceAll('/guides/','/blog/').replaceAll('/shop/kitchen-gadgets','/shop/kitchenware').replaceAll('/shop/wellness-massagers','/shop/wellness').trimEnd();
process.stdout.write('*** Begin Patch\n*** Update File: '+name+'\n@@\n'+old.split('\n').map(l=>'-'+l).join('\n')+'\n'+replacement.split('\n').map(l=>'+'+l).join('\n')+'\n*** End Patch');
