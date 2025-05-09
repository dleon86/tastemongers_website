import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' }, 
        { status: 400 }
      );
    }

    // Insert subscriber using neon/serverless
    // The sql function is a tagged template literal
    const result = await sql`
      INSERT INTO newsletter_subscribers (email, subscribed_at, is_subscribed) 
      VALUES (${email}, NOW(), true) 
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