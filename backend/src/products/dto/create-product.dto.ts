import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({
        message: 'Product name is required.',
    })
    name: string;

    @IsString()
    @IsNotEmpty({
        message: 'Description is required.',
    })
    description: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0.01, {
        message: 'Price must be greater than 0.',
    })
    price: number;

    @IsString()
    @IsNotEmpty({
        message: 'Category is required.',
    })
    category: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0, {
        message: 'Stock cannot be negative.',
    })
    stock: number;
}