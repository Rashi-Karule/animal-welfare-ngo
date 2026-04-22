-- 1. Add owner_id to missing_pets (to link pets to the user who reported them)
ALTER TABLE public.missing_pets
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Create the active_adoptions table
CREATE TABLE IF NOT EXISTS public.active_adoptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    breed TEXT,
    age TEXT,
    description TEXT NOT NULL,
    photo_url TEXT,
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Optional, but recommended for security)
-- You can leave RLS disabled if you prefer to keep it simple and are handling security mostly from the frontend admin dashboard,
-- but adding these policies allows public reading and admin writing.

-- Note: In this project, you've been using the anon key for reading and writing data,
-- so we are just creating the table. If you encounter permission errors writing from admin,
-- go to the Supabase dashboard -> Authentication -> Policies -> active_adoptions and allow anon inserts/updates/deletes.

-- ==========================================
-- PHASE 2 FEATURES (Maps & Tracking)
-- ==========================================

-- 4. Add map coordinates to missing_pets
ALTER TABLE public.missing_pets
ADD COLUMN IF NOT EXISTS lat FLOAT,
ADD COLUMN IF NOT EXISTS lng FLOAT;

-- 5. Create adoption_applications table
CREATE TABLE IF NOT EXISTS public.adoption_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    adoption_id UUID REFERENCES public.active_adoptions(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    why_adopt TEXT,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Under Review', 'Approved', 'Rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
