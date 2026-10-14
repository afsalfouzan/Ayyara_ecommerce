import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderStatus } from '@/components/order/OrderStatus';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Your Order',
  robots: { index: false, follow: false },
};

export default function OrderPage({ params }: PageProps<'/order/[orderNumber]'>) {
  return (
    <Container className="pt-6 pb-16 sm:pt-10 md:pb-24">
      <p className="eyebrow">Order</p>
      <h1 className="heading mt-2 text-fg">Your order</h1>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-sm border border-line bg-surface" />}>
        <OrderStatusLoader params={params} />
      </Suspense>
    </Container>
  );
}

async function OrderStatusLoader({ params }: Pick<PageProps<'/order/[orderNumber]'>, 'params'>) {
  const { orderNumber } = await params;
  return <OrderStatus orderNumber={orderNumber} />;
}
