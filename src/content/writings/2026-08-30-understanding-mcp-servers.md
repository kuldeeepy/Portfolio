---
title: Understanding MCP Servers

date: 2026-08-30

summary: MCP sounds complex at first, but at its core, it's a standardized way for AI applications to discover and interact with external tools and data.
---

The first time I heard about MCP, It seemed like something really complex.

![gogle](https://shorturl.at/EZPl2)

**But it isn't.**

I remember the first mcp I used was the Figma MCP to replicate the design my fellow designer had created. And after using it, I realized that mcp is not really so complex.

btw one of my friend is really obsessed with concept of mcp, he wants mcp for almost everything i wonder when he's going to build an mcp server to connect claude with his gf lmao :)

But jokes apart, let's break it down into small pieces.

### Protocol

As developers, we've already been working with protocols like HTTP/HTTPS while building APIs all day.

A **protocol** is simply a shared set of rules that different systems follow when communicating with each other. 

For example, with HTTP, we have methods like:

```text
GET
POST
PATCH
DELETE
```

These are rules both the client and server understand. The client knows how to make a request, and the server knows how to respond to it.

MCP is also a protocol, but instead of defining how a browser talks to a web server, it defines how an AI application can communicate with external capabilities such as tools and data sources.

### Context

Suppose you tell your LLM (ChatGPT, Claude, etc.) "I am XYZ and I'm from San Francisco." Then, after a few back-to-back messages, you ask the AI something about yourself.

It can still tell you that you're xyz and from sf, its because the conversation history is provided to the AI while generating its response as **context**.

context helps the model understand what you're talking about and generate a more relevant response. You can think of context as the AI's working memory for the conversation.

Now imagine that instead of just having your conversation, we could also provide the AI with information from the outside world like files, GitHub repositories, databases, APIs, Figma files, and so on.

That's where things start getting interesting...

### Model

The model is the actual AI doing the reasoning like your Claude, ChatGPT, or whatever model you're using.

When you ask:

> What's the weather in Moscow?

The ai models doesn't magically know the current weather they're just a dumb algorithm which predicts the next word. It needs some external capability that can fetch that information.

For example, imagine we have a tool called:

```text
fetchWeatherOfCity(city)
```

The model can look at the tools available to it and decide that `fetchWeatherOfCity` is relevant to the question.

It can then request `fetchWeatherOfCity("Moscow")`


The tool goes and gets the actual information, returns the result, and the model uses that result to generate the final answer.

This is the basic idea behind **tool calling**.

But where do these tools actually live? Obviously in an **MCP Server**.

An MCP server is a program that exposes capabilities to an AI application through the MCP protocol. For example, imagine we create an mcp server for a city information service.

It could expose tools like:

```text
fetchWeatherOfCity(city)
fetchPopulationOfCity(city)
fetchAreaOfCity(city)
```

Now your AI can connect to this MCP server and discover these tools.

The important part is that the AI doesn't need to know how the tool is implemented internally.

It only needs to know what the tool does and what input it expects:

```text
Tool:
fetchWeatherOfCity

Input:
city: string

Description:
Fetches the current weather for a city.
```

So you can think of an MCP server as a **bridge between an AI application and some external capability**.

### Host, Client and Server

There is one more piece we need to understand.

When you use something like Claude Desktop or Cursor, the application you're interacting with is the **host**.

Inside that host is an **MCP client**, which is responsible for communicating with mcp servers.

The basic architecture looks like this:

```text
You → AI Host → MCP Client → MCP Server → External System
       Claude / Cursor                 Figma / DB / API
```

The important distinction is:

- **Model** → decides what it needs
- **MCP Client** → communicates with the MCP server
- **MCP Server** → exposes the tools
- **External system** → provides the data or performs the action

The model doesn't directly communicate with the MCP server. The model just decides which capability it needs, while the mcp client handles the communication.

### Putting It Together

Let's go back to our weather example.

You ask:

> What's the weather in Moscow?

The model realizes it needs current weather information and chooses the `fetchWeatherOfCity` tool.

The rough flow looks like this:

```text
┌──────┐ → ┌────────┐ → ┌───────┐ → ┌──────────┐ → ┌──────────┐
│ User │   │  Host  │   │ Model │   │  Client  │   │  Server  │
└──────┘   └────────┘   └───────┘   └──────────┘   └────┬─────┘
                                                        │
                                                        ↓
                                                   ┌─────────┐
                                                   │ Weather │
                                                   │   API   │
                                                   └────┬────┘
                                                        │
                                                        ↓
┌────────┐ ← ┌───────┐ ← ┌────────┐ ← ┌──────────┐ ← ┌───────┐
│ Answer │   │ Model │   │ Client │   │  Server  │   │ Result│
└────────┘   └───────┘   └────────┘   └──────────┘   └───────┘
```

### How Does the MCP Client Communicate with the Server?

Your mcp server defines how this communication happens. The two main transport mechanisms are **stdio** and **Streamable HTTP**.

### Local MCP Server

A local mcp server can run as a process on your machine. The AI host communicates with it through standard input and output (`stdin` / `stdout`).

```text
AI Host ── stdin / stdout ──> MCP Server
```

The messages use **JSON-RPC**.

This is useful for MCP servers that need access to things on your local machine, such as your filesystem.

### Remote MCP Server

An mcp server can also run on another machine and communicate over HTTP / HTTPS network calls.

```text
AI Host ── HTTP ──> MCP Server ──> External Service
```

This is useful when the server needs to be hosted remotely and accessed by multiple clients. 

Instead of every AI application inventing its own way to talk to every service, an mcp server can expose those capabilities through a standardized interface.


In nutshell it's simply a protocol for connecting AI applications to external capabilities.