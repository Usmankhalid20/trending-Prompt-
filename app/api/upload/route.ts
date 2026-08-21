import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiErrorResponse({
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'Please sign in before uploading images.',
      developerMessage: 'Missing session cookie.',
      context: 'Upload unauthorized',
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return apiErrorResponse({
        status: 400,
        code: 'NO_FILE_UPLOADED',
        userMessage: 'Please select an image file to upload.',
        developerMessage: 'No file field in formData.',
        context: 'Upload missing file',
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ai-trending-prompts' },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result?.secure_url || '');
        }
      );

      stream.end(buffer);
    });

    if (!url) {
      return apiErrorResponse({
        status: 500,
        code: 'UPLOAD_FAILED',
        userMessage: 'Image upload failed. Please try again.',
        developerMessage: 'Cloudinary returned empty secure_url.',
        context: 'Upload failed',
      });
    }

    return NextResponse.json({ url });
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'UPLOAD_API_FAILED',
      userMessage: 'Image upload failed. Please check file format.',
      developerMessage: 'Failed during FormData parse or Cloudinary upload.',
      error,
      context: 'Upload error',
    });
  }
}
