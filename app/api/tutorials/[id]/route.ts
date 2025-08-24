import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { updateTutorialSchema } from '@/@types/tutorial';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  notFoundResponse, 
  handlePrismaError 
} from '@/utils/api-response';

// GET /api/tutorials/[id] - Get a single tutorial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return errorResponse('Tutorial ID is required', 400);
    }

    const tutorial = await prisma.tutorial.findUnique({
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
      return notFoundResponse('Tutorial not found');
    }

    return successResponse(tutorial, 'Tutorial retrieved successfully');

  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return errorResponse('Internal server error', 500);
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
      return errorResponse('Tutorial ID is required', 400);
    }

    // Validate request body
    const validatedData = updateTutorialSchema.parse(body);

    // Check if tutorial exists
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return notFoundResponse('Tutorial not found');
    }

    // If authorId is being updated, check if the new author exists
    if (validatedData.authorId && validatedData.authorId !== existingTutorial.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: validatedData.authorId }
      });

      if (!author) {
        return notFoundResponse('Author not found');
      }
    }

    // Update tutorial
    const updatedTutorial = await prisma.tutorial.update({
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

    return successResponse(updatedTutorial, 'Tutorial updated successfully');

  } catch (error) {
    console.error('Error updating tutorial:', error);
    
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error.errors, 'Invalid request data');
    }

    return handlePrismaError(error);
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
      return errorResponse('Tutorial ID is required', 400);
    }

    // Check if tutorial exists
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return notFoundResponse('Tutorial not found');
    }

    // Delete tutorial
    await prisma.tutorial.delete({
      where: { id }
    });

    return successResponse(null, 'Tutorial deleted successfully');

  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return handlePrismaError(error);
  }
} 