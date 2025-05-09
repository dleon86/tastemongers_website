import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

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

    // Insert subscriber
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await pool.query(
      'INSERT INTO newsletter_subscribers (email, subscribed_at, is_subscribed) VALUES ($1, NOW(), true) RETURNING id',
      [email]
    );

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