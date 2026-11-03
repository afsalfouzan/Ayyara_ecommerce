import type { ReactNode } from 'react';
import { WhitePage } from '@/components/layout/WhitePage';

/** Every page under here is a perfume page, shown on white. */
export default function Layout({ children }: { children: ReactNode }) {
  return <WhitePage>{children}</WhitePage>;
}
