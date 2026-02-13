// instrumentation.ts
// This file runs when the Next.js server starts

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Only run on server startup in development
        if (process.env.NODE_ENV === 'development') {
            const port = process.env.PORT || 3000;
            const host = process.env.HOST || 'localhost';

            // Wait a bit for the server to fully start
            setTimeout(() => {
                console.log('\n');
                console.log('📍 \x1b[1m\x1b[32mLocal Development URLs:\x1b[0m');
                console.log('   \x1b[36m➜\x1b[0m  Website:       \x1b[36m\x1b[4mhttp://' + host + ':' + port + '\x1b[0m');
                console.log('   \x1b[35m➜\x1b[0m  Sanity Studio: \x1b[35m\x1b[4mhttp://' + host + ':' + port + '/studio\x1b[0m');
                console.log('\n');
            }, 2000);
        }
    }
}
