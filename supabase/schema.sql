-- =========================================================
-- DIGITAL HEROES - FULL SUPABASE POSTGRESQL SCHEMA & RLS
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly', 'free_tier')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'demo_active', 'inactive')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBSCRIPTION EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SCORES TABLE (Stableford 1-45, Rolling 5)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

-- 5. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Health & Wellness',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_raised NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CHARITY SELECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.charity_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE RESTRICT,
  contribution_percentage INTEGER NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CHARITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.charity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DRAWS TABLE
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month VARCHAR(7) NOT NULL UNIQUE, -- e.g. '2026-09'
  draw_type TEXT NOT NULL DEFAULT 'random' CHECK (draw_type IN ('random', 'algorithmic_frequency')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published')),
  configuration_snapshot JSONB,
  winning_numbers INT[] DEFAULT '{}',
  total_subscribers_count INT DEFAULT 0,
  total_pool_amount NUMERIC(12,2) DEFAULT 0.00,
  jackpot_rollover_amount NUMERIC(12,2) DEFAULT 0.00,
  executed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DRAW CONFIGURATIONS TABLE
CREATE TABLE IF NOT EXISTS public.draw_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE UNIQUE,
  draw_type TEXT NOT NULL,
  eligibility_cutoff TIMESTAMPTZ NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DRAW ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_data INT[] NOT NULL,
  match_count INT DEFAULT 0,
  eligibility_status TEXT NOT NULL DEFAULT 'eligible' CHECK (eligibility_status IN ('eligible', 'ineligible')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_draw UNIQUE (draw_id, user_id)
);

-- 11. DRAW RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.draw_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE UNIQUE,
  winning_numbers INT[] NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. PRIZE POOLS TABLE
CREATE TABLE IF NOT EXISTS public.prize_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier IN (5, 4, 3)),
  percentage NUMERIC(5,2) NOT NULL,
  base_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  rollover_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  final_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  winner_count INTEGER DEFAULT 0,
  payout_per_winner NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_draw_tier UNIQUE (draw_id, tier)
);

-- 13. WINNER SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.winner_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier IN (5, 4, 3)),
  prize_amount NUMERIC(12,2) NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected', 'payout_pending', 'paid')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_submission_id UUID NOT NULL REFERENCES public.winner_submissions(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  paid_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.scores(user_id, score_date DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_entries_draw ON public.draw_entries(draw_id);
CREATE INDEX IF NOT EXISTS idx_winner_subs_user ON public.winner_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_winner_subs_draw ON public.winner_submissions(draw_id);

-- =========================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- =========================================================

-- Function & Trigger: Automatic Rolling 5 Scores Constraint
CREATE OR REPLACE FUNCTION public.enforce_rolling_5_scores()
RETURNS TRIGGER AS $$
DECLARE
  score_cnt INT;
BEGIN
  SELECT COUNT(*) INTO score_cnt FROM public.scores WHERE user_id = NEW.user_id;
  IF score_cnt >= 5 THEN
    DELETE FROM public.scores 
    WHERE id IN (
      SELECT id FROM public.scores 
      WHERE user_id = NEW.user_id 
      ORDER BY score_date ASC, created_at ASC 
      LIMIT (score_cnt - 4)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_rolling_scores ON public.scores;
CREATE TRIGGER trigger_rolling_scores
BEFORE INSERT ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.enforce_rolling_5_scores();

-- Function & Trigger: Auto profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'subscriber')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create default trial/demo subscription
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free_tier', 'inactive')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function: Is Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Subscriptions Policies
CREATE POLICY "User read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin full subscriptions" ON public.subscriptions FOR ALL USING (public.is_admin());

-- Scores Policies
CREATE POLICY "User read own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User update own scores" ON public.scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admin full scores" ON public.scores FOR ALL USING (public.is_admin());

-- Charities & Events Policies
CREATE POLICY "Public read charities" ON public.charities FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage charities" ON public.charities FOR ALL USING (public.is_admin());

CREATE POLICY "Public read charity events" ON public.charity_events FOR SELECT USING (true);
CREATE POLICY "Admin manage charity events" ON public.charity_events FOR ALL USING (public.is_admin());

-- Charity Selections Policies
CREATE POLICY "User read own selection" ON public.charity_selections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User write own selection" ON public.charity_selections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin read all selections" ON public.charity_selections FOR SELECT USING (public.is_admin());

-- Draws, Configurations, Results, Prize Pools Policies
CREATE POLICY "Public read published draws" ON public.draws FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admin manage draws" ON public.draws FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage draw configs" ON public.draw_configurations FOR ALL USING (public.is_admin());

CREATE POLICY "Public read results" ON public.draw_results FOR SELECT USING (true);
CREATE POLICY "Admin manage results" ON public.draw_results FOR ALL USING (public.is_admin());

CREATE POLICY "Public read prize pools" ON public.prize_pools FOR SELECT USING (true);
CREATE POLICY "Admin manage prize pools" ON public.prize_pools FOR ALL USING (public.is_admin());

-- Draw Entries Policies
CREATE POLICY "User read own entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manage entries" ON public.draw_entries FOR ALL USING (public.is_admin());

-- Winner Submissions Policies
CREATE POLICY "User read own submissions" ON public.winner_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User insert/update own submission proof" ON public.winner_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin manage submissions" ON public.winner_submissions FOR ALL USING (public.is_admin());

-- Payouts & Audit Logs Policies
CREATE POLICY "User read own payouts" ON public.payouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manage payouts" ON public.payouts FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage audit logs" ON public.audit_logs FOR ALL USING (public.is_admin());

-- STORAGE BUCKETS POLICIES (Run via Supabase Dashboard / SQL Script)
-- Note: Create storage buckets 'charity-images' (public) and 'winner-proofs' (authenticated)
