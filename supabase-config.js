// Supabase configuration using ESM imports
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://apcdrhuunpkidkweydmu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2RyaHV1bnBraWRrd2V5ZG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTc1NDcsImV4cCI6MjA2ODg3MzU0N30.YO5YxKiTnFFV0Ju1n-dyx2b5h-nbwQ736hLDfXQUE4k';

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection on initialization
console.log('🔧 Initializing Supabase client...');

// Test the connection with a simple query
supabase.from('waitlist_signups').select('id').limit(1)
    .then(({ data, error }) => {
        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            console.error('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
        } else {
            console.log('✅ Supabase connected and ready');
            console.log('Connection test successful - table accessible');
        }
    })
    .catch(err => {
        console.error('❌ Supabase init failed:', err);
        console.error('This may indicate a network issue or invalid credentials');
    });

// Export configuration constants for debugging
export const SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY.substring(0, 20) + '...' // Truncated for security
};

console.log('📋 Supabase config loaded:', SUPABASE_CONFIG); 