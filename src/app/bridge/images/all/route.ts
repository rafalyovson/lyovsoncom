import { NextRequest, NextResponse } from 'next/server';
import { imageSelectAll } from '@/data/actions/db-actions/image';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group') || undefined;
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 20;

    // Fetch images from the database using the `imageSelectAll` function
    const resData = {
      group,
      page: Number(page),
      limit: Number(limit),
    };
    const result = await imageSelectAll(resData);

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
