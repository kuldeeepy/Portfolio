// WebMCP — publishes the same tool list the ⌘K palette uses, so an agent gets
// a typed interface instead of having to read the rendered DOM.
//
// Chrome 151+ behind chrome://flags#enable-webmcp-testing. Everywhere else
// document.modelContext is undefined and this is a no-op, so it costs nothing
// to ship. The API lives on `document`, not `navigator` — it moved in the
// May 2026 draft, on the reasoning that tools belong to a page.
//
// Two things the docs don't mention, found by probing:
//   - executeTool(tool, args) wants args as a JSON *string*; an object throws
//   - the value returned to the agent comes back serialised

// This build has registerTool but no unregisterTool, and StrictMode mounts
// twice in dev, so guard at module scope rather than per-effect.
let registered = false;

export async function registerWebMcpTools(tools) {
  const mc = typeof document !== "undefined" && document.modelContext;
  if (!mc || registered) return false;
  registered = true;

  await Promise.all(
    tools.map((tool) =>
      mc.registerTool({
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: async (args) => {
          const text = await tool.run(args ?? {});
          return { content: [{ type: "text", text: String(text) }] };
        },
      }),
    ),
  );
  return true;
}
