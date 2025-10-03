import { TableName } from '../types';

const sqlDefinitions: Record<TableName, string> = {
    doctors: `
-- Table: doctors
CREATE TABLE public.doctors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    specialty text,
    image_public_id text,
    schedule text,
    status text DEFAULT 'Praktek',
    status_info text,
    notes text,
    display_order integer,
    created_at timestamptz DEFAULT NOW()
);
CREATE INDEX idx_doctors_display_order ON public.doctors(display_order);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (auth.role() = 'authenticated');
`,
    services: `
-- Table: services
CREATE TABLE public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_public_id_1 text,
    image_public_id_2 text,
    image_public_id_3 text,
    created_at timestamptz DEFAULT NOW(),
    slug text GENERATED ALWAYS AS (
        replace(lower(trim(regexp_replace(name, '[^a-zA-Z0-9\\s-]', '', 'g'))), ' ', '-')
    ) STORED UNIQUE
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
`,
    facilities: `
-- Table: facilities
CREATE TABLE public.facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_public_id_1 text,
    image_public_id_2 text,
    image_public_id_3 text,
    created_at timestamptz DEFAULT NOW(),
    slug text GENERATED ALWAYS AS (
        replace(lower(trim(regexp_replace(name, '[^a-zA-Z0-9\\s-]', '', 'g'))), ' ', '-')
    ) STORED UNIQUE
);
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Admins can manage facilities" ON public.facilities FOR ALL USING (auth.role() = 'authenticated');
`,
    articles: `
-- Table: articles
CREATE TABLE public.articles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    author text,
    image_public_id text,
    created_at timestamptz DEFAULT NOW(),
    slug text GENERATED ALWAYS AS (
        replace(lower(trim(regexp_replace(title, '[^a-zA-Z0-9\\s-]', '', 'g'))), ' ', '-')
    ) STORED UNIQUE
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL USING (auth.role() = 'authenticated');
`,
    partners: `
-- Table: partners
CREATE TABLE public.partners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    image_public_id text,
    created_at timestamptz DEFAULT NOW()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (auth.role() = 'authenticated');
`,
    vacancies: `
-- Table: vacancies
CREATE TABLE public.vacancies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text,
    location text,
    deadline timestamptz,
    created_at timestamptz DEFAULT NOW()
);
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view vacancies" ON public.vacancies FOR SELECT USING (true);
CREATE POLICY "Admins can manage vacancies" ON public.vacancies FOR ALL USING (auth.role() = 'authenticated');
`,
    info: `
-- Table: info
CREATE TABLE public.info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image_public_id text,
    created_at timestamptz DEFAULT NOW()
);
ALTER TABLE public.info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view info" ON public.info FOR SELECT USING (true);
CREATE POLICY "Admins can manage info" ON public.info FOR ALL USING (auth.role() = 'authenticated');
`,
    ai_assistant_config: `
-- Table: ai_assistant_config
CREATE TABLE public.ai_assistant_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    base_prompt text,
    created_at timestamptz DEFAULT NOW()
);
ALTER TABLE public.ai_assistant_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view AI config" ON public.ai_assistant_config FOR SELECT USING (true);
CREATE POLICY "Admins can manage AI config" ON public.ai_assistant_config FOR ALL USING (auth.role() = 'authenticated');
`,
    page_notes: `
-- Table: page_notes
CREATE TABLE public.page_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name text NOT NULL UNIQUE,
    content text,
    created_at timestamptz DEFAULT NOW()
);
ALTER TABLE public.page_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view page notes" ON public.page_notes FOR SELECT USING (true);
CREATE POLICY "Admins can manage page notes" ON public.page_notes FOR ALL USING (auth.role() = 'authenticated');
`,
};

export const generateFixSql = (missingTables: TableName[]): string => {
    if (missingTables.length === 0) return '';
    const header = `-- =================================================================\n--         Skrip Perbaikan Database Otomatis\n-- =================================================================\n-- Salin dan jalankan seluruh skrip ini di SQL Editor Supabase Anda\n-- untuk membuat tabel yang hilang dan memperbaiki fungsionalitas.\n-- =================================================================\n\n`;
    const scriptBody = missingTables
        .map(tableName => sqlDefinitions[tableName] || `\n-- Definisi SQL untuk tabel '${tableName}' tidak ditemukan.\n`)
        .join('\n');
    return header + scriptBody;
}