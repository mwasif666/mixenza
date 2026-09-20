# Product SEO and URL implementation specification

The 20 products in metadata-database.csv are an editorial priority set based on available inventory and observed search intent, not verified best sellers or highest-margin products. Sales, margin and conversion prioritisation require store analytics. All 20 URLs returned 200 in the refreshed HTTP sample; this does not prove stock can be fulfilled.

## Representative product findings

| Product / current URL | Verified observation | Exact content or merchandising fix | Unique buying task |
|---|---|---|---|
| JC-205 UV detector `/product/pickora-1972612611` | Live title/description identifies rechargeable 365nm tool; repeated title suffix, default ratings, seller-as-brand | Validate wavelength, charging input, dimensions and supplied cable; explain inspection limitations; remove unsupported manufacturer identity | Rechargeable handheld UV inspection |
| ERITE detector `/product/pickora-1963263814` | Live description names 395nm UV plus marker; no visible evidence confirming applicability to every note | Separate marker and UV functions; validate compatible currency/paper rather than declaring every note genuine/fake | Pocket UV/marker tool |
| Mini hand fan `/product/pickora-1965017109` | Short description promises broad use but no measured runtime | Photograph controls and port; publish measured weight/runtime by speed or leave unknown | Simple portable personal airflow |
| Display hand fan `/product/pickora-1966895078` | Source says 800mAh, Type-C, five speeds and display; these are claims, not independent measurements | Verify exact model and test results; compare with simple fan by weight/control/runtime, not invented superiority | Display and speed-control comparison |
| Massage gun `/product/pickora-1973702573` | 5-in-1 title; description lists four heads and six speeds | Show package photo and explain naming; validate charger and instructions; remove treatment claims/default ratings | Choosing included heads/controls |
| Water pump `/product/pickora-1971400774` | Source says 1200mAh and USB; bottle fit not shown in rendered specification rows | Measure bottle-neck compatibility, hose length, adapter and contents; distinguish customer delivery from supplier freight | Fit with an existing bottle |
| Mist brush `/product/pickora-1970697444` | Source says 30ml tank; page exposes Pickora/Daraz tags as customer information | Verify tank volume/material; show filling/cleaning instructions; remove import-source labels | Detangling with a mist reservoir |
| Tumbler `/product/pickora-1971845697` | Title 40oz, description 1200ml; no tested insulation duration | Clarify approximate capacity; test seal and insulation before claims; do not infer genuine Stanley branding from another listing | Capacity, lid and care |
| Kitchen scale `/product/tos-8381141581985-digital-kitchen-weight-scale-machine` | Imported product record, generic specification table | Record maximum load, displayed resolution, verified units, tare, battery and model; do not borrow another SF-400 specification | Recipe weighing and capacity |
| Mini chopper `/product/tos-8381139779745-mini-food-chopper` | Name alone does not establish manual/electric mechanism | Photograph mechanism, bowl and blades; verify capacity and supported ingredients | Small-quantity chopping |
| Spray mop `/product/tos-8317065298081-water-spray-mop` | Bundled title includes carton MOQ; stock=1 | Resolve price per piece vs required carton first; measure handle/pad/tank; identify compatible floors from guidance | Delivered unit and floor-care suitability |
| Blender `/product/tos-8349003153569-silver-crest-4-in-1-hand-blender-set` | Brand appears in supplier title; authenticity not established | Confirm actual model/manufacturer and attachments; photograph label; do not invent official warranty | Blending and included accessories |

Every product currently uses a description slice near the title and generic brand/category/SKU/stock rows. This is not a full specification sheet. The first task is displaying useful verified information, not padding descriptions to an arbitrary word count.

## Reusable product SEO template

