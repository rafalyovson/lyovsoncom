import { NextRequest, NextResponse } from 'next/server';
import { imageSelectAll } from '@/data/actions/db-actions/image';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group') || undefined;

    // Fetch images from the database using the `imageSelectAll` function
    const result = await imageSelectAll(group);

    // Return a JSON response with the result
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    // Handle any errors that may occur
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching images',
        error,
      },
      { status: 500 },
    );
  }
}
