# Special Offers — Quick-Create Flow: Hi-Fi & Dev Handoff

**Project:** Index Special Pricing → Special Offers
**Stage:** Lo-fi approved → building hi-fi → dev
**Review date:** Jun 23, 2026 (Product–Design daily sync, Frank Overland / Reece Johnson)
**Author:** Frank Overland
**Scope of this doc:** The **quick-create / preset Special Offer flow** only.

---

## 0. How to use this doc (read me first)

This is a **UX prescription**, not a visual spec. It states *what the flow must do* and *how it should behave*. It deliberately does **not** invent new visual design.

**Source of truth for anything visual** (components, type, color, spacing, drawer chrome, buttons, icons):
1. The **existing Gravity (Gravitate) design system**, and
2. The **existing Special Offers designs** already shipped in the app.

When a value isn't stated here, do **not** guess a pixel or hex — reuse the existing pattern. If no existing pattern covers it, flag it rather than inventing one.

> Out of scope (do not build from this doc): the marketplace / online selling platform index-pricing publication flow, dashboard/analytics rework, and the email-template variable-chip decisions (those belong to the price-notifications handoff). See §6.

---

## 1. Context & decision

The lo-fi for the quick-create Special Offer flow was reviewed and **approved to move to hi-fi**. The lo-fi was prototyped with Ant Design (antd) components and pulled inconsistent type/visual choices; a UX audit found the issues were mostly *wrong components*, not wrong workflow. **The workflow is right.** The remaining work is (a) a short visual-polish pass to realign to the Gravity design system, then (b) build the hi-fi, then (c) dev.

This is the same handoff format used for the Scout work.

---

## 2. The flow — what it must do

### 2.1 Two-step structure
The quick-create offer is a **two-step** flow:

- **Step 1 — Offer details**
- **Step 2 — Timeframe**

> *Naming flag:* "Offer details" and "Timeframe" are working labels and were not objected to in review. Confirm final copy before dev; don't treat them as locked.

### 2.2 Presets with progressive disclosure
- The flow leads with **presets**. Selecting a preset **populates** the form (progressive disclosure — the user starts from a chosen preset rather than a blank form).
- If the user **changes a populated value**, give them two paths:
  - **Update the existing preset**, or
  - **Save as new preset** → reveal an inline name field for the new preset.

