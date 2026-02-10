import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Secret token for webhook authentication
const REVALIDATION_TOKEN = process.env.SANITY_REVALIDATE_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Also check query param for Sanity webhooks
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get('token');

    if (token !== REVALIDATION_TOKEN && queryToken !== REVALIDATION_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    const { _type, slug } = body;

    console.log(`Revalidation triggered for: ${_type}`, slug ? `(${slug})` : '');

    // Revalidate based on content type
    switch (_type) {
      case 'siteSettings':
        // Revalidate entire site for settings changes
        revalidatePath('/', 'layout');
        break;

      case 'event':
        revalidatePath('/events');
        if (slug?.current) {
          revalidatePath(`/events/${slug.current}`);
        }
        revalidatePath('/'); // Home page may show events
        break;

      case 'blogPost':
        revalidatePath('/blog');
        if (slug?.current) {
          revalidatePath(`/blog/${slug.current}`);
        }
        revalidatePath('/'); // Home page may show blog posts
        break;

      case 'teamMember':
        revalidatePath('/team');
        revalidatePath('/'); // Home page may show team
        break;

      case 'achievement':
        revalidatePath('/achievements');
        revalidatePath('/'); // Home page may show achievements
        break;

      case 'navItem':
      case 'socialLink':
        // These affect navigation, revalidate layout
        revalidatePath('/', 'layout');
        break;

      default:
        // For unknown types, revalidate home page
        revalidatePath('/');
    }

    // Also revalidate by tags if needed
    try {
      if (_type) {
        revalidateTag(_type);
      }
    } catch {
      console.log('Tag revalidation not available');
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// GET endpoint for manual revalidation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const path = searchParams.get('path');

  if (token !== REVALIDATION_TOKEN) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  if (!path) {
    return NextResponse.json(
      { error: 'Path is required' },
      { status: 400 }
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}