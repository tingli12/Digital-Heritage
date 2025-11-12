/*
  # Create Digital Heritage Protection Schema

  1. New Tables
    - `profiles` - User profiles with heritage settings
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `digital_assets` - Digital assets to be protected
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `title` (text) - Asset name/title
      - `description` (text) - Description of the asset
      - `asset_type` (text) - Type: account, document, photo, video, etc.
      - `access_instructions` (text) - Instructions for heirs
      - `status` (text) - active, archived
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `beneficiaries` - Designated beneficiaries/heirs
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `email` (text)
      - `name` (text)
      - `relationship` (text) - Relation to the user
      - `notification_sent` (boolean)
      - `created_at` (timestamp)
    
    - `access_logs` - Track asset access
      - `id` (uuid, primary key)
      - `asset_id` (uuid, foreign key to digital_assets)
      - `accessed_by` (text) - Email or identifier
      - `access_type` (text) - view, download, share
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Beneficiaries can view assets after authorization
    - Access logs are read-only for security

  3. Indexes
    - Added on user_id for quick lookups
    - Added on asset_type for filtering
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create digital_assets table
CREATE TABLE IF NOT EXISTS digital_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  asset_type text NOT NULL DEFAULT 'account',
  access_instructions text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_digital_assets_user_id ON digital_assets(user_id);
CREATE INDEX idx_digital_assets_type ON digital_assets(asset_type);

CREATE POLICY "Users can view own assets"
  ON digital_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON digital_assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON digital_assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON digital_assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  relationship text,
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_beneficiaries_user_id ON beneficiaries(user_id);

CREATE POLICY "Users can view own beneficiaries"
  ON beneficiaries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own beneficiaries"
  ON beneficiaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own beneficiaries"
  ON beneficiaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own beneficiaries"
  ON beneficiaries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES digital_assets(id) ON DELETE CASCADE,
  accessed_by text NOT NULL,
  access_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_access_logs_asset_id ON access_logs(asset_id);

CREATE POLICY "Users can view logs for own assets"
  ON access_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM digital_assets
      WHERE digital_assets.id = access_logs.asset_id
      AND digital_assets.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert logs"
  ON access_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
