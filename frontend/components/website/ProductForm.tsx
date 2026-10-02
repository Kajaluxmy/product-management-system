'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from '@mui/material';

import { useState } from 'react';

import {
  Product,
  ProductFormData,
} from '@/api/products.api';

import ImageUpload from './ImageUpload';

const PRODUCT_CATEGORIES = [
  'Laptop',
  'Smartphone',
  'Tablet',
  'Smartwatch',
  'Headphones',
  'Camera',
  'Gaming',
  'Desktop',
  'Accessories',
  'Audio',
];

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading: boolean;
  apiError?: string;
}

export default function ProductForm({
  product,
  onSubmit,
  loading,
  apiError,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(
    product?.description ?? '',
  );
  const [price, setPrice] = useState(
    product?.price?.toString() ?? '',
  );
  const [category, setCategory] = useState(
    product?.category ?? '',
  );
  const [stock, setStock] = useState(
    product?.stock?.toString() ?? '',
  );

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (
      !price ||
      Number.isNaN(Number(price)) ||
      Number(price) <= 0
    ) {
      newErrors.price = 'Price must be greater than 0.';
    }

    if (
      stock === '' ||
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0 ||
      !Number.isInteger(Number(stock))
    ) {
      newErrors.stock = 'Stock cannot be negative.';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      stock,
      image,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Product Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={Boolean(errors.name)}
        helperText={errors.name}
        margin="normal"
      />

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        error={Boolean(errors.description)}
        helperText={errors.description}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Price"
        type="number"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        error={Boolean(errors.price)}
        helperText={errors.price}
        margin="normal"
        slotProps={{
          htmlInput: {
            min: 0,
            step: '0.01',
            inputMode: 'decimal',
            style: { MozAppearance: 'textfield' },
          },
        }}
        sx={{
          '& input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
      />

      <TextField
        select
        fullWidth
        label="Category"
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
        error={Boolean(errors.category)}
        helperText={errors.category}
        margin="normal"
      >
        {PRODUCT_CATEGORIES.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Stock"
        type="number"
        value={stock}
        onChange={(event) => setStock(event.target.value)}
        error={Boolean(errors.stock)}
        helperText={errors.stock}
        margin="normal"
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
          },
        }}
      />

      <ImageUpload
        existingImageUrl={product?.imageUrl}
        onImageChange={setImage}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : product ? (
          'Update Product'
        ) : (
          'Create Product'
        )}
      </Button>
    </Box>
  );
}