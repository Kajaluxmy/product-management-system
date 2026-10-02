import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';

import {
    Product,
    ProductDocument,
} from './products.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { R2Service } from '../storage/r2.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,

        private readonly r2Service: R2Service,

        private readonly configService: ConfigService,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        file?: Express.Multer.File,
    ) {
        let imageKey: string | undefined;

        if (file) {
            this.validateImage(file);
            imageKey = await this.r2Service.upload(file);
        }

        try {
            const product = new this.productModel({
                ...createProductDto,
                image: imageKey ?? null,
            });

            const savedProduct = await product.save();

            return this.toResponse(savedProduct);
        } catch (error) {
            if (imageKey) {
                await this.deleteUploadedImageSafely(imageKey);
            }

            throw error;
        }
    }

    async findAll() {
        const products = await this.productModel
            .find()
            .sort({ createdAt: -1 })
            .exec();

        return products.map((product) =>
            this.toResponse(product),
        );
    }

    async findOne(id: string) {
        this.validateMongoId(id);

        const product = await this.productModel
            .findById(id)
            .exec();

        if (!product) {
            throw new NotFoundException(
                'Product not found.',
            );
        }

        return this.toResponse(product);
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto,
        file?: Express.Multer.File,
    ) {
        this.validateMongoId(id);

        const product = await this.productModel
            .findById(id)
            .exec();

        if (!product) {
            throw new NotFoundException(
                'Product not found.',
            );
        }

        let newImageKey: string | undefined;

        if (file) {
            this.validateImage(file);
            newImageKey = await this.r2Service.upload(file);
        }

        const oldImageKey = product.image ?? null;

        try {
            Object.assign(product, updateProductDto);

            if (newImageKey) {
                product.image = newImageKey;
            }

            const updatedProduct = await product.save();

            if (
                newImageKey &&
                oldImageKey &&
                oldImageKey !== newImageKey
            ) {
                await this.deleteUploadedImageSafely(
                    oldImageKey,
                );
            }

            return this.toResponse(updatedProduct);
        } catch (error) {
            if (newImageKey) {
                await this.deleteUploadedImageSafely(
                    newImageKey,
                );
            }

            throw error;
        }
    }

    async remove(id: string) {
        this.validateMongoId(id);

        const product = await this.productModel
            .findById(id)
            .exec();

        if (!product) {
            throw new NotFoundException(
                'Product not found.',
            );
        }

        const imageKey = product.image ?? null;

        await this.productModel
            .findByIdAndDelete(id)
            .exec();

        if (imageKey) {
            await this.deleteUploadedImageSafely(imageKey);
        }

        return {
            message: 'Product deleted successfully.',
        };
    }

    private validateMongoId(id: string): void {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(
                'Invalid product ID.',
            );
        }
    }

    private validateImage(
        file: Express.Multer.File,
    ): void {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Only JPG, JPEG, PNG and WEBP images are allowed.',
            );
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            throw new BadRequestException(
                'Image size must be less than 5 MB.',
            );
        }
    }

    private async deleteUploadedImageSafely(
        key: string,
    ): Promise<void> {
        try {
            await this.r2Service.delete(key);
        } catch (error) {
            console.error(
                `Failed to delete R2 object: ${key}`,
                error,
            );
        }
    }

    private toResponse(product: ProductDocument) {
        const productObject = product.toObject();

        const publicUrl =
            this.configService
                .get<string>('R2_PUBLIC_URL')
                ?.replace(/\/+$/, '') ?? '';

        return {
            ...productObject,
            imageUrl:
                productObject.image && publicUrl
                    ? `${publicUrl}/${productObject.image}`
                    : null,
        };
    }
}