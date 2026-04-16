'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getWeekStart } from '@/lib/dates'

export async function ensureWeekTEDRecommendations(): Promise<void> {
  const supabase = createClient()
  const today = new Date()
  const weekStart = getWeekStart(today)

  // Bu hafta için zaten öneri var mı?
  const { count } = await supabase
    .from('ted_recommendations')
    .select('id', { count: 'exact', head: true })
    .eq('week_start', weekStart)

  if (count && count >= 2) return // Cumartesi + Pazar zaten var

  // Gemini API'dan öneri al
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('[TED] GEMINI_API_KEY not set, skipping')
    return
  }

  try {
    // Türkçe öneri (Cumartesi)
    const trResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bana gerçek bir TED veya TEDx konuşması öner. Konu: kişisel gelişim, disiplin, motivasyon, girişimcilik, yapay zeka veya yaratıcılık. Türkçe altyazılı veya Türk konuşmacı tercihli. Yanıtı SADECE şu JSON formatında ver, başka hiçbir şey yazma:
{
  "title": "konuşmanın başlığı",
  "speaker": "konuşmacının adı",
  "description": "2-3 cümle açıklama, neden izlemeli",
  "url": "ted.com veya youtube linki varsa, yoksa boş string"
}`
            }]
          }],
          generationConfig: { temperature: 0.9 }
        })
      }
    )

    const trData = await trResponse.json()
    const trText = trData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const trClean = trText.replace(/```json|```/g, '').trim()
    
    if (trClean) {
      try {
        const trRec = JSON.parse(trClean)
        await supabase.from('ted_recommendations').upsert({
          week_start: weekStart,
          day: 'saturday',
          title: trRec.title,
          speaker: trRec.speaker,
          description: trRec.description,
          url: trRec.url || null,
          language: 'tr',
        }, { onConflict: 'week_start,day' })
      } catch (e) {
        console.error('[TED] TR JSON Parse error:', e, 'Clean text:', trClean)
      }
    }

    // İngilizce öneri (Pazar)
    const enResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Recommend a real TED or TEDx talk. Topics: personal development, discipline, entrepreneurship, AI, creativity, or productivity. Prefer English-language talks with high view counts. Reply ONLY in this JSON format, nothing else:
{
  "title": "talk title",
  "speaker": "speaker name",
  "description": "2-3 sentences why to watch this",
  "url": "ted.com or youtube link if available, otherwise empty string"
}`
            }]
          }],
          generationConfig: { temperature: 0.9 }
        })
      }
    )

    const enData = await enResponse.json()
    const enText = enData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const enClean = enText.replace(/```json|```/g, '').trim()
    
    if (enClean) {
      try {
        const enRec = JSON.parse(enClean)
        await supabase.from('ted_recommendations').upsert({
          week_start: weekStart,
          day: 'sunday',
          title: enRec.title,
          speaker: enRec.speaker,
          description: enRec.description,
          url: enRec.url || null,
          language: 'en',
        }, { onConflict: 'week_start,day' })
      } catch (e) {
        console.error('[TED] EN JSON Parse error:', e, 'Clean text:', enClean)
      }
    }

  } catch (error) {
    console.error('[TED] Gemini API error:', error)
  }
}
