# Product–Design Daily Sync — Transcript

**Date:** June 15, 2026
**Attendees:** Frank Overland (Design), Reece Johnson (Product), Agustin Reichhardt (Design)
**Relevant project:** Index Special Offers — Quick Create for Index Special (OSP / selling platform)

> Saved as a `context/` input for round 1. `/wireframe-index` mines this for rationale.
> The full conversation also covered the Project Hub tool, an Obsidian vault idea, and the
> short-lived "Fable" model — those are tooling tangents and are **not** part of the Index
> Special Offers brief. The Index Special Offers discussion is captured verbatim below; see
> `insights.md` for the distilled brief.

---

## Index Special Offers — verbatim excerpt (Reece ↔ Frank ↔ Agustin)

**Reece:** You've designed something on this before. I think I overprescribed for you what my
vision there was. The user problem is: in the selling platform today, the "create new setup" is
thorough and exhaustive but long. It's a lot of work. It's a lot of clicks. So you had taken a
pass at what it would look like to do a quick setup — which may look something like this. I'm
making some of the same selections, I'm just doing it faster. This is okay, but it starts to fall
apart when we do an index, because there are so many other choices that I need to make that aren't
represented here. We did a fast pass at this and we just never came back to it.

**Reece:** If we said the needs are to facilitate this flow but with a quarter of the clicks and
always doable in less than 30 seconds — how would we approach that from a lo-fi forward, instead of
taking hi-fi concepts and just making it like a cousin in a drawer?

**Reece:** This is the problem today. If I'm a sales rep sitting at lunch and the market does
something and I want to fire off an offer fast, what we have today is too cumbersome to pick the
things in the conditional fields — especially when I build an index price. I may have a template,
but I may add it row by row. Compare this drawer where I select a template. I see this grid. I'm
seeing timing. I'm adding a formula differential to what we have in the quick create right now —
which, when I choose an index, there's this field that's "price index." This doesn't relate to
anything that's real. And there's a "terms template," but that also doesn't really relate to
anything that's real today. If we just took a fresh pass at a quick-create workflow for index, and
we didn't try to cram it into this drawer, what would that look like?

**Reece:** I'm trying to think of something we could give you fairly focused that we don't need a
big kickoff on, so you could test something new front to back.

**Reece:** Best case scenario today, that's 25 clicks and about a minute. I'd like to see that
consolidated closer to probably the 10 to 12 essential clicks — so we cut that in half — and that
it's routinely doable in 30 seconds or less. Focus on special index and really making sure we get
the price formula right and how we're doing the index-based pricing, which invoices at lift time.

**Reece:** Using a template is great. If I'm not using a template, maybe the answer becomes you
really need to do the prescriptive flow that's detailed. But if we could find a way to make that
really nice from a design standpoint, [it would] make a lot of customers really happy.

**Reece (on Abdul's "create from prior"):** Abdul built a create-from-prior that prepopulates the
wizard with most of the selections I've made before. It pulls in the product first, the template,
then selects the product/location, you put in the volume, it has already prepopulated the formula,
it kept my dates and times so I just have to pick the dates, and it's pre-selected the customers
who got it last time, so I can make a change. That gets someone through it faster. But I think the
same quick create intersecting with a create-from-prior — and then I'm seeing all the things here
in one view rather than stepping across the steps of the wizard with scroll — one place, fast
create, half the clicks, half the time. Real power-user flow. So anything you think about for
hotkeys, templates, etc.

**Reece:** It would be great if the idea of the sequence of fields/interactions also worked for
mobile, and this becomes the way we'd do it in mobile as well. But if there's segmentation that
makes more sense to do desktop vs mobile, then I'm open there.

**Frank:** Would there be any AI empowerment on this?
**Reece:** No, not in this design.

**Reece:** So it's: how do I price? There's an important decision around timing and seeing the
time, but I'm more interested in selecting durations of visibility and pickup rather than explicit
days and dates. The other key is: who am I inviting — using the groups functionality that exists
today. You have a little bit of that concept here — group tags. "Give me the three customers that
are Gulf Coast." There's some good stuff in here, but where it starts to fall down is especially
around the pricing piece.

**Frank:** I need to do the groundwork of creating the OSP — getting the latest OSP, making the
code base from it so it can understand what's there, because it's changed a lot since my MCP server
work. The basics are there, but it looks a little tighter.

**Reece (framing the run):** I'd like to start with something we don't already have designs on, to
take it from the true lo-fi where we don't have preconceived notions of what something should look
like. We've iterated on this a lot, but if we took the requirements we have now and made a fresh
run with all we've learned about designing with Claude, would we end up in the same place? If we
do, great. If we don't, then we've got some different ideas.

**Reece:** My one question is: have we defined all of the actual business requirements well enough
to expect a good output?
**Agustin:** I don't think so. The design we have right now still has a lot of wild-thinking, free
ideas.
**Reece:** Yeah — it's almost more of a feedback canvas than a ready-requirements type design.

**Reece (recap-feature idea, Agustin):** [Agustin asked for an auto-generated per-round recap so a
collaborator can read what changed instead of meeting about it.] A lot of times after I finish
something, I'll ask for the summary. I think there's going to be a lot of collaborating in these
tools for early concepts — especially in lo-fi when things are softer. That's particularly
impactful.
