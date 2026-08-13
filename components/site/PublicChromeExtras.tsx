'use client';

import dynamic from 'next/dynamic';
import CustomCursor from '@/components/cursor/CustomCursor';
import ChunkLoadRecovery from '@/components/pwa/ChunkLoadRecovery';
import HardNavigationGuard from '@/components/navigation/HardNavigationGuard';

const ChatWidget = dynamic(() => import('@/components/utils/ChatWidget'), {
  ssr: false,
});
const FloatingCartButton = dynamic(
  () => import('@/components/utils/FloatingCartButton'),
  { ssr: false }
);
const ScrollToTopButton = dynamic(
  () => import('@/components/utils/ScrollToTopButton'),
  { ssr: false }
);

type PublicChromeExtrasProps = {
  showChat: boolean;
  showCart: boolean;
  showScrollTop: boolean;
};

/**
 * ویجت‌های غیرحیاتی — code-split تا باندل اولیه سبک‌تر شود.
 */
export default function PublicChromeExtras({
  showChat,
  showCart,
  showScrollTop,
}: PublicChromeExtrasProps) {
  return (
    <>
      <HardNavigationGuard />
      <ChunkLoadRecovery />
      <CustomCursor />
      {showScrollTop ? <ScrollToTopButton /> : null}
      {showCart ? <FloatingCartButton /> : null}
      {showChat ? <ChatWidget /> : null}
    </>
  );
}
