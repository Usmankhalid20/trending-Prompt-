import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { decrypt } from '@/lib/auth';

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await isAuthenticated(req);
  if (!authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await runMiddleware(req, res, upload.single('file'));

    const file = (req as MulterRequest).file;
    if (!file?.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
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
      return res.status(500).json({ error: 'Upload failed' });
    }

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Upload API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
