import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';

export async function GET() {
  try {
    // Updated query to aggregate affiliate links into affiliate_options array
    // This query can be used directly with the neon/serverless sql tagged template
    const rows = await sql`
      SELECT 
        r.*,
        CASE
          WHEN COUNT(a.id) = 0 THEN '[]'::json
          ELSE json_agg(
            CASE
              WHEN a.id IS NULL THEN NULL
              ELSE json_build_object(
                'affiliate_url', a.affiliate_url,
                'price', a.price,
                'weight', a.weight,
                'unit', a.unit
              )
            END
          ) FILTER (WHERE a.id IS NOT NULL)
        END as affiliate_options
      FROM expert_food_ratings r
      LEFT JOIN affiliate_links a ON r.id = a.cheese_rating_id
      GROUP BY r.id
      ORDER BY r.overall_rating DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
} 