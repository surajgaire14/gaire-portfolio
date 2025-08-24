import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

// GET /api/authors - List all authors
export async function GET(request: NextRequest) {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return successResponse(authors, 'Authors retrieved successfully');

  } catch (error) {
    console.error('Error fetching authors:', error);
    return errorResponse('Internal server error', 500);
  }
} 