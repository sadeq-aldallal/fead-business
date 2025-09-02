const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');

// Get environment variables
const supabaseUrl = 'https://iedicglrxwpeilqimsgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZGljZ2xyeHdwZWlscWltc2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDkzMTEsImV4cCI6MjA3MTYyNTMxMX0.WbDD6BVb-m63o4jJr1RnOWkXuZxwgIHWaz9NBLMG4JQ';

console.log('Connecting to Supabase...');

// Create client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  try {
    console.log('Creating organizations table...');
    
    const { error } = await supabase.rpc('exec', {
      sql: `
        -- Create organizations table
        CREATE TABLE IF NOT EXISTS organizations (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          phone text NOT NULL,
          email text NOT NULL,
          country text NOT NULL,
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- Create businesses table with updated structure
        CREATE TABLE IF NOT EXISTS businesses (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          permissions jsonb DEFAULT '{}',
          token_expire timestamptz,
          instagram_username text,
          instagram_account_id text,
          instagram_status text DEFAULT 'disconnected',
          type text DEFAULT 'service',
          mode text DEFAULT 'test',
          testers jsonb DEFAULT '[]'::jsonb,
          is_deleted boolean DEFAULT false,
          deleted_at timestamptz,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
        ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (error) {
      console.error('Error creating tables:', error);
      return;
    }
    
    console.log('Tables created successfully!');
    
  } catch (err) {
    console.error('Failed to create tables:', err);
  }
}

createTables();