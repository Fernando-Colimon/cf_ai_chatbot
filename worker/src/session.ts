export class ChatSession {
  private state: DurableObjectState;
  private history: { role: string; content: string }[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;

    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<typeof this.history>("history");
      if (stored) this.history = stored;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    
    if (request.method === "POST" && url.pathname === "/add") {
      const msg = await request.json() as { role: string; content: string };
      this.history.push(msg);
      await this.state.storage.put("history", this.history);
      return Response.json({ ok: true });
    }

    
    if (request.method === "GET" && url.pathname === "/history") {
      return Response.json(this.history);
    }

    return new Response("Not found", { status: 404 });
  }
}