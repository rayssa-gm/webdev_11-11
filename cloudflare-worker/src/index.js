function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const ALLOWED_ACTIONS = new Set([
  "createSpreadsheet",
  "listSheets",
  "readRange",
  "appendRows",
  "updateRange",
]);

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers: cors });

    const auth = request.headers.get("Authorization") || "";
    const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!safeEqual(supplied, env.GPT_ACTION_KEY)) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: cors });
    }

    if (!env.APPS_SCRIPT_URL || !env.BRIDGE_SECRET) {
      return Response.json({ ok: false, error: "Gateway is not configured" }, { status: 500, headers: cors });
    }

    let payload;
    try {
      const raw = await request.text();
      if (raw.length > 1_000_000) return Response.json({ ok: false, error: "Request too large" }, { status: 413, headers: cors });
      payload = JSON.parse(raw);
    } catch {
      return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400, headers: cors });
    }

    if (!payload || !ALLOWED_ACTIONS.has(payload.action)) {
      return Response.json({ ok: false, error: "Unsupported action" }, { status: 400, headers: cors });
    }

    const upstream = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, bridgeSecret: env.BRIDGE_SECRET }),
      redirect: "follow",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({ ok: false, error: "Apps Script returned a non-JSON response", details: text.slice(0, 500) }, { status: 502, headers: cors });
    }

    return Response.json(data, { status: upstream.ok ? 200 : 502, headers: cors });
  },
};
