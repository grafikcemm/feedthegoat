import { NextResponse } from "next/server";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

// Initialize bot with Token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// Handle basic commands
bot.start((ctx) => {
    ctx.reply("Ben Agent Claw. Hayatının, disiplininin ve hedeflerinin otonom yöneticisiyim.\nSeni izliyorum.");
});

bot.on(message("text"), async (ctx) => {
    // We will connect Gemini here later
    const userText = ctx.message.text;
    await ctx.reply(`Mesajını aldım: "${userText}". Gemini entegrasyonu hazırlanıyor...`);
});

// Configure Next.js webhook handler
export async function POST(req: Request) {
    try {
        const body = await req.json();
        await bot.handleUpdate(body);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Telegram Webhook Error:", error);
        return NextResponse.json({ ok: false, error: "İşlem başarısız" }, { status: 500 });
    }
}
