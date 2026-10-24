---
title: Shopify store owners hate bot blockers, so I built a better one

date: 2026-10-25

summary: I was reading Shopify app store reviews and community threads, and store owners kept saying the same thing. Bots are wrecking their stores, and the apps that fight bots block real customers. So i built Botsense.
---

![Secure your Shopify store](/writings/botsense-hero.png)

> **The short version**
> Bots flood Shopify stores with fake carts and fake sign ups. The apps built to stop them often block real customers too. So i built [**Botsense**](https://botsense.vercel.app/), which labels every visit as human, suspect or bot, and only blocks when the proof is strong.

I was going through the Shopify app store, the reviews, and the Shopify community threads. Not the five star ones, the one and two star ones. If you want to know what's actually broken, that's where people tell you.

### The problem: bots everywhere

Three attacks kept coming back in those threads.

```text
Fake carts      →  bots fill carts and mess up your numbers
Fake sign ups   →  bots stuff your email list
Card testing    →  fraudsters try stolen card numbers on tiny orders
                   to see which ones still work
```

Here is how one owner put it:

> "I am getting FLOODED with 100s and 1000s of fake customer sign ups every week."

It costs real money. One owner said the fake sign ups pushed them into a higher email plan, so they paid more for emails that went to nobody. Another deleted around 50,000 fake accounts by hand, just to protect their sender reputation.

Card testing is the scary one. The fraudster doesn't want your product. They want to know if a stolen card works, and your store is the test machine. You end up with a pile of failed payments and fees.

Three different attacks, but the visitor is always the same: a program, not a person.

### The problem with the fix

So owners installed bot blockers. And then the reviews turned angry:

> "It was blocking all my traffic and marking it as fraud."

> "It ended up denying access to even my current clients."

> "Cancelling genuine orders. It's probably costing me more in lost orders."

The app meant to protect the store was turning away the people who pay for it.

Why? Most of these apps look at your IP address, your country, or whether you're on a VPN. But real shoppers use VPNs too, and so do people with privacy browsers. They get caught, and the store loses a sale. Meanwhile, bots that skip the store pages and go straight to the cart got right past some blockers.

```text
Most blockers                    What owners wanted
─────────────────────────────    ─────────────────────────────
Judge by IP, country, VPN        Judge by how the visitor acts
Block first, ask later           Show me first, i decide
Real shoppers get caught         Real shoppers are safe
Direct-cart bots slip through    Those bots get caught too
```

### My one rule

Before writing any code, i wrote one rule down:

**Never block a real customer.**

Everything else comes after that. It's why Botsense has two steps:

```text
Free   →  label every visit: human, suspect, or bot
          (never blocks or slows anyone)

Pro    →  hold bot orders, block proven bots
          (starts in "test mode" so you can see what it
           WOULD have done first)
```

Every label comes with a reason in plain English, so the owner can check it and decide.

### How it spots a bot

A bot is a program pretending to be a person. It's good at pretending, but it's not perfect. So Botsense looks for small mistakes in three places: the network, the browser, and the way the mouse and keyboard move.

One odd clue is never enough, because a real person on a VPN looks odd too. Botsense only calls a visitor a bot when the proof is strong. If it's not sure, it says "suspect" and leaves the choice to you.

### Then i attacked my own app

Once it worked, i did what i wish those other apps had done. I played the attacker and tried to break it. I found **26 problems**.

The worst one embarrassed me. My own app was calling ordinary shoppers bots. That's exactly the thing i set out to avoid, and i'd built it myself.

Most of the 26 are fixed now, and each fix has a test so it can't sneak back. A few are still open, and i'd rather tell you that than pretend.

### Testing a bot detector is weirdly hard

Bots are easy to fake in a test. Real people are the hard part. So i test with real browsers on Linux, Windows and Mac, with real mouse and keyboard input.

One rule came out of it: **if the detector never saw the visit, the test fails.** A test that sees nothing proves nothing.

### What it can't do yet

I'm not going to tell you it catches every bot. It doesn't. A bot built very carefully to look human can still fool it, and i'm still working on that.

Card testing is the same story. Botsense looks at who is checking out, and a script testing cards is still a script. But i haven't built anything just for card testing, and i haven't tested against it yet. So i won't promise it.

That's why Botsense only blocks when the proof is strong. If it's not sure, it labels and lets you decide.

### Stuff i'd tell myself

- **Read the one star reviews.** They're free market research, written by angry people.
- **Wrongly blocking a customer costs more than missing a bot.** Build around that.
- **Attack your own app first.** Someone else will if you don't.
- **Start in test mode.** Let people see what it would do before it does it.

### Where it is now

Store owners see a dashboard inside Shopify, and Pro goes through Shopify's own billing. If my server ever goes down, the store carries on as if Botsense wasn't installed. I never want it to be the reason someone can't sell.

Botsense is in early access while the Shopify App Store review finishes. The free plan labels bots and never blocks anyone. You can see how it works and join in at [botsense.vercel.app](https://botsense.vercel.app/).

If you run a store and bots are a headache, [say hi](mailto:kuldeep.yadav1@gmail.com). I'd like to hear what you're seeing.
