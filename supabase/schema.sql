-- CodePath Production Database Schema for Supabase (PostgreSQL)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  selected_language TEXT DEFAULT 'JavaScript',
  streak_count INTEGER DEFAULT 1,
  daily_goal INTEGER DEFAULT 3,
  goal_track TEXT DEFAULT 'frontend',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. User Progress Table (Solved problems & completed lessons)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  solved_problems TEXT[] DEFAULT '{}',
  completed_lessons TEXT[] DEFAULT '{}',
  completed_quizzes JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Resumes Table (Tech CV Builder drafts and configurations)
CREATE TABLE IF NOT EXISTS public.resumes (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  format TEXT DEFAULT 'ats-modern',
  cv_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- 5. Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 6. Progress Policies
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own progress" 
  ON public.user_progress FOR ALL 
  USING (auth.uid() = user_id);

-- 7. Resumes Policies
CREATE POLICY "Users can view their own CV" 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own CV" 
  ON public.resumes FOR ALL 
  USING (auth.uid() = user_id);

-- 8. Auto-create profile trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

