import { NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { updateTutorialSchema } from '@/types/tutorial';
// import { 
//   successResponse, 
//   errorResponse, 
//   validationErrorResponse, 
//   notFoundResponse, 
//   handlePrismaError 
// } from '@/utils/api-response';

// GET /api/tutorials/[id] - Get a single tutorial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    const tutorial = await db.tutorial.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    if (!tutorial) {
      return Response.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    return Response.json(tutorial, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/tutorials/[id] - Update a tutorial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return Response.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    // Validate request body
    const validatedData = updateTutorialSchema.parse(body);

    // Check if tutorial exists
    const existingTutorial = await db.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return Response.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    // If authorId is being updated, check if the new author exists
    if (validatedData.authorId && validatedData.authorId !== existingTutorial.authorId) {
      const author = await db.author.findUnique({
        where: { id: validatedData.authorId }
      });

      if (!author) {
        return Response.json({ error: 'Author not found' }, { status: 404 });
      }
    }

    // Update tutorial
    const updatedTutorial = await db.tutorial.update({
      where: { id },
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return Response.json(updatedTutorial, { status: 200 });

  } catch (error) {
    console.error('Error updating tutorial:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tutorials/[id] - Delete a tutorial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    // Check if tutorial exists
    const existingTutorial = await db.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return Response.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    // Delete tutorial
    await db.tutorial.delete({
      where: { id }
    });

    return Response.json({ message: 'Tutorial deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 