- Title: `{Distinct product name} | Mixenza`; use `{Model or product} Price in Pakistan | Mixenza` where transactional price intent fits and the title remains readable. Brand appears once; title length is a display guideline rather than a hard character limit.
- Meta: `{What it is/use}. Compare {two model-specific decision factors} and current PKR price. {Useful next step without unsupported delivery claim}.` Write complete sentences; do not cut supplier descriptions at character 160.
- H1: the actual product name, model and distinguishing feature; omit supplier codes, review text and MOQ boilerplate. Keep meaningful pack quantity when the offer is for a pack.
- URL: preserve the existing canonical slug. New products get a durable descriptive slug. SKU remains an internal identifier rather than a reason to change a live URL.
- Short description: 40–80 words explaining the use and exact-model differentiator from documented facts.
- Feature bullets: 3–5 verified features; connect each to a practical use without promising medical, safety or durability outcomes.
- Long description H2s: Product overview; Key features; Specifications; How to use and care; What is included; Delivery and returns; Questions; Related options.
- H3s: model-specific choices beneath those sections, such as Bottle fit / Charging, or Display / Speed controls.
- Specifications: brand only if genuine; model; material; dimensions; power/input; charging; capacity; compatibility; pack quantity; MOQ; warranty source. Omit or label unknown values rather than inventing them.
- Shipping: show actual fee and dispatch/transit estimate for the entered destination, with link to `/pages/shipping` after it exists. No generic free-delivery label when charges apply.
- Returns: show applicable eligibility/window, exclusions, contact method and return cost from the approved policy; link `/pages/returns`.
- Trust: real business contact, original images, verified review records and clear seller/manufacturer distinctions. No random default stars or viewers.
- Internal links: one parent category, a selection guide and 2–4 relevant alternatives/complements. An accessory must actually fit the product before being recommended.
- Schema: one Product entity with its real Offer, PKR price and confirmed availability; visible BreadcrumbList. Do not emit stale fallback availability or fake ratings.

## Three example copy drafts

### JC-205 Rechargeable 365nm UV Money Detector

**Short description:** Compare the JC-205 handheld UV inspection tool for your cash-handling routine. The listing identifies a rechargeable 365nm model intended for viewing UV-reactive security features. Check the supplied charging accessories and the banknote issuer’s guidance before use; a UV light should not be presented as proof that a note is genuine.

**Benefits/features after model verification:** Handheld format for portable inspection; rechargeable design for repeated use with the specified charger; labelled wavelength to help compare detector types. Publish measured dimensions and package contents alongside those bullets.

**Specifications table:** model JC-205 and advertised wavelength 365nm are from the listing; charging input, dimensions, battery details and package contents need supplier-label/sample verification. Do not populate blank values from another product.

**FAQ:** Does it count money? No, this listing is for a UV inspection tool, not an automatic note counter. Does UV inspection guarantee authenticity? No; follow the relevant banknote-series guidance and use multiple checks. Which charger should I use? Follow the verified model input requirements; ask support if those are not supplied.

**Links:** `/shop/money-detectors`; `/product/pickora-1963263814` as a different-format alternative; `/blog/money-detector-price-pakistan` when published. CTA: “Check the current offer and ask about any missing specifications.”

### Automatic Rechargeable Water Dispenser Pump

**Short description:** Consider this rechargeable bottle pump when choosing an alternative to manually lifting and pouring a water container. Before ordering, compare the pump’s confirmed bottle-neck fit and included hose with your bottle. The listing describes USB charging and one-touch operation; ask for the charging requirements and cleaning instructions for the actual model.

**H2: Check compatibility before ordering.** A similar-looking bottle pump may use a different collar, hose or adapter. Show the neck measurement and supplied parts in a labelled photograph. Avoid “universal” unless the supported bottle range is documented.

**FAQ:** Does it fit every bottle? No universal fit is established by the audited listing; confirm dimensions. Is a charger included? Confirm package contents rather than assuming that USB charging includes an adapter. Can I use it for other liquids? Follow the manufacturer’s specified liquids and cleaning instructions.

**Links:** `/shop/home-essentials`, manual-pump alternative from the catalog, `/blog/water-dispenser-pump-pakistan` when live. CTA: “Confirm bottle fit before adding to cart.”

### Digital 5-Speed Rechargeable Hand Fan

**Short description:** This listing describes a compact rechargeable hand fan with a display and five speed settings. Compare it with the simpler mini fan if you are choosing personal airflow for a desk or travel. Confirm the exact charging connection, dimensions and measured runtime for the selected model before ordering.

