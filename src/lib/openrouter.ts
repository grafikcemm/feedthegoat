export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = options.model ?? process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) return null;

  const {
    temperature = 0.3,
    maxTokens = 500,
    timeoutMs = 10000,
  } = options;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://feedthegoat.app",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const msg = data?.choices?.[0]?.message;
    // reasoning models (e.g. deepseek-v4-pro) put output in `reasoning`, not `content`
    const content: string | undefined =
      msg?.content ?? msg?.reasoning ?? msg?.reasoning_details?.[0]?.text;
    return content ?? null;
  } catch {
    return null;
  }
}

export function extractJSON(text: string): unknown | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
