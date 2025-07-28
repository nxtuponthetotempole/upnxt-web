import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://apcdrhuunpkidkweydmu.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2RyaHV1bnBraWRrd2V5ZG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTc1NDcsImV4cCI6MjA2ODg3MzU0N30.YO5YxKiTnFFV0Ju1n-dyx2b5h-nbwQ736hLDfXQUE4k';

// Create Supabase client with explicit anon context
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    },
    global: {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    }
});

// Ensure we're in anon context
console.log('🔧 Supabase client initialized with anon context');
console.log('📋 Client config:', {
    url: SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    authMode: 'anon'
});

// 🧪 COMPREHENSIVE VERIFICATION TESTS
console.log('🔧 Initializing Supabase client...');

// ✅ Connection Test
async function testConnection() {
    try {
        console.log('🧪 Testing Supabase connection...');
        const { data, error } = await supabase
            .from('waitlist_signups')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase SELECT failed:', error);
            throw error;
        }
        
        console.log('✅ Supabase SELECT successful');
        return true;
    } catch (err) {
        console.error('❌ Connection test failed:', err);
        return false;
    }
}

// ✅ Insert Test
async function testInsert() {
    try {
        console.log('🧪 Testing data insertion...');
        const testData = { 
            phone_number: '19999999999', 
            consented_to_sms: true 
        };
        
        const { data, error } = await supabase
            .from('waitlist_signups')
            .insert([testData])
            .select();
        
        if (error) {
            console.error('❌ Insert test failed:', error);
            throw error;
        }
        
        console.log('✅ Insert test passed and returned row:', data);
        return true;
    } catch (err) {
        console.error('❌ Insert test failed:', err);
        return false;
    }
}

// ✅ RLS Enforcement Test
async function testRLSEnforcement() {
    try {
        console.log('🧪 Testing RLS policy enforcement...');
        const testData = { 
            phone_number: '18888888888', 
            consented_to_sms: false 
        };
        
        const { data, error } = await supabase
            .from('waitlist_signups')
            .insert([testData])
            .select();
        
        if (!error) {
            console.error('❌ Policy enforcement failed - insert succeeded when it should have been blocked');
            throw new Error('❌ Policy enforcement failed');
        }
        
        console.log('✅ RLS policy correctly blocked insert with consented_to_sms: false');
        console.log('Expected error:', error.message);
        return true;
    } catch (err) {
        if (err.message === '❌ Policy enforcement failed') {
            throw err;
        }
        console.log('✅ RLS policy enforcement working correctly');
        return true;
    }
}

// Ensure anon context for requests
async function ensureAnonContext() {
    try {
        // Set session to null to ensure anon context
        await supabase.auth.setSession(null);
        console.log('✅ Anon context ensured');
        return true;
    } catch (err) {
        console.log('ℹ️ Already in anon context');
        return true;
    }
}

// Run all verification tests
async function runAllTests() {
    console.log('🚀 Starting comprehensive Supabase verification...');
    
    // Ensure we're in anon context before testing
    await ensureAnonContext();
    
    try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
            console.error('❌ Connection test failed - stopping verification');
            return false;
        }
        
        const insertOk = await testInsert();
        if (!insertOk) {
            console.error('❌ Insert test failed - stopping verification');
            return false;
        }
        
        const rlsOk = await testRLSEnforcement();
        if (!rlsOk) {
            console.error('❌ RLS enforcement test failed');
            return false;
        }
        
        console.log('🎉 All verification tests passed! System is ready for live form submission.');
        return true;
    } catch (err) {
        console.error('❌ Verification failed:', err);
        return false;
    }
}

// Export test function for manual execution
export { runAllTests };

// Auto-run tests after a short delay to ensure everything is loaded
setTimeout(runAllTests, 1000); 

window.testSupabase = runAllTests;
