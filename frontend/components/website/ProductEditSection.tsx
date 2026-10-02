'use client';

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getErrorMessage,
  getProduct,
  Product,
  ProductFormData,
  updateProduct,
} from '@/api/products.api';

import ProductForm from './ProductForm';

export default function ProductEditSection({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setError('');

    try {
      await updateProduct(id, data);
      router.replace('/products?status=updated');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">
          {error || 'Product not found.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Edit Product
      </Typography>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        loading={submitting}
        apiError={error}
      />
    </Container>
  );
}
