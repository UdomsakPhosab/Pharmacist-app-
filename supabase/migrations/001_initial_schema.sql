-- Pharmacist App Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DISEASES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS diseases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icd_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDICINES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  dosage_form VARCHAR(100),
  strength VARCHAR(100),
  description TEXT,
  side_effects TEXT,
  contraindications TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DISEASE-MEDICINE MAPPING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS disease_medicine_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  recommended_dosage TEXT,
  frequency VARCHAR(100),
  duration VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(disease_id, medicine_id)
);

-- ============================================================
-- PATIENT RECORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patient_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name VARCHAR(255) NOT NULL,
  patient_id_number VARCHAR(50),
  age INTEGER,
  weight DECIMAL(5,2),
  disease_id UUID REFERENCES diseases(id) ON DELETE SET NULL,
  medicine_id UUID REFERENCES medicines(id) ON DELETE SET NULL,
  prescribed_dosage VARCHAR(200),
  frequency VARCHAR(100),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CALCULATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  formula TEXT,
  description TEXT,
  unit VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_diseases_updated_at
  BEFORE UPDATE ON diseases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON patient_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- NOTE: The policies below allow all access for demo purposes.
-- In production, replace with authentication-based policies, e.g.:
--   USING (auth.uid() IS NOT NULL)
-- to restrict access to authenticated users only.
-- ============================================================
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_medicine_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (replace with auth policies for production)
CREATE POLICY "diseases_allow_all_for_anon" ON diseases FOR ALL USING (true);
CREATE POLICY "medicines_allow_all_for_anon" ON medicines FOR ALL USING (true);
CREATE POLICY "disease_medicine_mapping_allow_all_for_anon" ON disease_medicine_mapping FOR ALL USING (true);
CREATE POLICY "patient_records_allow_all_for_anon" ON patient_records FOR ALL USING (true);
CREATE POLICY "calculations_allow_all_for_anon" ON calculations FOR ALL USING (true);

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO diseases (name, description, icd_code) VALUES
  ('ความดันโลหิตสูง', 'ภาวะที่ความดันโลหิตสูงกว่าปกติ (≥140/90 mmHg)', 'I10'),
  ('เบาหวานชนิดที่ 2', 'โรคเบาหวานที่เกิดจากภาวะดื้อต่ออินซูลิน', 'E11'),
  ('ไขมันในเลือดสูง', 'ภาวะที่มีไขมันในเลือดสูงผิดปกติ', 'E78.5'),
  ('ปวดหัวไมเกรน', 'อาการปวดหัวข้างเดียวแบบตุ้บๆ', 'G43'),
  ('โรคหวัด', 'การติดเชื้อทางเดินหายใจส่วนบน', 'J06.9')
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, generic_name, dosage_form, strength, description) VALUES
  ('Amlodipine', 'Amlodipine besylate', 'Tablet', '5 mg, 10 mg', 'Calcium channel blocker for hypertension'),
  ('Metformin', 'Metformin HCl', 'Tablet', '500 mg, 850 mg, 1000 mg', 'First-line medication for type 2 diabetes'),
  ('Atorvastatin', 'Atorvastatin calcium', 'Tablet', '10 mg, 20 mg, 40 mg', 'Statin for dyslipidemia'),
  ('Paracetamol', 'Acetaminophen', 'Tablet', '500 mg', 'Analgesic and antipyretic'),
  ('Lisinopril', 'Lisinopril', 'Tablet', '5 mg, 10 mg, 20 mg', 'ACE inhibitor for hypertension')
ON CONFLICT DO NOTHING;

INSERT INTO calculations (name, category, formula, description, unit) VALUES
  ('BMI', 'Anthropometry', 'weight(kg) / height(m)^2', 'Body Mass Index', 'kg/m²'),
  ('Creatinine Clearance (Cockcroft-Gault)', 'Renal Function', '((140 - age) × weight) / (72 × serum_creatinine) × (0.85 if female)', 'Estimated creatinine clearance', 'mL/min'),
  ('Total Daily Dose', 'Dosage', 'dose_per_administration × frequency_per_day', 'Total medication dose per day', 'mg/day'),
  ('Ideal Body Weight (Male)', 'Anthropometry', '50 + 2.3 × (height_inches - 60)', 'Ideal body weight for males', 'kg'),
  ('Ideal Body Weight (Female)', 'Anthropometry', '45.5 + 2.3 × (height_inches - 60)', 'Ideal body weight for females', 'kg')
ON CONFLICT DO NOTHING;
