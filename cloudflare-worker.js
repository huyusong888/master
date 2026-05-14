// 方式一：直接在这里填写，适合自己部署测试。
// 方式二：在 Cloudflare Worker 环境变量里设置同名变量，更适合正式发布。
// 环境变量优先级更高，会覆盖这里的值。
const OPENAI_API_KEY = "你的 OpenAI API Key";
const OPENAI_MODEL = "gpt-4o-mini";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/translate") {
      return json({ error: "Not found" }, 404);
    }

    const apiKey = env.OPENAI_API_KEY || OPENAI_API_KEY;
    const model = env.OPENAI_MODEL || OPENAI_MODEL;

    if (!apiKey || apiKey === "你的 OpenAI API Key") {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const text = String(payload.text || "").trim();
    const target = String(payload.target || "zh-CN").trim();

    if (!text) {
      return json({ error: "Missing text" }, 400);
    }
    if (text.length > 3000) {
      return json({ error: "Text is too long" }, 413);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Translate English spreadsheet cell text into the requested target language. Return only the translation, no quotes, no explanation.",
          },
          {
            role: "user",
            content: `Target language: ${target}\nText: ${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json({ error: "Translation provider failed", detail: errorText }, response.status);
    }

    const data = await response.json();
    const translation = data?.choices?.[0]?.message?.content?.trim() || "";
    return json({ translation });
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
