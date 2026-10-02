import ProductDetailSection from '@/components/website/ProductDetailSection';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductDetailSection id={id} />;
}
