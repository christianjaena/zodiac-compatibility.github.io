'use client';

import { useEffect, useRef } from 'react';

type AdUnitProps = {
  slot: string;
  className?: string;
};

export default function AdUnit({ slot, className }: Readonly<AdUnitProps>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const adRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!adsenseId || !slot) {
      return;
    }

    const adElement = adRef.current;
    if (!adElement) {
      return;
    }

    let isDisposed = false;

    const maybeInitializeAd = () => {
      if (isDisposed) {
        return;
      }

      const width = adElement.getBoundingClientRect().width;
      const isVisible = adElement.offsetParent !== null;
      const isInitialized =
        adElement.dataset.adRequestDone === 'true' ||
        adElement.dataset.adsbygoogleStatus !== undefined;

      if (!isVisible || width <= 0 || isInitialized) {
        return;
      }

      try {
        const adsGlobal = globalThis as typeof globalThis & {
          adsbygoogle?: unknown[];
        };
        adsGlobal.adsbygoogle = adsGlobal.adsbygoogle || [];
        adsGlobal.adsbygoogle.push({});
        adElement.dataset.adRequestDone = 'true';
      } catch {
        return;
      }
    };

    maybeInitializeAd();

    const resizeObserver = new ResizeObserver(() => {
      maybeInitializeAd();
    });
    resizeObserver.observe(adElement);

    const intersectionObserver = new IntersectionObserver(() => {
      maybeInitializeAd();
    });
    intersectionObserver.observe(adElement);

    return () => {
      isDisposed = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [adsenseId, slot]);

  if (!adsenseId || !slot) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className ?? ''}`.trim()}
      data-ad-client={adsenseId}
      data-ad-format='auto'
      data-ad-slot={slot}
      data-full-width-responsive='true'
      data-adtest={isDevelopment ? 'on' : undefined}
      style={{ display: 'block' }}
    />
  );
}
