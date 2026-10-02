import { Suspense } from 'react';

import ProductListSection from '@/components/website/ProductListSection';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductListSection />
    </Suspense>
  );
}