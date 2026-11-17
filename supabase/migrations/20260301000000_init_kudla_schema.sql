
-- ==========================================================
-- KUDLA LABS - INITIAL DATABASE MIGRATION
-- Modules: Learn, Path, Career, Marketplace
-- ==========================================================

-- 1. STUDENT PROFILES TABLE

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    education_level TEXT,
    field_of_study TEXT,
    target_career TEXT,
    preferred_language TEXT DEFAULT 'English',
    skills JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. PROFILE SECURITY POLICIES
-- Remove existing policies with these exact names if rerunning.

DROP POLICY IF EXISTS "Users can view own profile"
ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);


DROP POLICY IF EXISTS "Users can update own profile"
ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


DROP POLICY IF EXISTS "Users can insert own profile"
ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);


-- 4. AUTOMATIC PROFILE CREATION ON SIGNUP

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- 5. LEARNING SESSIONS TABLE

CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module TEXT NOT NULL
        CHECK (module IN ('learn', 'path', 'career', 'marketplace')),
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_created
ON public.learning_sessions (user_id, created_at DESC);


-- 6. LEARNING SESSION SECURITY

ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own learning sessions"
ON public.learning_sessions;

CREATE POLICY "Users can manage own learning sessions"
ON public.learning_sessions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 7. EXPLICIT DATABASE PERMISSIONS

GRANT USAGE ON SCHEMA public TO authenticated;

REVOKE ALL ON TABLE public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE
ON TABLE public.profiles TO authenticated;

REVOKE ALL ON TABLE public.learning_sessions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.learning_sessions TO authenticated;

-- ==========================================================
-- KUDLA LABS INITIAL SCHEMA COMPLETE
-- ==========================================================
