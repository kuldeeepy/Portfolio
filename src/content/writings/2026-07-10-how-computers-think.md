---
title: How computers think
date: 2026-07-10
summary: It's just bunch of electrical switches having either on or off state, literally.
---

I was always curious to understand how these tiny boxes (computers) work. Its insane to believe that they're just bunch of electrical switches, literally.

![gogle](https://cdn.wallpapersafari.com/20/53/jcCZWG.png)

## Binary

Computers can understand only two things either something is done or its not done, like i said they're just bunch of switches, a switch has only two states **On** or **Off** nothing in between. So computers only understand 0 (off) and 1 (on) which is called **binary**

## Bits and bytes

To represent a piece of information we use the word **bit** (a binary digit)
> 0 or 1 would be considered a bit

bit can only represent very small amount of information for example if a bulb is on or off, a single state. but if you want to represent big chunk of information like writing your pet's name, now you would need multiple bits to represent here comes bytes in the picture.
> 01001011 -> K

as you can see grouping these 8 bits makes a byte which can represent numbers, letters, colors, even pictures which can be understood by humans.

>Example: the letter **"A"** is agreed (by a standard called ASCII) to be represented as the byte `01000001`.

## The cpu

Storing these bits / bytes in the computer won't help us in any way so there has to be something which can do things like adding, comparing and moving the numbers somehow, that doer is cpu.

cpu has a single job, to follow the instruction and execute a given task. It could be multiplying or adding two numbers. cpu follows a three step loop always to do something

**Fetch -> Decode -> Execute**
 - Fetch the next instruction to be executed.
 - Decode the instruction to understand what exactly needs to be done.
 - Execute the instruction, actually do it.

Then it moves to the next instruction and repeats . Forever. Billions of times per second.

## Memory

for our computer to store the bits and bytes and make some operation on them it needs a place to sit somewhere, we call it memory.

a memory is of two types **RAM** and **ROM**

**RAM (Random Access Memory)**
 - short term
 - fast
 - wipes everything out when power is off.
 
**ROM (Read Only Memory)**
 - long term
 - slower
 - keeps things even when power is off.

but why do we need two types of memories why not one? i thought the same. Computer needs constant power to hold data and do any operation which's expensive.

if you noticed above the RAM is fast and short lived but the ROM is slower but long lived, which logically means we should use RAM for write operations and ROM for read operations but why?

Because its not always very frequent that you'd require all the information at once, you might want to use some chunk of it and make some operation on top of it which's fair realistically i guess.
> eg. chatgpt keeps all your chat histories (they call it memory) but at a time you can use one of the conversation history right? so why would openai load all your memory in the RAM wouldn't it be efficient and cost effective to keep the unsused stuff in ROM and keep whats needed right now?

##  Stack vs Heap

computers can't just store anything anywhere, there has to be a structured way and different use cases right? So the RAM is organized in two structures with a different use cases:

**Stack**
- small data
- short lived operation
- ordered data

**Heap**
 - huge data
 - long lived operation
 - flexible data

```
function greet() {
  let age = 49;                    // small, static → STACK
  let user = { name: "James" };  // bigger, flexible → HEAP
}
```


More soon.
