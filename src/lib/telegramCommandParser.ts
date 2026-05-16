import type { AgencyLoad, EnergyLevel } from './dailyOrchestrator';

export type ParsedIntent =
  | { type: 'set_agency'; agencyLoad: AgencyLoad }
  | { type: 'set_energy'; energy: EnergyLevel }
  | { type: 'set_state'; agencyLoad: AgencyLoad; energy: EnergyLevel }
  | { type: 'simplify' }
  | { type: 'send_plan' }
  | { type: 'send_status' }
  | { type: 'send_rhythms' }
  | { type: 'send_health' }
  | { type: 'send_finance' }
  | { type: 'send_book' }
  | { type: 'send_shutdown' }
  | { type: 'add_task_draft'; title: string }
  | { type: 'unknown'; raw: string };

const AGENCY_MAP: Record<string, AgencyLoad> = {
  yoğun: 'high', yogun: 'high', high: 'high',
  normal: 'normal', orta: 'normal',
  rahat: 'low', low: 'low',
};

const ENERGY_MAP: Record<string, EnergyLevel> = {
  düşük: 'low', dusuk: 'low', low: 'low',
  orta: 'medium', medium: 'medium',
  yüksek: 'high', yuksek: 'high', high: 'high',
};

export function parseTelegramMessage(text: string): ParsedIntent {
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // Slash commands
  if (lower === '/plan') return { type: 'send_plan' };
  if (lower === '/durum') return { type: 'send_status' };
  if (lower === '/yogun' || lower === '/yoğun') return { type: 'set_agency', agencyLoad: 'high' };
  if (lower === '/normal') return { type: 'set_agency', agencyLoad: 'normal' };
  if (lower === '/rahat') return { type: 'set_agency', agencyLoad: 'low' };
  if (lower === '/sadelestir') return { type: 'simplify' };
  if (lower === '/ritimler') return { type: 'send_rhythms' };
  if (lower === '/saglik' || lower === '/sağlık') return { type: 'send_health' };
  if (lower === '/finans') return { type: 'send_finance' };
  if (lower === '/kitap') return { type: 'send_book' };
  if (lower === '/shutdown') return { type: 'send_shutdown' };

  if (lower.startsWith('/enerji ')) {
    const part = lower.replace('/enerji ', '').trim();
    const energy = ENERGY_MAP[part];
    if (energy) return { type: 'set_energy', energy };
  }

  // Free-text: "görev ekle: ..."
  if (lower.startsWith('görev ekle:') || lower.startsWith('gorev ekle:')) {
    const title = raw.split(':').slice(1).join(':').trim();
    if (title) return { type: 'add_task_draft', title };
  }

  // "yoğun düşük" / "normal orta" etc.
  const parts = lower.split(/\s+/);
  if (parts.length === 2) {
    const agency = AGENCY_MAP[parts[0]];
    const energy = ENERGY_MAP[parts[1]];
    if (agency && energy) return { type: 'set_state', agencyLoad: agency, energy };
  }

  // Single agency or energy word
  if (parts.length === 1) {
    const agency = AGENCY_MAP[parts[0]];
    if (agency) return { type: 'set_agency', agencyLoad: agency };
    const energy = ENERGY_MAP[parts[0]];
    if (energy) return { type: 'set_energy', energy };
  }

  // Keyword matching
  if (lower.includes('sadeleştir') || lower.includes('sadele') || lower.includes('minimum')) {
    return { type: 'simplify' };
  }
  if (lower.includes('ritim')) return { type: 'send_rhythms' };
  if (lower.includes('sağlık') || lower.includes('saglik') || lower.includes('sağlık')) {
    return { type: 'send_health' };
  }
  if (lower.includes('finans') || lower.includes('para')) return { type: 'send_finance' };
  if (lower.includes('kitap') || lower.includes('okuma')) return { type: 'send_book' };
  if (lower.includes('shutdown') || lower.includes('gün bitti') || lower.includes('gun bitti')) {
    return { type: 'send_shutdown' };
  }
  if (lower.includes('plan') || lower.includes('bugün ne yapayım') || lower.includes('ne yapayim')) {
    return { type: 'send_plan' };
  }

  // Contextual energy/agency keywords
  if (lower.includes('çok yoğun') || lower.includes('cok yogun') || lower.includes('ajans yoğun')) {
    return { type: 'set_agency', agencyLoad: 'high' };
  }
  if (lower.includes('enerjim düşük') || lower.includes('enerji dusuk')) {
    return { type: 'set_energy', energy: 'low' };
  }
  if (lower.includes('dışarıdayım') || lower.includes('disaridayim')) {
    return { type: 'simplify' };
  }

  return { type: 'unknown', raw };
}
