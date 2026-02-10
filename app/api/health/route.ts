import { NextResponse } from 'next/server';
import client from '@/lib/sanity.client';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      sanity: 'unknown',
      environment: 'unknown',
    },
  };

  // Check Sanity connection
  try {
    await client.fetch('*[_type == "siteSettings"][0]._id');
    checks.checks.sanity = 'connected';
  } catch {
    checks.checks.sanity = 'disconnected';
    checks.status = 'degraded';
  }

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length === 0) {
    checks.checks.environment = 'configured';
  } else {
    checks.checks.environment = `missing: ${missingEnvVars.join(', ')}`;
    checks.status = 'degraded';
  }

  return NextResponse.json(checks, {
    status: checks.status === 'healthy' ? 200 : 503,
  });
}