-- Create enum for verdict types
CREATE TYPE public.verdict_type AS ENUM ('pass', 'caution', 'avoid');

-- Create dietary profiles table
CREATE TABLE public.dietary_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  restrictions TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create analysis history table
CREATE TABLE public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_name TEXT,
  ingredients_text TEXT NOT NULL,
  verdict verdict_type NOT NULL,
  what_stood_out TEXT,
  why_matters TEXT,
  whats_uncertain TEXT,
  bottom_line TEXT,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dietary_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for dietary_profiles
CREATE POLICY "Users can view their own dietary profiles"
  ON public.dietary_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dietary profiles"
  ON public.dietary_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dietary profiles"
  ON public.dietary_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dietary profiles"
  ON public.dietary_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for analysis_history
CREATE POLICY "Users can view their own analysis history"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis history"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis history"
  ON public.analysis_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis history"
  ON public.analysis_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for dietary_profiles
CREATE TRIGGER update_dietary_profiles_updated_at
  BEFORE UPDATE ON public.dietary_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();