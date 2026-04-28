import { ChatSession } from "./session";
export { ChatSession };

export interface Env {
  AI: Ai;
  CHAT_SESSION: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      const body = await request.json() as { sessionId: string; message: string };

      const id = env.CHAT_SESSION.idFromName(body.sessionId);
      const obj = env.CHAT_SESSION.get(id);

      await obj.fetch(new Request("https://do/add", {
        method: "POST",
        body: JSON.stringify({ role: "user", content: body.message }),
      }));

      const historyRes = await obj.fetch(new Request("https://do/history"));
      const rawHistory = await historyRes.json() as { role: string; content: string }[];
      const history = rawHistory.map(m => ({ role: m.role, content: m.content }));

      const result = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        { messages: history }
      ) as { response: string };

      await obj.fetch(new Request("https://do/add", {
        method: "POST",
        body: JSON.stringify({ role: "assistant", content: result.response }),
      }));

      return Response.json(
        { response: result.response },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};