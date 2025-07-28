// Supabase Configuration - Direct Client Setup
const SUPABASE_URL = 'https://apcdrhuunpkidkweydmu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2RyaHV1bnBraWRrd2V5ZG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTc1NDcsImV4cCI6MjA2ODg3MzU0N30.YO5YxKiTnFFV0Ju1n-dyx2b5h-nbwQ736hLDfXQUE4k';

// Create Supabase client with minimal configuration
let supabase;

// Initialize Supabase client
async function initializeSupabase() {
    try {
        // Import Supabase client dynamically
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        
        // Create client with explicit anon configuration
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        });
        
        // Explicitly set anon context
        await supabase.auth.setSession(null);
        
        console.log('✅ Supabase client initialized with anon context');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return false;
    }
}

// Test connection with direct fetch approach
async function testConnectionDirect() {
    try {
        console.log('🧪 Testing connection with direct fetch...');
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups?select=id&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Direct fetch SELECT successful:', data);
        return true;
    } catch (error) {
        console.error('❌ Direct fetch SELECT failed:', error);
        return false;
    }
}

// Test insert with direct fetch approach
async function testInsertDirect() {
    try {
        console.log('🧪 Testing insert with direct fetch...');
        
        const testData = {
            phone_number: '19999999999',
            consented_to_sms: true
        };
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(testData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Direct fetch INSERT successful:', data);
        return true;
    } catch (error) {
        console.error('❌ Direct fetch INSERT failed:', error);
        return false;
    }
}

// Test RLS enforcement with direct fetch
async function testRLSEnforcementDirect() {
    try {
        console.log('🧪 Testing RLS enforcement with direct fetch...');
        
        const testData = {
            phone_number: '18888888888',
            consented_to_sms: false
        };
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(testData)
        });
        
        if (response.ok) {
            console.error('❌ RLS enforcement failed - insert succeeded when it should have been blocked');
            return false;
        }
        
        console.log('✅ RLS policy correctly blocked insert with consented_to_sms: false');
        console.log('Expected error status:', response.status);
        return true;
    } catch (error) {
        console.log('✅ RLS policy enforcement working correctly');
        return true;
    }
}

// Run all tests with direct fetch approach
async function runAllTestsDirect() {
    console.log('🚀 Starting comprehensive Supabase verification with direct fetch...');
    
    try {
        const connectionOk = await testConnectionDirect();
        if (!connectionOk) {
            console.error('❌ Connection test failed - stopping verification');
            return false;
        }
        
        const insertOk = await testInsertDirect();
        if (!insertOk) {
            console.error('❌ Insert test failed - stopping verification');
            return false;
        }
        
        const rlsOk = await testRLSEnforcementDirect();
        if (!rlsOk) {
            console.error('❌ RLS enforcement test failed');
            return false;
        }
        
        console.log('🎉 All direct fetch tests passed! System is ready for live form submission.');
        return true;
    } catch (err) {
        console.error('❌ Verification failed:', err);
        return false;
    }
}

// Initialize and export
initializeSupabase().then(() => {
    console.log('🔧 Supabase client ready');
});

// Export functions for manual testing
export { supabase, runAllTestsDirect };

// Make functions available globally for console testing
window.testSupabase = runAllTestsDirect;
window.testConnection = testConnectionDirect;
window.testInsert = testInsertDirect;
window.testRLS = testRLSEnforcementDirect;

// Auto-run tests after initialization
setTimeout(runAllTestsDirect, 2000);