### 2.3 "Full setup" escape hatch
- Provide a toggle to switch from the quick/preset mode into the **normal, complete version** of offer setup.
- **Label it "Full setup."** Do **not** call it "wizard" or "advanced setup." (Average business users don't think in "wizard" terms.)
- There is **context/an entry point before this screen**, so the user arrives here already oriented.

### 2.4 Product / terminal / volume
- **Remove the standalone word/label "Product."** It only consumes space and adds no meaning. (Removing the *word* — the product picker itself stays.)
- The **product → terminal → volume** selection is **unchanged**: reuse the existing picker as-is.

### 2.5 Formula / template
- Reuse the **existing** formula/template selector. The formula populates from the template selection.
- The **"filter" control that appeared in the lo-fi does not belong here.** Use the existing filter pattern; **no redesign** of it.
- **Remove the "basis" field.** It was a hallucination introduced because the prototype was pointed at the "protobase" example.
  - *Why it's wrong:* the concept of basis isn't wrong, but **basis is what the price formula below already expresses** — a basis is generally derived from multiple variables in that formula. A separate "basis" field is redundant and misleading. Do not reintroduce it.

### 2.6 Customers
- Customer selection uses **tabs**; selecting customers moves them into a **"selected customers" bin**.
- **Keep the dedicated "pick any customer, anywhere" picker** in addition to the tabs.
  - *Why:* it has real value when the user **doesn't have active customer groups set up**. (This was debated; decision is to keep it and validate in testing.)

### 2.7 Timeframe step (Step 2)
- The **checkbox** in this step renders incorrectly in the lo-fi but is **functionally the same as the existing control** — treat it as the existing checkbox behavior (this is part of the polish fix, §3).
- The **new dropdown** behaves as discussed in review and is **approved** — build it.
- Everything else in this step is **reused** existing functionality (full visibility of the timing options); the only real deltas are the **new dropdown menu** and the **different picker**.

### 2.8 Sidebar
- The **sidebar disappeared in the lo-fi by mistake.** It must be **present/persistent** in the hi-fi. Restore it to match the existing layout.

### 2.9 After send — save as preset (nice-to-have)
- After the offer is sent, optionally offer to **save the configuration as a preset**.
- **Priority: nice-to-have, not required for v1.** Build if cheap; safe to defer.

---

## 3. Visual polish pass (before/within hi-fi)

These are **design-system alignment** fixes, not new design. Workflow does not change.

- **Replace Ant Design (antd) components with Gravity design-system components.** The UX audit found the lo-fi was mostly using the wrong components.
- **Use the existing drawer template.** The lo-fi did not use it; it should.
- **Narrow the drawer.** It's too wide — bring content in closer; don't push the panel out so far.
- **Buttons → real Gravity buttons/styles.** Use system button styles and states. Example: the text/link-style action should be an **underline button**; avoid button colors that aren't in the system.
- **Spacing** follows the design-system spacing scale/patterns.
- **Frame the offer body in a tile with a subtle drop shadow**, so it reads as "the object you've created." This is a light affordance — keep it subtle (e.g., it should look like it sits in an editor/viewer, not float ambiguously in the UI).
- **Typography:** the lo-fi type choices were random and inconsistent even with themselves. Make type consistent and on the system scale.
- **Scope discipline:** polish only — **no new design exploration** in this pass. Dev takes it from there.

---

## 4. Reuse checklist (don't rebuild these)

| Area | Reuse from |
|---|---|
| Drawer chrome / container | Existing drawer **template** |
| Product → terminal → volume picker | Existing Special Offers picker |
| Formula / template selector + filter | Existing Special Offers controls |
| Customer picker ("pick any customer") | Existing picker |
| Timing controls (checkbox, options visibility) | Existing controls |
| Buttons, type scale, color, spacing, icons | Gravity design system |

New-build items are only: the **two-step preset framing**, the **preset populate / update / save-as-new** behavior, the **"Full setup" toggle**, the **new Timeframe dropdown/picker**, and the optional **save-as-preset after send**.

---

## 5. States & edge cases to specify in hi-fi

Because visuals defer to the system, the hi-fi's job is to make **behavior and states** unambiguous for dev:

- **Preset selected → form populated**, vs. **no preset → blank/default** start state.
- **Dirty preset:** what the "Update preset" vs. "Save as new preset" affordances look like once a populated value is edited; the inline new-name input and its validation (empty name, duplicate name).
- **Customer selection:** empty "selected" bin, one+ selected, and the "no active groups" case that justifies the standalone picker.
- **Full setup toggle:** what carries over when switching from quick → full setup (don't lose entered data).
- **Send:** success state and the optional save-as-preset prompt.
- **Validation/required fields** per step before advancing Step 1 → Step 2 and before send.
- **Keyboard/focus order** through the two steps and the preset controls; ensure the restored sidebar is in a sensible focus order.

---

## 6. Explicitly out of scope (do not pull from the transcript)

- **Marketplace / online selling platform** index-pricing publication flow (listing index prices on the buy-now screen, daily publication, differentials set on the page, per-day vs. perpetual publishing, analytics toggle on the grid). This is the *next* larger effort (~3–4 days out) and needs Matt for dev complexity. Separate handoff later.
- **Dashboard / analytics rework** in the selling platform.
- **Email-template variable chips** (green "effective date" chip color, chips vs. bracket-plus typed variables, copy/paste of chips). These belong to the **price-notifications** deliverable, not this one.

---

## 7. Open items to confirm before dev

1. Final copy for step labels ("Offer details" / "Timeframe") and the **"Full setup"** toggle.
2. Whether **save-as-preset after send** makes the v1 cut.
3. Exact data-carryover rules when toggling **quick → Full setup**.

---

## Appendix A — Final review transcript (verbatim)

> Product–Design Daily Sync — Jun 23, 2026. Computer-generated transcript; may contain errors. Included for full context; the binding decisions are summarized above (§1–§3). Marketplace/dashboard/variable-chip portions are included only for completeness and are **out of scope** for this handoff (see §6).

```
00:01:56
Reece Johnson: Hi
Frank Overland: There is.
Reece Johnson: Frank.
Frank Overland: How's it going?
Reece Johnson: Good meeting light this morning. Getting some stuff done. Eating a little lunch. How about
Frank Overland: Right. Good.
Reece Johnson: you
Frank Overland: Just had a camp drop off again. Oh, it's crazy. Trying to pull up the latest stuff. Okay, that's not it. Cool. Okay. All right. So, there's a couple polish things I need to go in and clean up, but um for the most part, this I think has a lot of what we were thinking, but let me know if I'm not right here. This is kind of what I was hearing from everything. So, for starters, we have this two-step process. And I I I called it offer details and the time frame. That was those were my choices, but you tell me if you want to change that. The presets are here and so it works more of a percussive disclosure. I choose it here, it populates it.
00:03:42
Frank Overland: But if I make a change, you can update update that preset or you save as new preset and then a new name comes in right here like that. So that's pretty clean. Or I could switch to full setup if I want to. Do you think that's the right best way to describe it? full setup or advanced setup or what would be a best way to describe what that means? Go to the normal
Reece Johnson: Yeah. I don't like using the word wizard.
Frank Overland: version.
Reece Johnson: I don't think like average business users think about wizards like people who build software do. So, I'm okay with full
Frank Overland: Okay.
Reece Johnson: setup.
Frank Overland: um they they'll have the option before. So there'll be there'll be some context before they get to this point. So um okay. So I this product word probably either needs to change or disappear. I think it could just change just takes up space. I don't think we need it. So we choose the products terminal volume.
00:04:49
Frank Overland: This is the same. This is the same. You can choose the formula, you know. So, we can choose the template. The filter is not supposed to be in here. That's how it thought it was supposed to be. But this doesn't matter. We'll just use the existing one. There's no redesign here. Um, the formula pops in. Um, this basis thing was filled in. Oh, I it kind of made sense, but I didn't know if that needed to be here or if that's just all from here. Was that an extra thing that it hallucinated?
Reece Johnson: Yeah, I think so.
Frank Overland: Okay, I I'll remove
Reece Johnson: The the idea of basis isn't wrong,
Frank Overland: that.
Reece Johnson: but that is what the price formula is below. And there are generally multiple variables to get to a basis.
Frank Overland: Yeah, I I didn't think that was right, but what happened was I pointed it to the protobase as an example for the window and I think maybe got a little confused there.
00:05:55
Frank Overland: So, I I'll remove that. I I thought I just wanted to confirm with you that was a mistake. Um, okay. So customers here we have these tabs and then when I select them they they get into the selected customer bin here. This was suggested a full customer picker but I don't think that's necessary. Um I feel like this would be all the customers you choose from. But am I wrong on that?
Reece Johnson: I think there's still value there if I don't have active groups set up.
Frank Overland: Then there's a dedicated pick any customer anywhere here.
Reece Johnson: Yeah, let's try it.
Frank Overland: Okay. So that that's keep that. Okay. All right. Um cool.
Reece Johnson: Yes.
Frank Overland: And then we go to the timing wizard. So this is it's essentially the same. Uh it's supposed to be a checkbox that it didn't quite do it but functionally part of the polish I needed to work on but it represents the same thing that we have.
00:07:09
Frank Overland: Um but then we have this new drop down which works like what we were talking about.
Reece Johnson: Yep, that's good.
Frank Overland: And then you would have the the visibility of all this. So this this is all basically reused stuff with that different dropown menu, different picker. That's about it. And then you'd have Oh, and I'm just realizing the sidebar disappeared. So I'll bring that side You probably have that sidebar back, right? I just now realized that. Okay, I'll have it bring it bring that back.
Reece Johnson: Yes.
Frank Overland: I didn't even think about that until right now. But then that that should be the end of it, right? Oh,
Reece Johnson: I think so.
Frank Overland: then it's saying um giving you the opportunity after you send it to save it as a preset. Is that necessary?
Reece Johnson: Nice to have not I think an absolute requirement.
Frank Overland: Okay. All right. Well, um, if you like it, I'll just go ahead and build it in the hi-fi.
00:08:30
Reece Johnson: Yeah, I think we're ready for that.
Frank Overland: I think I think we got all the things solved. So um and then here functionally it seems pretty clean. It's really about I think the main thing is that it was using ant d. Um I had it run like I had like a lot of visual design stuff like the font and all this stuff. Um, and then I did a UX audit and it mostly said it was using the wrong components. So, most of it suggestions was uh switching those up.
Reece Johnson: Okay.
Frank Overland: So, I I think workflow wise it's there, but it's like we have a template for this sort of drawer, right? It didn't use that template. Probably um visually I would recommend this is too wide, right? We could bring this a lot closer over. Don't have to push this out so far. Um, make these tables um or buttons using the actual gravity buttons and and design styles and using the design pattern spacing that kind of stuff.
00:09:50
Frank Overland: That'd be just real polish. Do you think there's you time value for me just taking a a couple hours fixing that up?
Reece Johnson: Yeah, I think so. Just polish and then we're done. Dev takes from
Frank Overland: Yeah.
Reece Johnson: there.
Frank Overland: And I can make a handoff document for it too like I did for scout.
Reece Johnson: Yeah, I like
Frank Overland: Be kind of Yeah.
Reece Johnson: that.
Frank Overland: But functionally I thought it felt pretty good. I just it was just the visual design. It's almost as if Claude didn't have the right references. So maybe there's something in my system that automatically pulls from that and yours just kind of does it straight from anti. I don't know why I did that.
Reece Johnson: I got a
Frank Overland: Like it just like like this is this button.
Reece Johnson: question.
Frank Overland: It should be like uh an underline button there, right? We don't really use this type of button colors. But other than that, yeah, I thought it looked pretty good.
00:10:56
Reece Johnson: Let me see where I've got mine at. I want to just side by side them real quick.
Frank Overland: Maybe I could put this body like in a little thing. So, because it looks like it you can't really tell that it's looks like it's part of the UI here, you know?
Reece Johnson: Yeah.
Frank Overland: I'll make it look like it's in an editor of some sort or this or a viewer.
Reece Johnson: Can you go to edit state?
Frank Overland: like if it's in a tile with maybe a subtle drop shadow so it looks like this is the object that you've created. you know, just kind of frames it a little bit of an affordance
Reece Johnson: Yeah, I'm good with that. Um,
Frank Overland: subtly.
Reece Johnson: let's just do polish today and then I'm I like all that subtle changes but good changes.
Frank Overland: Mhm. But yeah, the just like the the type choices were just kind of random, you know, not consistent even between itself, more or less. Um, Bryson engine. So, I I'll clean it all up and then um I should be ready.
00:12:51
Frank Overland: And I'll I'll get the hi-fi version of the other one, too.
Reece Johnson: Cool. Yeah,
Frank Overland: So this could be two things.
Reece Johnson: that sounds
Frank Overland: And then you think does AG need any
Reece Johnson: good.
Frank Overland: help too? I I think my Slack must have been on top and it came in and so I never got the notification of it. It just thought I saw it when I didn't see it. I didn't even know that was there.
Reece Johnson: I think he's good on those changes. I'm looking at what's next for us. Inventory is good. Measurements good. Deliverance's good.
Frank Overland: Do you like the bright color here of the green?
Reece Johnson: Go lay down.
Frank Overland: I I guess there's like making it look like a variable. There's a two things like brought to my mind.
Reece Johnson: Okay.
Frank Overland: One, green might be fine, but we don't really do that anywhere else. When we do variables elsewhere, it's purple. Now we're doing AI purple, so I don't know if that's a thing anymore.
00:14:14
Frank Overland: But it could be more neutral maybe. Do you think gray would work there? Or do you like the pop with a color like that to represent
Reece Johnson: I don't have a preference as long as it's visually clear to a user that that is
Frank Overland: variables?
Reece Johnson: uh a a variable that will be resolved with real data at runtime when the email generates and that that I can move it around. It's like an unbreakable thing. I can't separate effective date. I can't delete the space in the middle. Like it's a variable chip that's easy to place in dynamic in content.
Frank Overland: Do you think that bracket like plus thing we did would be good to bring over here too? And then maybe people could even type it in manually. They don't even have to use the chip editor. It's just an option.
Reece Johnson: Say more about that.
Frank Overland: So when we have the template variables, we we use the square bracket with the
Reece Johnson: Mhm.
Frank Overland: plus.
00:15:18
Frank Overland: Right? So here, like I could if I'm in the editor,
Reece Johnson: Yeah.
Frank Overland: you know, and if I'm it I I insert something, it doesn't insert a chip, which I can't edit. It inserts bracket plus name. And then if I change my mind, I could go ahead. I can just tweak it. I don't have this little object I'm moving around. Right? You can't do much with it once the chip is inserted.
Reece Johnson: Yeah, you can either move it or delete it.
Frank Overland: Can I even copy it? I can't. Okay.
Reece Johnson: I didn't like the idea of people needing to type the variables just like having the bank
Frank Overland: I can't
Reece Johnson: that I can put in and move. So, wherever my cursor is in the editor if I insert a variable, that's where it drops, but that it's easy for me to rearrange.
Frank Overland: I couldn't I couldn't copy and paste it. I could cut it. I couldn't paste it.
Reece Johnson: do uh hit insert variable.
00:16:34
Frank Overland: So I guess what I'm suggesting here it would look like this. If once I hit insert it would go what was it called? Effectto date it would place this in. So this is these are like uh uh this could still look the same but when I put it in it doesn't show up like that. It just shows up like this which I think you would kind of see. in like I like I was doing Mailchimp or something like that, they would have some sort of format. Sometimes it's with a
Reece Johnson: Yeah, I don't have a really strong opinion.
Frank Overland: star
Reece Johnson: The purpose of making it a chip was I don't want people accidentally hitting like enter or creating white space where variables don't resolve correctly. And if it's a chip then it's an unbreakable thing and I know the set of variables that I can put in or move them around but it's not text like we just avoid that potential problem.
Frank Overland: I guess it's Yeah. So, there's Yeah, it's just a trade-off.
00:17:54
Frank Overland: you have something that's unbreakable with the chip component, but then you can't I'd have it'd be a little bit extra steps if I'm moving things around. I'd have to pretty much reinsert it if I deleted it, right? Which is
Reece Johnson: okay.
Reece Johnson: Yeah, the rate of change on these is also pretty low.
Frank Overland: okay.
Reece Johnson: Like this isn't something I need to edit every day. I'm probably doing it on maybe an annual basis, maybe even less. or if I have a new type of business.
Frank Overland: Okay. Well, maybe I'll just leave it as and then we'll see if customers complain about it or if we test it.
Reece Johnson: Yeah,
Frank Overland: We'll just think about it
Reece Johnson: I think that sounds good. And I can include in the product requirements the ability to like copy or paste a
Frank Overland: later.
Reece Johnson: chip and see if dev can enable that as well. just to round it out.
Frank Overland: Mhm.
Reece Johnson: I think the next thing that we'll probably jump into once we polish these couple up is um going back to the selling platform.
00:19:07
Reece Johnson: We had some early designs about how do I list index prices on the buy now screen like marketplace and then publish those on a daily basis. There's some designs in the MCP site. So the drawer, all of that stuff's fully reusable. The grid already exists. It's really about the publication flow. Here are the the offers that I have open. Go to online selling platform and then do index. Yeah. Yeah. Index offer management one page back. And we just put put a little bit more thought on this now that we've shipped the original and come back to what we were thinking initially. There's some dev complexity here that we probably need to collaborate with Matt on. But um we get this ready for ready for dev versus the early stage thinking we had before. the drawer we have, right? Um, all that exists in the wizard flow for the offer setup today. The only thing that's different is for a product location. I'm going to assign the formula via the drawer and the differential isn't set in the drawer.
00:20:49
Reece Johnson: It's set on the page and it's valid for a period of time. And I think the big technical questions are are we publishing those differentials for a day at a time or are we publishing that and it's good in perpetuity until I change it and then there's some questions around what analytics. So go to the offer pricing tab in this page back one. Yep. And now change the version with the I in the lower right. Oh, how do we do this? Yeah. And then hit the analytics and then you'll have a
Frank Overland: analytics.
Reece Johnson: toggle. Yeah. Yeah.
Frank Overland: Is the button
Reece Johnson: So top top right of the grid now there's an analytics toggle button next to the
Frank Overland: here?
Reece Johnson: uh publish screen button.
Frank Overland: Isn't there an apply button or something I can't get
Reece Johnson: Now go back to the grid.
Frank Overland: to?
Reece Johnson: Now next to the publish button to the left of that there's a toggle. Hit the toggle.
00:22:04
Reece Johnson: Click a row. So refining this view um plus publication. And I need to think about it a little bit to make sure we're ready to do the requirements. But I think this is going to be our next larger effort
Frank Overland: Okay.
Reece Johnson: and then uh there's some things that I want to do around dashboarding and reworking the dashboards and analytics that we have in the selling platform for general sales reporting. We already have a bunch of really good data. We just have never thought about what's the good way to display it.
Frank Overland: Should we try to move these over to like use them as reference points, but maybe think from scratch and put it on the project hub so they look more accurate? And
Reece Johnson: probably for this flow. Yes. Before we put more into the project hub, I want to get Matt to have it deployable because it was great to build Scout there, but it was tough that Abdul and I couldn't get back to to the designs like we can
00:23:17
Frank Overland: Could
Reece Johnson: here. But I think we're probably we're probably 3 4 days from jumping into this work in earnest.
Frank Overland: we do it in I or you think it's not just work working straight off the hi
Reece Johnson: I think the concepts that we have here are really solid that um I have rows rows need to be put into the market with a differential and then I have analytics that I want to see at the same time that's tied to product location concept exists on the quote book and um really I think it's mostly grid base consumption, maybe multiple panels. So, I don't see huge value in going to Loi, but if that helped you think through it or interrogate the design, I'm not opposed to it. This is one that um getting it right, the data and the the workflow will matter a lot. So less like UI and layout and more like a UX that really supports how people want to use this feature. But no one has ever done anything like this before.
00:25:04
Reece Johnson: So there's not a a really great this is how I think about index based pricing for online purposes today.
Frank Overland: Okay, I'll try and go back and um uh reboot my brain what we were doing on sets when we created this. So I have all this available. So I'll just go back and resummize what we were doing
Reece Johnson: I think what I'll do is take a big cut at like a larger what would make
Frank Overland: here.
Reece Johnson: this really useful for customers and that may break down into a couple different epics but then you and I are aligned on what are the categories stories of things that just need to be better surfaced in the application today. I think the association of cost to the thing that I'm selling so that I can see margin here that I have some reference to other suppliers. So, how do we map those in? Can we use what was built for the pricing?
Frank Overland: Did do we have for this?
Reece Johnson: What's that?
Frank Overland: Was there a PR for this
Reece Johnson: Let me look.
Frank Overland: one?
Reece Johnson: I'm pretty sure it's been four months or so since I thought about this um marketplace. Yes. I don't think there's any design spec notes in it
Frank Overland: The intent is good.
Reece Johnson: though.
Frank Overland: Business case is good too. Fresh up on
Reece Johnson: Yeah, this looks pretty good. Um, let me review, polish it up, and then we can probably pick this up on Thursday. But for now, um,
Frank Overland: focus on polish and um high fidelity of the All
Reece Johnson: price notifications, polish, and the quick create, uh, hi-fi.
Frank Overland: right, I'll be good for the next day.
Reece Johnson: Cool. Thanks, Frank.
Frank Overland: You see it?
Transcription ended after 00:27:58
```
