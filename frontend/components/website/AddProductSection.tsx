'use client';

import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ProductForm from './ProductForm';
import {
  createProduct,
  getErrorMessage,
  ProductFormData,
} from '@/api/products.api';

export default function AddProductSection() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setApiError('');

      await createProduct(data);

      router.replace('/products?status=created');
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        Add Product
      </Typography>

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        apiError={apiError}
      />
    </Container>
  );
}