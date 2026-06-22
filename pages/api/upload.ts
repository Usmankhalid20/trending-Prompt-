import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { decrypt } from '@/lib/auth';
import { sendApiError } from '@/lib/api-error';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type MulterRequest = NextApiRequest & {
  file?: Express.Multer.File;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: any, res: any, next: (result?: unknown) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }
      resolve(result);
    });
  });
}

async function isAuthenticated(req: NextApiRequest) {
  const token = req.cookies.session;
  if (!token) return false;

  try {
    await decrypt(token);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendApiError(res, {
      status: 405,
      code: 'METHOD_NOT_ALLOWED',
      userMessage: 'Only image uploads are allowed here.',
      developerMessage: `Unsupported upload method: ${req.method}.`,
      context: 'Upload method not allowed',
    });
  }

  const authenticated = await isAuthenticated(req);
  if (!authenticated) {
    return sendApiError(res, {
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'Please sign in as an admin before uploading images.',
      developerMessage: 'Upload attempted without a valid session cookie.',
      context: 'Upload unauthorized',
    });
  }

  try {
    await runMiddleware(req, res, upload.single('file'));

    const file = (req as MulterRequest).file;
    if (!file?.buffer) {
      return sendApiError(res, {
        status: 400,
        code: 'NO_FILE_UPLOADED',
        userMessage: 'Please choose an image file to upload.',
        developerMessage: 'Upload request completed without a file buffer.',
        context: 'Upload missing file',
      });
    }

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

      stream.end(file.buffer);
    });

    if (!url) {
      return sendApiError(res, {
        status: 500,
        code: 'UPLOAD_FAILED',
        userMessage: 'We could not upload that image. Please try another file.',
        developerMessage: 'Cloudinary upload returned an empty URL.',
        context: 'Upload returned empty URL',
      });
    }

    return res.status(200).json({ url });
  } catch (error) {
    return sendApiError(res, {
      status: 500,
      code: 'UPLOAD_API_FAILED',
      userMessage: 'We could not upload that image right now. Please try again.',
      developerMessage: 'Upload route failed while parsing or sending the file to Cloudinary.',
      error,
      context: 'Upload API error',
    });
  }
}
