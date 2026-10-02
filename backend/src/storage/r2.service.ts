import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class R2Service {
    private readonly client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const accountId =
            this.configService.get<string>('R2_ACCOUNT_ID');

        const accessKeyId =
            this.configService.get<string>('R2_ACCESS_KEY_ID');

        const secretAccessKey =
            this.configService.get<string>('R2_SECRET_ACCESS_KEY');

        this.bucketName =
            this.configService.get<string>('R2_BUCKET_NAME') ?? '';

        if (!accountId || !accessKeyId || !secretAccessKey) {
            throw new Error('R2 configuration is missing.');
        }

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async upload(
        file: Express.Multer.File,
    ): Promise<string> {
        const extension = this.getExtension(file);

        const baseName = this.slugify(
            file.originalname.replace(/\.[^/.]+$/, ''),
        );

        const fileName = baseName || randomUUID();

        const key = `products/${fileName}-${Date.now()}${extension}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return key;
    }

    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }),
        );
    }

    private getExtension(
        file: Express.Multer.File,
    ): string {
        switch (file.mimetype) {
            case 'image/jpeg':
                return '.jpg';

            case 'image/png':
                return '.png';

            case 'image/webp':
                return '.webp';

            default:
                return extname(file.originalname).toLowerCase();
        }
    }

    private slugify(value: string): string {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}