import ProductEditSection from '@/components/website/ProductEditSection';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductEditSection id={id} />;
}
