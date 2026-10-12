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
      <p className="eyebrow">Atelier Confirmation</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-light tracking-wide text-white">Your Order Status</h1>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-sm border border-white/10 bg-[#141414]" />}>
        <OrderStatusLoader params={params} />
      </Suspense>
    </Container>
  );
}

async function OrderStatusLoader({ params }: Pick<PageProps<'/order/[orderNumber]'>, 'params'>) {
  const { orderNumber } = await params;
  return <OrderStatus orderNumber={orderNumber} />;
}
