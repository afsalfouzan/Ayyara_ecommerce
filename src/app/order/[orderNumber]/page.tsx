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
    <Container className="pt-10 pb-24 sm:pt-14">
      <p className="eyebrow">Thank you</p>
      <h1 className="mt-3 text-5xl">Your order</h1>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse bg-surface" />}>
        <OrderStatusLoader params={params} />
      </Suspense>
    </Container>
  );
}

async function OrderStatusLoader({ params }: Pick<PageProps<'/order/[orderNumber]'>, 'params'>) {
  const { orderNumber } = await params;
  return <OrderStatus orderNumber={orderNumber} />;
}
