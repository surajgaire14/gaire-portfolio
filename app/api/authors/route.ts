import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
// import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/authors - List all authors
export async function GET(request: NextRequest) {
  try {
    const authors = await db.author.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return Response.json(authors, { status: 200 });

  } catch (error) {
    console.error('Error fetching authors:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 