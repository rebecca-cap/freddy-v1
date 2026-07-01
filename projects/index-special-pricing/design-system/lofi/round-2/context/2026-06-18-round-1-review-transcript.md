# Product–Design Daily Sync — Round 1 Review (transcript)

**Date:** June 18, 2026
**Attendees:** Frank Overland (Design), Reece Johnson (Product)
**Subject:** Review of the Index Special Offers lo-fi round 1; direction for round 2.

> Saved as a `context/` input for round 2. `/wireframe-index` mines this for rationale.
> See `insights.md` for the distilled round-2 brief.

---

## Index Special Offers — review (verbatim, condensed)

**Frank:** Here's round 1 of wireframes and the decisions guide. The meat: this is the screen if you pick index special offers. It simplifies to the basics so there aren't multi-steps. I thought the price formula could be just the index, the product, and the differential — you wouldn't have to build a complex formula. My first question: did you want it that simple, or do you still want the existing template system?

**Reece:** We want all the sections on one page, no scroll — yes. But I think it's misunderstanding what a core template is, and it's confusing because of backend language. A template basically sets underlying fields for the offer/auction: first, is it customer-indicated pricing or me-indicating — auction or offer? Second, is it fixed price or index price?

**Frank:** From my understanding this is all index price, and maybe the word "template" is confusing because we use it elsewhere. The idea is you could save this configuration with a "save as template" button and it'd populate next time — similar to create-from-prior.

**Reece:** Let's set that aside and assume we're on index specials. I'm indicating all the pricing including the differential, product/location, volume — that's good. **The price formula is the bulk of what we need to keep thinking through.**

**Reece (the price-formula model):** "An index product" was maybe trying to map to something that exists, but a price formula is made up of **variables** — often I have **three variables**. Each variable has a **publisher** (which price table we're looking at), an **instrument** (a row in the table), a **type** (highest / lowest / average / settle price), and a **date rule** (on a timeline of prices, which one — yesterday, two days ago, same day), and maybe a **name**. The idea that there's one index and you choose an index product — that's just not correct.

**Frank:** Yeah, I found that very suspicious — my instinct said the formula we built before wasn't being represented. It was thinking you just identify the index and add a differential. I even asked it and it got confused.

**Reece:** Maybe the answer — and I'd like a couple versions to get customer feedback — is that a quick build for an index, you **only choose from formula templates you've saved** (not re-authoring). I select from a **pick list**, and visually it **shows the three variable lines with all seven columns populated**, so I get a quick indicator: yes, this is or isn't right. Then I **add the formula differential**, which is really important.

**Frank:** So you wouldn't go on this particular quick page... let's take a step back. Would we always want quick select on index specials, or have the option of quick vs. regular like before?

**Reece:** Probably I'm saying "New," and then: **do you want new fast or new full?**

**Frank:** Right — the first wireframe presented choosing between the two. So the quick page assumes fast intent, you build off an existing template, populate it with just a differential, and there's an option to toggle back to the full version if it's not where you thought.

**Reece:** Yep. Let's set aside "start with a template." Assume the **first selection** is: I need to sell something — **pick product and location, then how much**. Then depending on the product, that drives the **type of price formula** I'd use. Here's where we say: these are your **formula templates** — we can reuse the existing **card or list view** UX. I grab one and bring it in. The question is: what if it's **90% right but not exactly** the formula I wanted?

**Frank:** Maybe an **Edit button** in a **drawer** pops up for granular changes.

**Reece:** Yes, really fast, and I can see it right there.

**Reece (timing):** Timing is probably right. If I want to do something fast, I want it in the market now — how long is it visible, and how long is the lifting. Those are good.

**Frank:** And you can get granular with custom if needed.

**Reece:** The **date/time picker you made for Rebecca and Abdul** — the one with "now, 1, 2, 6" — would go really well here for custom. It's in the MCP site on the **day-deal bulk-entry page** (and maybe a components page).

**Reece (invite):** The chip selection works for a small number of groups. But what if I have **25 groups** — how is that still quick? Maybe **free-text search plus chips**: type "CHI" and see my Chicago lifting customers. Also, this assumes everybody is grouped. Other ways sellers invite: **who's authorized to lift** this product/location (a property we know), and by **credit** — who has the financial capacity to lift.

**Frank:** Would there be value in **pinning** groups to the top of a long list? We did that at HTB — users said "I only use these five," so we let them pin and float to the top.

**Reece:** That could work. Focus on the **80/20**. The all-cases baseline is: I see customers and search/select them. To make it faster, the abstraction that gets me to customers is **groups** (pin to make faster), **authorized-to-lift**, or **credit**. I think the user picks a **mode** of how to invite — groups / authorization / credit — and depending which, I get the chips, or the list of authorized customers, or a **rank list by credit**. Progressive. The 20% is: here are all your customers, find and pick them.

**Reece / Frank (template naming & save):** Saving the result overlaps with create-from-prior, but they're different: create-from-prior is "the one I did before"; the saved thing is "my **good stuff** — the way I do business," used repeatedly, named, in an area you click quickly. They feed into each other. I could even launch the full wizard from one — they fill the same fields, just present the UI differently. **Use a different word than "template"** since we already use "template" elsewhere — find a synonym (starting point, framework, etc.).

**Reece:** Good, solid feedback. Stick with your gut — you know the customers and the market.

---

## Next item (separate, not this round)
Reece also flagged a future task: a lightweight **email content management screen** for price notifications (custom subject + body, toggle pricing columns on/off, variables) for rack vs delivered business. He'll send it over separately — **not part of the Index Special Offers round.**
