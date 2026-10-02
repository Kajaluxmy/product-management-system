'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  deleteProduct,
  getProducts,
  Product,
} from '@/api/products.api';

import DeleteDialog from './DeleteDialog';

export default function ProductListSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');

    if (status === 'created') {
      setSnackbar({
        open: true,
        message: 'Product created successfully.',
      });

      router.replace('/products');
    }

    if (status === 'updated') {
      setSnackbar({
        open: true,
        message: 'Product updated successfully.',
      });

      router.replace('/products');
    }

    if (status === 'deleted') {
      setSnackbar({
        open: true,
        message: 'Product deleted successfully.',
      });

      router.replace('/products');
    }
  }, [searchParams, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);

      setError(
        'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct(deleteId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== deleteId,
        ),
      );

      setSnackbar({
        open: true,
        message: 'Product deleted successfully.',
      });
    } catch (error) {
      console.error('Delete product error:', error);

      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setDeleteId(null);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 0.5,
              }}
            >
              Products
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Browse our products
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              router.push('/products/new')
            }
          >
            Add Product
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && (
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1 }}
            >
              No products found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Add your first product to get started.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                router.push('/products/new')
              }
            >
              Add Product
            </Button>
          </Box>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {products.map((product) => (
              <Card
                key={product._id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: '0.2s',

                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                {/* Product Image */}
                {product.imageUrl ? (
                  <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                      height: 220,
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      backgroundColor: '#eeeeee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      No Image
                    </Typography>
                  </Box>
                )}

                {/* Product Information */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    pb: 1,
                  }}
                >
                  {/* Category */}
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      mb: 1,
                    }}
                  />

                  {/* Product Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description}
                  </Typography>

                  {/* Price */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    Rs.{' '}
                    {product.price.toLocaleString(
                      'en-LK',
                    )}
                  </Typography>

                  {/* Stock */}
                  <Typography
                    variant="body2"
                    color={
                      product.stock > 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {product.stock > 0
                      ? `${product.stock} items available`
                      : 'Out of stock'}
                  </Typography>
                </CardContent>

                {/* Actions */}
                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      router.push(
                        `/products/${product._id}`,
                      )
                    }
                  >
                    View
                  </Button>

                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/products/${product._id}/edit`,
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        setDeleteId(product._id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Delete Dialog */}
      <DeleteDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            open: false,
            message: '',
          })
        }
        message={snackbar.message}
      />
    </Box>
  );
}