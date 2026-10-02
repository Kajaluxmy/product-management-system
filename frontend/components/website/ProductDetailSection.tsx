'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  deleteProduct,
  getErrorMessage,
  getProduct,
  Product,
} from '@/api/products.api';

import DeleteDialog from './DeleteDialog';

export default function ProductDetailSection({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);

        setProduct(data);
      } catch {
        setError(
          'Something went wrong. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product._id);
      router.replace('/products?status=deleted');
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
      setDeleteDialogOpen(false);
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

  if (error || !product) {
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
      <Card>
        {product.imageUrl && (
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            sx={{
              maxHeight: 450,
              objectFit: 'contain',
            }}
          />
        )}

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {product.description}
          </Typography>

          <Typography variant="h5" sx={{ mt: 3 }}>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Category:</strong> {product.category}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Stock:</strong> {product.stock}
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                router.push(`/products/${product._id}/edit`)
              }
            >
              Edit Product
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Product
            </Button>
          </Box>
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Container>
  );
}