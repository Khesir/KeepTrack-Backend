import { Injectable } from '@nestjs/common';
import { put } from '@vercel/blob';

@Injectable()
export class BlobStorageService {
  async upload(prefix: string, file: Express.Multer.File): Promise<{ url: string }> {
    const ext = file.originalname.split('.').pop();
    const filename = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(filename, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype,
    });

    return { url: blob.url };
  }
}
