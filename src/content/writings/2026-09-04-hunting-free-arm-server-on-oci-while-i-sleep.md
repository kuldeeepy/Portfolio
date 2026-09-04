---
title: Hunting free ARM servers on OCI while I sleep

date: 2026-09-04

summary: Oracle's free ARM servers are never in stock, at least in my region, so I let a script do the asking. Turns out it had quietly stopped.
---

Considering that i am broke as hell at every month-end but i also want my own cloud server where i can host my sloppy 0 rps apis and run some random background job without choking my local machine. Also solves the downtime issue.

![gogle](https://shorturl.at/OklFs)

I got to know oracle has an always free tier which has two types of compute instances

```
> In AMD you can get 2 micro VMs (1/8 OCPU, 1 GB RAM each)
> In ARM you can get 2 OCPUs and 12 GB of RAM (still pretty good)
```

I was able to get these two AMD instances and one of them i am using to hunt for the ARM one which is pretty hard to get, at least in my region on a free account.

> Btw, worth checking your account limits before you enter the never-ending begging loop!!

```
  oci limits resource-availability get --compartment-id <tenancy> \
    --service-name compute --limit-name standard-a1-core-count \
    --availability-domain "<your AD>"
```

#### The Problem

ARM shape is mostly always out of stock in popular / busiest regions and obviously there's no waiting list or free-up notification saying "here you go with an always free instance" so the best we can do is keep hitting (begging) their servers for a VM instance.


<!-- ![gogle](https://shorturl.at/EZPl2) -->

#### The naive approach

If you understood the problem, we can solve it by writing a simple POST request inside a loop which'll hit the oracle till eternity or until we get a VM. It might look something like this

```
while (true) {
  const res = await fetch(ORACLE_API, { method: "POST", body: serverConfig });
  
  if (res.ok) break;  // got a server, done
  
  await sleep(500); // nope, try again lmao
}
```

Looks fine, right? It isn't. There are two major issues you can get into with this: 

- **Rate limit:** considering this above script, let's say your one round-trip of request-response took 500ms to complete so in **1 sec 1 api call**, in **1 min 60 api calls** and in **an hour 3600 api calls**, you're ngmi.

- **Error handling:** It can get you into two kinds of error scenarios, **retriable** and **non-retriable**. 
  - Retriable error could be like no compute available, their server is down, some network issue. 
  - Non-retriable error could be like requested more compute than your account is allowed to (eg. their policy changed) or a malformed request. waiting won't fix these, this is how you end up with a script that looks busy for two days and was never going to work.

And here's the annoying part. You'd assume you can just check the status code, 4xx means i broke something, 5xx means they broke something.

but oracle sends "out of host capacity" as a **500** 🙃

```
{
  "status": 500,
  "code": "InternalError",
  "message": "Out of host capacity."
}
```

Nothing is actually broken, there just aren't any servers. But it shows up dressed as a server error, so you can't go by the status code, you have to read the message.

there's one more risk, make sure the **serverConfig** you've passed to the request body has valid metadata for the vm you want. because once it initializes the instance, if you didn't add your public access key to it, you'll never be able to ssh into the vm hence you'll have to delete it and beg oracle again for an instance.

your payload should look something like this

```
  {
    shape: "VM.Standard.A1.Flex", // ARM machine
    shapeConfig: { ocpus: 1, memoryInGBs: 6 },
    imageId: "...", // Ubuntu 24.04 ARM
    subnetId: "...",  // which network to attach to
    assignPublicIp: true,
    metadata: {
      ssh_authorized_keys: "ssh-ed12345 ABCDE3Nz... MrBean" // ← this one ;)
    }
  }
```

#### Why a 429 is worse than it looks

This one took me a while to get. Your request doesn't go straight to the thing that knows about servers, there's a rate limiter sitting in front of it.

```
your request
     │
     ▼
┌──────────────────┐
│ rate limiter     │  "asking too often?"
└────────┬─────────┘
    yes ─┴─ no
     │       │
     ▼       ▼
   429    ┌──────────────────┐
          │ capacity check   │  "any servers free?"
          └────────┬─────────┘
              ┌────┴────┐
              ▼         ▼
        out of      here you
        capacity      go
```

"Out of host capacity" and "429" feel like the same thing. both are failures, both mean no server for you. But they're not the same at all.

"Out of capacity" means somebody actually checked, and there was nothing.

**429 means nobody checked.** you got stopped at the door.

So a rate limited request isn't a failed attempt, it's not an attempt at all. My script was running full speed, logs scrolling, and it wasn't even asking.

#### Oracle's Retry Mechanism

Which brings me to how i was hitting that limit without even realising.

So you send a POST, it fails, and you send another one. two requests, right?

Not really. Oracle's sdk/cli wrapper has its own retry mechanism baked in. When a request fails with something it thinks is temporary (their server choked, a network error, a 429) it quietly retries the same request in background until it's made **7 attempts**, and you won't even know about it.

You see one failure in your logs. Oracle saw seven requests.

```
your script                 what Oracle receives
───────────                 ────────────────────
attempt #1  ─────────────►  request 1
                            request 2  ┐
                            request 3  │ SDK retrying,
                            ...        │ invisible to you
                            request 7  ┘
            ◄─────────────  one error

sleep 11s

attempt #2  ─────────────►  request 8
```

And remember the 500 thing? Their sdk retries any 5xx by default (except 501), because normally a 5xx is a blip, try again in a second and it'll probably work.

But "out of host capacity" is not a blip. there were no free servers a second ago and there are none now. might change in an hour, might change next week. So the sdk sees a 500, assumes it's temporary, and fires 7 more requests that were all guaranteed to fail.

It gets funnier. **429 is also on their retry list.** Oracle tells you you're sending too many requests, and the sdk's answer is to send more requests. Idk what they're smoking lmao.

My log said attempt #47. Oracle's log said request #329.

So you make sure to pass the ``--no-retry`` flag, which simply means don't handle retry for me, I am already doing the error handling so i'll retry myself. Which i think probably is the safer approach here, because my loop knows things the sdk doesn't. it knows out-of-capacity won't fix itself in one second, and that the right answer to a 429 is to back off, not to try harder.

#### How I did it

```
┌────────────────────────────────────────────────┐
│ 1. SETUP — runs once                           │
└────────────────────────────────────────────────┘
   read public key  (~/.ssh/id_ed25519.pub)
   → build metadata  { ssh_authorized_keys: "..." }
   → do I already have an A1?
         yes → exit, nothing to do
         no  ↓

┌────────────────────────────────────────────────┐
│ 2. LOOP — until it lands                       │
└────────────────────────────────────────────────┘
   POST  /instances     (timeout 150s, --no-retry)
   ↓
   what came back?

   ├─ an instance id ─────────────────► SUCCESS
   │
   ├─ nothing / timed out ────────────► go and look:
   │                                      exists? → SUCCESS
   │                                      no?     → wait 165s
   │
   ├─ LimitExceeded, NotAuthorized ───► STOP. (un-retriable error).
   │  InvalidParameter                   
   │
   ├─ 429 Too Many Requests ──────────► wait 120s (retriable error)
   │
   ├─ 500 "Out of host capacity" ─────► wait 165s (retriable error)
   │
   └─ anything else ──────────────────► log it, wait 165s
                                          ↓
                                       loop again

┌────────────────────────────────────────────────┐
│ 3. SUCCESS                                     │
└────────────────────────────────────────────────┘
   poll for public IP   (up to 30 × 10s)
   → ping Discord
   → exit
```

In a nutshell, I tried to deep dive into why i am not getting VMs with my request loop and tried to make my approach optimal.

Its been running for 15 days now. 7,600 attempts. still nothing 🙂

But at least now its actually asking.

Code's here if you want to try it out → [oci-a1-hunter](https://github.com/kuldeeepy/oci-a1-hunter)