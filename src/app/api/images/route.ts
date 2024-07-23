import { imageSelectAll } from '@/lib/actions/db-actions/image';
import { NextResponse } from 'next/server';

export const GET = async (_req: Request) => {
  try {
    const allImages = await imageSelectAll('test');
    return NextResponse.json(allImages);
  } catch (error) {
    return error;
  }
};
