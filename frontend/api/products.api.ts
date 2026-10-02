import axios from 'axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image?: File | null;
}

const api = axios.create({
  baseURL:
    (process.env as unknown as Record<string, string | undefined>)
      .NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data;

    if (typeof responseMessage === 'string') {
      return responseMessage;
    }

    if (
      responseMessage &&
      typeof responseMessage === 'object'
    ) {
      const message =
        'message' in responseMessage
          ? responseMessage.message
          : 'error' in responseMessage
            ? responseMessage.error
            : null;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(', ');
      }
    }

    if (typeof error.message === 'string') {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ProductFormData,
): Promise<Product> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('category', data.category);
  formData.append('stock', data.stock);

  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await api.post<Product>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateProduct = async (
  id: string,
  data: ProductFormData,
): Promise<Product> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('category', data.category);
  formData.append('stock', data.stock);

  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await api.patch<Product>(
    `/products/${id}`,
    formData,
  );

  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};