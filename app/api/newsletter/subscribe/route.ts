import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    // Validate email
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' }, 
        { status: 400 }
      );
    }

    // Optionally validate firstName/lastName (e.g., not required, but can check length)

    // Insert subscriber using neon/serverless
    const result = await sql`
      INSERT INTO newsletter_subscribers (email, first_name, last_name, subscribed_at, is_subscribed) 
      VALUES (${email}, ${firstName || null}, ${lastName || null}, NOW(), true) 
      RETURNING id
    `;

    // TODO: Add integration with HighLevel here

    return NextResponse.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 