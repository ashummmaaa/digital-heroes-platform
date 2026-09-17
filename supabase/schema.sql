-- Digital Heroes Supabase Schema & Row Level Security (RLS) Configuration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'canceled')),
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. GOLF SCORES TABLE (1-45 Stableford points)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- Enable RLS on scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Scores Policies (Strict per-user isolation)
CREATE POLICY "Users can read own scores"
  ON public.scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON public.scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores"
  ON public.scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores"
  ON public.scores FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all scores"
  ON public.scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_raised NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on charities
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- Charities Policies (Public read, admin write)
CREATE POLICY "Public can view active charities"
  ON public.charities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage charities"
  ON public.charities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. MONTHLY DRAWS TABLE
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_month TEXT NOT NULL UNIQUE,
  draw_type TEXT NOT NULL CHECK (draw_type IN ('random', 'algorithmic_frequency')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('simulated', 'published')),
  winning_numbers INTEGER[] NOT NULL,
  total_subscribers_count INTEGER NOT NULL DEFAULT 0,
  total_pool_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  jackpot_rollover_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Enable RLS on draws
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;

-- Draws Policies (Public read published draws, admin manage)
CREATE POLICY "Public can view published draws"
  ON public.draws FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view and manage all draws"
  ON public.draws FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. PRIZE POOLS TABLE
CREATE TABLE IF NOT EXISTS public.prize_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier IN (3, 4, 5)),
  percentage NUMERIC(5, 2) NOT NULL,
  base_amount NUMERIC(12, 2) NOT NULL,
  rollover_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  final_amount NUMERIC(12, 2) NOT NULL,
  winner_count INTEGER NOT NULL DEFAULT 0,
  payout_per_winner NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- Enable RLS on prize_pools
ALTER TABLE public.prize_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prize pools"
  ON public.prize_pools FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prize pools"
  ON public.prize_pools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. WINNER SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.winner_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier IN (3, 4, 5)),
  prize_amount NUMERIC(12, 2) NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected', 'paid')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on winner_submissions
ALTER TABLE public.winner_submissions ENABLE ROW LEVEL SECURITY;

-- Winner Submissions Policies
CREATE POLICY "Users can read own winner submissions"
  ON public.winner_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own winner submissions"
  ON public.winner_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update proof for own winner submissions"
  ON public.winner_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all winner submissions"
  ON public.winner_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read and insert audit logs"
  ON public.audit_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
