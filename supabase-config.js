// Supabase configuration
export const SUPABASE_URL = 'https://apcdrhuunpkidkweydmu.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2RyaHV1bnBraWRrd2V5ZG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTc1NDcsImV4cCI6MjA2ODg3MzU0N30.YO5YxKiTnFFV0Ju1n-dyx2b5h-nbwQ736hLDfXQUE4k';

// Initialize Supabase client
let supabase;

// Load Supabase from CDN if not available
if (typeof window !== 'undefined') {
    // Load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = function() {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
            
            // Test the connection
            supabase.from('waitlist_signups').select('count', { count: 'exact', head: true })
                .then(({ error }) => {
                    if (error) {
                        console.warn('Supabase connection test failed:', error);
                    } else {
                        console.log('Supabase connection test successful');
                    }
                });
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            // Fallback for development
            supabase = { 
                from: () => ({ 
                    insert: () => Promise.resolve({ error: null }) 
                }) 
            };
        }
    };
    script.onerror = function() {
        console.error('Supabase CDN failed to load, using fallback');
        supabase = { 
            from: () => ({ 
                insert: () => Promise.resolve({ error: null }) 
            }) 
        };
    };
    document.head.appendChild(script);
} else {
    // Server-side fallback
    supabase = { 
        from: () => ({ 
            insert: () => Promise.resolve({ error: null }) 
        }) 
    };
}

// Export supabase client
export { supabase }; 