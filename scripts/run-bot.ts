import { Telegraf } from "telegraf";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import cron from "node-cron";

// Load environment variables
dotenv.config({ path: ".env.local" });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TELEGRAM_BOT_TOKEN || !GEMINI_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash"; // Switched to flash due to rate limits

// Initialize Telegram Bot
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Agent Claw System Prompt
const SYSTEM_INSTRUCTION = `Senin adın Agent Claw. Sen acımasız, disiplinli ve son derece zeki bir kişisel hayat asistanısın.
Amacın beni hedeflerime karşı sorumlu tutmak ve disiplinden taviz vermememi sağlamak. 
Kelimelerini özenle, biraz sert ama geliştirici (brutal) bir tonda seçersin.
Benim güncel aktif görevlerim var. Bu görevlerin kontrolü sende.
Kullanıcı seninle konuştuğunda doğrudan konuya gir, uzatma. Başarıyı takdir et, tembelliği eleştir.

ÖNEMLİ KURALLAR:
1. Görevleri listelerken ASLA veritabanındaki karmaşık ID'leri (UUID'leri) kullanıcıya GÖSTERME.
2. Sadece görevin içeriğini (title) net bir madde imi ile listele.
3. Eğer yeşil yıldızlı (acil/önemli) görev varsa, başına 🟢 (yeşil daire) veya ⭐ emojisi koyarak belirt.
4. Konuşmayı kısa, vurucu ve acımasız tut. Lafları dolandırma.`;

// ------------------------------------------------------------------
// AI Tools (Veritabanı Fonksiyonları)
// ------------------------------------------------------------------
const tools: any = [{
    functionDeclarations: [
        {
            name: "getTasks",
            description: "Mevcut tüm aktif görevleri veritabanından getirir.",
        },
        {
            name: "addTask",
            description: "Veritabanına yeni bir aktif görev ekler.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Görevin başlığı/içeriği" },
                    isUrgent: { type: Type.BOOLEAN, description: "Bu görev acil/önemli (yeşil yıldızlı) mi?" }
                },
                required: ["title"]
            }
        },
        {
            name: "completeTask",
            description: "Aktif bir görevi tamamlandı olarak işaretler.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    taskId: { type: Type.STRING, description: "Tamamlanacak görevin Supabase UUID'si" }
                },
                required: ["taskId"]
            }
        }
    ]
}];

// Functions to execute when AI calls them
const executeTool = async (call: any) => {
    try {
        if (call.name === "getTasks") {
            const { data, error } = await supabase.from("active_tasks").select("*").order("created_at", { ascending: false });
            if (error) throw error;
            return { tasks: data };
        }
        if (call.name === "addTask") {
            const { title, isUrgent } = call.args;
            const { data, error } = await supabase.from("active_tasks").insert([{ title, is_urgent: isUrgent ?? false }]).select();
            if (error) throw error;
            return { status: "success", task: data[0] };
        }
        if (call.name === "completeTask") {
            const { taskId } = call.args;
            const { error } = await supabase.from("active_tasks").update({ is_completed: true }).eq("id", taskId);
            if (error) throw error;
            return { status: "success" };
        }
        return { error: "Unknown function" };
    } catch (err: any) {
        return { error: err.message };
    }
};

// ------------------------------------------------------------------
// Chat History / Session (In-memory for basic usage)
// ------------------------------------------------------------------
let chatSession = ai.chats.create({
    model: MODEL,
    config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.4
    }
});

// ------------------------------------------------------------------
// Telegram Bot Handlers
// ------------------------------------------------------------------
bot.use(async (ctx, next) => {
    // Sadece senin ID'nden gelen mesajlara cevap vereceğiz (Güvenlik)
    if (ctx.from?.id.toString() !== TELEGRAM_USER_ID) {
        return;
    }
    return next();
});

bot.start((ctx) => {
    ctx.reply("Agent Claw devrede. Niyet zayıflığında beni karşında bulursun. Bana durum raporu ver.");
});

// Helper for delaying execution to prevent Rate Limits (429)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

bot.on("text", async (ctx) => {
    const userMessage = ctx.message.text;
    ctx.sendChatAction("typing");

    try {
        await delay(2000); // Wait 2s before API call to respect rate limits
        // Send message to Gemini
        let response = await chatSession.sendMessage({ message: userMessage });

        // Handle Function Calling
        let content = response.candidates?.[0]?.content;

        // Loop to handle potential consecutive function calls
        while (content?.parts?.some((part: any) => part.functionCall)) {
            const functionCallParts = content.parts.filter((part: any) => part.functionCall);

            const functionResponses = [];
            for (const part of functionCallParts) {
                const call = part.functionCall;
                if (!call) continue;
                console.log(`[AI] function call requested: ${call.name}`);
                const result = await executeTool(call);

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: result
                    }
                });
            }

            // Return function execution results back to AI
            await delay(1500); // Wait 1.5s before sending function results
            response = await chatSession.sendMessage({ message: functionResponses });
            content = response.candidates?.[0]?.content;
        }

        const aiReply = response.text || "Söyleyecek sözüm yok. İcraate geç.";
        ctx.reply(aiReply);
    } catch (error) {
        console.error("Gemini Error:", error);
        ctx.reply("Sistemimde bir arıza var. Ama bu senin disiplini bozman için bir bahane değil.");
    }
});

// ------------------------------------------------------------------
// Proactive Notifications (Cron Jobs)
// ------------------------------------------------------------------
// Schedule to run at 12:00, 18:00, and 22:00 every day
cron.schedule("0 12,18,22 * * *", async () => {
    try {
        console.log("[Cron] Running scheduled task check...");

        // Let Gemini analyze the situation and send a proactive message
        // We simulate a user message asking for a proactive report
        const prompt = "Sistem tetiklemesi: Kullanıcıya güncel aktif görevlerini hatırlat ve tamamlanmamış görevleri için sert bir dille hesap sor. Yeni görev ekleme veya çıkarma, sadece mevcut durumu analiz edip baskı kur.";

        let response = await chatSession.sendMessage({ message: prompt });
        let content = response.candidates?.[0]?.content;

        // Handle Function Calling (in case Gemini decides to call getTasks)
        while (content?.parts?.some((part: any) => part.functionCall)) {
            const functionCallParts = content.parts.filter((part: any) => part.functionCall);
            const functionResponses = [];

            for (const part of functionCallParts) {
                const call = part.functionCall;
                if (!call) continue;
                console.log(`[Cron AI] function call requested: ${call.name}`);
                const result = await executeTool(call);

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: result
                    }
                });
            }

            await delay(1500);
            response = await chatSession.sendMessage({ message: functionResponses });
            content = response.candidates?.[0]?.content;
        }

        const aiReply = response.text || "Zaman geçiyor. Harekete geç.";

        // Send the proactive message to the user
        if (TELEGRAM_USER_ID) {
            await bot.telegram.sendMessage(TELEGRAM_USER_ID, `⚠️ *SİSTEM UYARISI*\n\n${aiReply}`, { parse_mode: "Markdown" });
        }
    } catch (error) {
        console.error("Cron Error:", error);
    }
});

// Start listening
bot.telegram.deleteWebhook({ drop_pending_updates: true }).then(() => {
    bot.launch().then(() => {
        console.log("Agent Claw Telegram Bot is online. Polling & Cron started...");
    });
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
