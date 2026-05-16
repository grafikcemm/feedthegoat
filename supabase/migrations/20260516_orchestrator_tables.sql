-- DailyOrchestrator: günlük durum tablosu
create table if not exists assistant_daily_state (
  id           uuid primary key default gen_random_uuid(),
  date         text not null unique,        -- 'yyyy-mm-dd'
  agency_load  text not null default 'normal', -- 'low' | 'normal' | 'high'
  energy       text not null default 'medium', -- 'low' | 'medium' | 'high'
  mode         text not null default 'denge',  -- 'koruma' | 'denge' | 'atak'
  today_plan_json jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- DailyOrchestrator: Telegram hatırlatma takip tablosu
create table if not exists assistant_reminders (
  id                  uuid primary key default gen_random_uuid(),
  date                text not null,                  -- 'yyyy-mm-dd'
  reminder_type       text not null,                  -- 'morning_checkin' | 'midday_status' | 'evening_rhythm' | 'night_shutdown'
  sent_at             timestamptz default now(),
  responded_at        timestamptz,
  status              text not null default 'sent',   -- 'sent' | 'responded' | 'skipped'
  telegram_message_id bigint,
  unique (date, reminder_type)
);

-- RLS: servis rolü tam yetkili
alter table assistant_daily_state enable row level security;
alter table assistant_reminders    enable row level security;

create policy "service_full_access_daily_state"
  on assistant_daily_state for all
  using (true) with check (true);

create policy "service_full_access_reminders"
  on assistant_reminders for all
  using (true) with check (true);
