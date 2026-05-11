/**
 * Cloudflare Pages Functions — 留言 API
 * 绑定 KV 命名空间：MESSAGES（部署时在 Cloudflare Dashboard 绑定）
 *
 * GET  /api/messages  → 获取最近 50 条留言（按时间倒序）
 * POST /api/messages  → 提交新留言  body: { content: "..." }
 * OPTIONS            → CORS 预检
 */

export async function onRequest(context) {
  const { request, env } = context;

  // 统一响应头
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  // CORS 预检
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // ---------- GET：获取留言列表 ----------
  if (request.method === "GET") {
    try {
      const list = await env.MESSAGES.list({ prefix: "msg_", limit: 50 });
      const messages = [];

      for (const key of list.keys) {
        const raw = await env.MESSAGES.get(key.name);
        if (raw) {
          try {
            messages.push(JSON.parse(raw));
          } catch (_) {
            // 跳过损坏数据
          }
        }
      }

      // 按时间戳倒序（最新在前）
      messages.sort((a, b) => b.timestamp - a.timestamp);

      return new Response(JSON.stringify({ success: true, messages }), {
        status: 200,
        headers,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 500, headers }
      );
    }
  }

  // ---------- POST：提交留言 ----------
  if (request.method === "POST") {
    try {
      const body = await request.json();

      if (!body.content || typeof body.content !== "string") {
        return new Response(
          JSON.stringify({ success: false, error: "留言内容不能为空" }),
          { status: 400, headers }
        );
      }

      const content = body.content.trim().slice(0, 500); // 限制 500 字
      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: "留言内容不能为空" }),
          { status: 400, headers }
        );
      }

      const message = {
        id: crypto.randomUUID(),
        content,
        timestamp: Date.now(),
      };

      // KV key 格式：msg_{时间戳}_{uuid前8位}
      const key = `msg_${message.timestamp}_${message.id.slice(0, 8)}`;
      await env.MESSAGES.put(key, JSON.stringify(message));

      return new Response(
        JSON.stringify({ success: true, message }),
        { status: 201, headers }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 500, headers }
      );
    }
  }

  // 其他方法
  return new Response(JSON.stringify({ success: false, error: "Method Not Allowed" }), {
    status: 405,
    headers,
  });
}
