---
title: Winking at my laptop to turn pages

date: 2026-09-06

summary: I was tired of pressing page down while reading a pdf, so i made my webcam do it. Turns out nobody's eyes are symmetric, which is a problem when you're counting winks.
---

I was reading a book in my browser, its around 900 pages, and every 40 seconds i had to reach over and press page down. Very small problem. Extremely annoying problem.

So instead of just pressing the key like a normal person, i spent an evening building a thing that watches my face and does it for me.

### Eye tracking (no)

My first idea was gaze tracking. Look at the right side of the screen, page turns. Look at the left, goes back. Sounds cool.

It doesn't work. Figuring out where your pupils are actually pointing needs way better hardware than the little camera above your screen. And even if it kinda worked, you'd be turning pages every time you looked at the clock or someone walked into the room.

So gaze is out. What works instead is a **gesture**, something you clearly did on purpose. Not "where is he looking" but "did he just do a thing with his face".

A wink is perfect for this. You never accidentally wink.

> wink right eye → next page
> wink left eye → previous page

### Blendshapes

Now the question is how does a computer know i winked.

Google has a model called MediaPipe Face Landmarker. You give it one frame from your webcam and it gives you back a bunch of information about the face it found in it.

The part i needed is called **blendshapes**. These are around 52 numbers, and each number tells you how much one specific facial thing is happening right now, from 0 to 1. There's one for smiling, one for each eyebrow going up, one for puffing your cheeks.

And there are two called `eyeBlinkLeft` and `eyeBlinkRight`.

```text
eyes wide open   →  0.02
normal           →  0.15
eye fully shut   →  0.95
```

That's basically the whole thing. Someone already did the hard part of looking at a face and turning it into numbers, i just have to read two of those numbers 30 times a second and decide if it counts as a wink.

### The naive approach

So the first version was pretty much this:

```text
if right eye is shut and left eye is open:
    press page down
```

Ship it, what could go wrong.

Well first it crashed. Not a normal error, an actual C++ stack trace:

```text
Check failed: service_ Service is unavailable.
```

mediapipe 1.0.1 on an M4 goes looking for a Metal (gpu) thing that isn't there, and instead of falling back to the cpu it just dies. Forcing cpu didn't help either. Pinning `mediapipe<1.0` fixed it, 0.10.35 works fine. ok, moving on.

### It worked, then it stopped

Second run it was actually seeing my face. I winked, page turned. Winked again, page turned. Third time, page turned.

Then nothing. Completely dead. I could wink all i wanted and nothing happened.

The reason was something i added on purpose. After turning a page i didn't want one long wink to keep firing again and again, so i added a rule: after firing, don't fire again until both eyes are open.

Sounds reasonable. The problem is how i decided what "open" means. I just picked a number, below 0.3 is open.

But when you're reading, you're looking **down**, and your eyelids come down a bit with your eyes. So my fully open eyes were sitting at around 0.28 while reading, which is *just* under my line. One tiny movement and my eye was no longer officially open, so the script sat there waiting forever for me to open my eyes, which were already open.

```text
    shut  1.0 ┤
              │
  my line     ┤ 0.30   ← "below this = open"
  me reading  ┤ 0.28   ← eyes fully open btw
              │
    open  0.0 ┤
```

Great margin lmao.

### Print the numbers

At this point i stopped guessing and made it print what it was actually seeing, which honestly i should do earlier every single time.

```text
R 0.05  L 0.15   ← both eyes open, just sitting there
R 0.22  L 0.64   ← left wink   → worked
R 0.57  L 0.34   ← right wink  → nothing happened??
```

Two things came out of this.

**First, my eyes are not the same.** At rest my left eye reads 0.15 and my right reads 0.05. That's just my face. Nobody is perfectly symmetric.

**Second**, because of that, every wink was being counted as a left wink. My left eye starts 0.10 higher than my right, so it wins the "which eye is more shut" question before i've even done anything.

So when i winked with my right eye the difference between the two eyes came out to 0.23, and when i winked with my left it came out to 0.42. Same gesture, but one of them was above my threshold and one was below it, so right winks just got thrown away.

### Comparing each eye to itself

The fix is to stop comparing my eyes to some number i made up, and compare each eye to **its own normal** instead.

So the script watches your face and learns what each of your eyes reads when you're just sitting there doing nothing. Then it only looks at how far each eye moved *from its own baseline*.

```text
                   raw    baseline    moved
right eye     →   0.57  −   0.05   =   0.52
left eye      →   0.34  −   0.15   =   0.19
                                 difference = 0.33  ✅

left eye      →   0.64  −   0.15   =   0.49
right eye     →   0.22  −   0.05   =   0.17
                                 difference = 0.32  ✅
```

Now both winks come out around 0.32. Same gesture gives the same number no matter which eye you use.

And it accidentally fixed the reading problem too. When you look down, **both** eyes go up together, so the difference between them barely changes. A wink is one eye moving alone, looking down is both eyes moving together. So the difference between the two eyes tells them apart, and it doesn't need to know anything about where you're looking.

```text
                  left   right   difference
just reading  →   0.16   0.22      0.06     → nothing
normal blink  →   0.34   0.32      0.02     → nothing
actual wink   →   0.49   0.17      0.32     → page turn
```

> One small thing, the baseline follows your face down quickly but up very slowly. Otherwise if you hold a wink for a while, the script would slowly decide that "shut" is your new normal and the wink would disappear on its own.

### Stuff i'd tell myself

- **print the actual numbers first.** every real fix here came from looking at real values, and every wrong turn came from me imagining what the values probably were.
- **don't pick fixed thresholds when the thing you're measuring is a person.** faces are different, and the same face is different depending on whether its looking at you or at a book. learn the normal instead of guessing it.

### Two annoying things

If you try it, macos needs **Accessibility** permission to let any program send fake key presses, and it doesn't ask you for it. Camera it asks for, accessibility you have to go add by hand. And until you do, everything looks like its working while nothing happens. Took me a while to figure out.

Also winking is more tiring than you'd expect. Most people can't wink one eye without slightly squinting the other one, and that's exactly the confusing case i throw away on purpose. Ten minutes in you'll feel it.

### In a nutshell

Its a menu bar app now, so its a toggle instead of a terminal window sitting open. 👁 means its watching and 😴 means its off, and the camera light actually goes off too.

Takes around 150ms from wink to page turn, which is fast enough that you don't feel like you're waiting for it.

Would pressing page down have been easier? yes. obviously. next question.

Code's here if you want to try it → [winkscroll](https://github.com/kuldeeepy/winkscroll)
