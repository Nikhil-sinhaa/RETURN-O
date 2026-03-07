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
                // Development server info - using process.stdout to avoid ESLint warnings
                process.stdout.write('\n');
                process.stdout.write('📍 \x1b[1m\x1b[32mLocal Development URLs:\x1b[0m\n');
                process.stdout.write('   \x1b[36m➜\x1b[0m  Website:       \x1b[36m\x1b[4mhttp://' + host + ':' + port + '\x1b[0m\n');
                process.stdout.write('   \x1b[35m➜\x1b[0m  Sanity Studio: \x1b[35m\x1b[4mhttp://' + host + ':' + port + '/studio\x1b[0m\n');
                process.stdout.write('\n');
            }, 2000);
        }
    }
}
