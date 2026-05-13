import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter, extractJSON } from "@/lib/openrouter";
import { ASSISTANT_SYSTEM_PROMPT, TASK_PARSER_SCHEMA_PROMPT } from "@/lib/assistantPrompt";

// ── Schemas ───────────────────────────────────────────────────────────────────

const RequestSchema = z.object({
  text: z.string().min(1).max(1000),
  date: z.string().optional(),
});

const TaskItemSchema = z.object({
  title: z.string(),
  priority: z.enum(["P1", "P2", "P3"]),
  reason: z.string().optional().default(""),
});

const ParsedTasksSchema = z.object({
  todayLock: z.string().nullable(),
  activeTasks: z.array(TaskItemSchema).max(3),
  waitingTasks: z.array(TaskItemSchema),
  rhythmNotes: z.array(z.string()),
  developmentStep: z.string().nullable(),
  assistantWarning: z.string().nullable(),
});

type ParsedTasks = z.infer<typeof ParsedTasksSchema>;

// ── Fallback ──────────────────────────────────────────────────────────────────

function buildFallback(text: string): ParsedTasks {
  return {
    todayLock: null,
    activeTasks: [{ title: text.trim().slice(0, 80), priority: "P2", reason: "Serbest metin" }],
    waitingTasks: [],
    rhythmNotes: [],
    developmentStep: null,
    assistantWarning: null,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { text } = parsed.data;

  const userPrompt = `Kullanıcının yazdığı metin:\n"${text}"\n\n${TASK_PARSER_SCHEMA_PROMPT}`;

  const content = await callOpenRouter([
    { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ], { maxTokens: 400, temperature: 0.3 });

  if (!content) {
    return NextResponse.json(buildFallback(text));
  }

  const raw = extractJSON(content);
  const tasksParsed = ParsedTasksSchema.safeParse(raw);
  if (!tasksParsed.success) {
    return NextResponse.json(buildFallback(text));
  }

  return NextResponse.json(tasksParsed.data);
}
