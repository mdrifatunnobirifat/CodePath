-- ====================================================================
-- CodePath Schema for Existing Supabase Projects (Zero Collision)
-- All tables, policies and functions are namespaced with 'codepath_'
-- ====================================================================

-- 1. CodePath Profiles Table
CREATE TABLE IF NOT EXISTS public.codepath_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  selected_language TEXT DEFAULT 'JavaScript',
  streak_count INTEGER DEFAULT 1,
  daily_goal INTEGER DEFAULT 3,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CodePath Progress Table (Problems solved & lessons completed)
CREATE TABLE IF NOT EXISTS public.codepath_progress (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  solved_problems TEXT[] DEFAULT '{}',
  completed_lessons TEXT[] DEFAULT '{}',
  completed_quizzes JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CodePath Resumes Table (Tech CV Builder drafts & formats)
CREATE TABLE IF NOT EXISTS public.codepath_resumes (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  format TEXT DEFAULT 'ats-modern',
  cv_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.codepath_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codepath_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codepath_resumes ENABLE ROW LEVEL SECURITY;

-- 5. Isolated Security Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_profiles_view') THEN
    CREATE POLICY "codepath_profiles_view" ON public.codepath_profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_profiles_insert') THEN
    CREATE POLICY "codepath_profiles_insert" ON public.codepath_profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_profiles_update') THEN
    CREATE POLICY "codepath_profiles_update" ON public.codepath_profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_progress_view') THEN
    CREATE POLICY "codepath_progress_view" ON public.codepath_progress FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_progress_all') THEN
    CREATE POLICY "codepath_progress_all" ON public.codepath_progress FOR ALL USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_resumes_view') THEN
    CREATE POLICY "codepath_resumes_view" ON public.codepath_resumes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'codepath_resumes_all') THEN
    CREATE POLICY "codepath_resumes_all" ON public.codepath_resumes FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6. Isolated Trigger to create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_codepath_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.codepath_profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || encode(new.email::bytea, 'hex')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_codepath_user_created ON auth.users;
CREATE TRIGGER on_codepath_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_codepath_user();