**H2: Compare controls and real runtime.** Show the controls and display in original photos. The source lists an 800mAh battery and Type-C input, but those claims should be checked against the unit label. Publish runtime separately by speed and test conditions; do not infer it from mAh alone.

**FAQ:** Does it cool a room? Describe it as a personal fan, not an air conditioner or room-cooling replacement. Can it run while charging? Only if the model instructions support it. Is the advertised battery capacity a runtime guarantee? No; performance needs a model-specific measurement.

**Links:** `/shop/portable-fans`; `/product/pickora-1965017109`; the approved fan guide. CTA: “Compare the controls and current price.”

All copy above is a draft grounded in observed listings. Remove the editorial verification instructions from customer-facing copy after the facts are confirmed; do not publish internal audit language in the shop.

## Product URL migration decisions

See [the 30-row URL decision table](url-decisions.csv). The 20 canonical product slugs remain unchanged; nine exact UUID query aliases map to those slugs; the category query maps to the existing Kitchenware path. No mass slug migration is justified without GSC/link history. Numeric IDs are not inherently a penalty.

For each changed live URL: return the requested **301**, point canonical to the destination, update cards/breadcrumbs/related links/sitemap/feed and avoid redirect chains. Next.js `permanentRedirect()` returns 308, which is a permanent redirect but differs from the brief's requested 301. Use an explicit 301 response or deployment redirect rule if that exact status is required. Keep the redirect map, monitor logs/GSC after release and preserve redirects long term. Unknown IDs return 404. Never redirect all missing products to the homepage.

## On-page templates covering all six page types

Titles generally fit roughly 50–60 characters, descriptions roughly 140–160, but prioritise clarity and avoid chopping names mechanically. No compulsory word count or keyword density. Use the principal topic naturally in title, H1 and opening answer; place related terminology where the selection task needs it. Alt text describes the actual image, not a list of locations or keywords.

| Type | Title/meta and H1 | H2 / H3 / introduction | Links, image alt, FAQ, schema and CTA |
|---|---|---|---|
| Homepage | Store range + Pakistan; unique value meta; one marketplace H1 | H2 category/value/help/guides; H3 useful category cards; 50–90 word range intro | Link 6–8 real categories and support; descriptive hero alt; factual store FAQs; Organization/WebSite; Browse products |
| Category | Category + Pakistan; assortment/selection meta; matching H1 | H2 selection help/related groups/FAQs; H3 decision factors such as capacity; concise intro before grid | Crawlable product links, logical parent/siblings and guide; category/product-image alt; 2–4 task FAQs; CollectionPage/ItemList/Breadcrumb; Compare models |
| Subcategory | Narrow product type; distinct choice meta; specific H1 | H2 product range and choice criteria; H3 meaningful variants; short distinct intro | Parent and stocked models, not empty keyword links; actual item alt; focused fit FAQs; CollectionPage/Breadcrumb; See current options |
| Product | Distinct model/name, optional price intent; offer-specific meta; exact H1 | H2 overview/specifications/use/contents/policies; H3 charging/compatibility where relevant; 40–80 word benefit intro | Parent, compatible complements, alternatives and guide; gallery-view alts; real model questions; Product/Offer/Breadcrumb; Add to cart/Buy now |
| Blog/how-to | Specific task/outcome without unsupported claims; answer-focused meta/H1 | H2 steps/evidence/limitations; H3 substeps and examples; answer first | Category and relevant model links; primary issuer/manufacturer sources where needed; original step-photo alts; task FAQs; Article/Breadcrumb; Read specs or compare options |
| Buying guide | Comparison/task + Pakistan where relevant; comparison meta; matching H1 | H2 method/table/criteria/recommendations/limits; H3 model differences; quick decision summary | Models plus category and related how-to; manufacturer/primary references; labelled comparison images; purchase questions; Article/Breadcrumb, ItemList only if accurate; Compare current offers |

External links are optional on commercial pages; link an official manual or issuer guidance when it resolves an important question. Buying guides must explain what was actually tested, how models were selected and any commercial relationship. Do not mark a buying guide as a user review without a real review process.
