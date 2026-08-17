import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function CursorLoader({ forceLoading = false, fullScreen = false, inline = false, text = '' }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (fullScreen || inline) return;
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [fullScreen, inline]);

  useEffect(() => {
    let activeRequests = 0;

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => {
      // Wait exactly 1000ms (1 second) before checking if it's safe to hide the loader
      setTimeout(() => {
        if (activeRequests === 0) setIsLoading(false);
      }, 300); 
    };

    // 1. Track Next.js Router navigation
    router.events.on('routeChangeStart', startLoading);
    router.events.on('routeChangeComplete', stopLoading);
    router.events.on('routeChangeError', stopLoading);

    // 2. Intercept global fetch calls
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      activeRequests++;
      startLoading();
      try {
        const response = await originalFetch.apply(this, args);
        return response;
      } finally {
        activeRequests--;
        stopLoading();
      }
    };

    return () => {
      router.events.off('routeChangeStart', startLoading);
      router.events.off('routeChangeComplete', stopLoading);
      router.events.off('routeChangeError', stopLoading);
      window.fetch = originalFetch;
    };
  }, [router]);

  const displayLoading = isLoading || forceLoading;

  return (
    <AnimatePresence>
      {displayLoading && (
        <motion.div
          initial={fullScreen || inline ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.5, x: mousePosition.x + 16, y: mousePosition.y - 16 }}
          animate={fullScreen || inline ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: mousePosition.x + 16, y: mousePosition.y - 16 }}
          exit={fullScreen || inline ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.5 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            ...(fullScreen || inline ? {} : {
              x: { type: 'spring', damping: 30, stiffness: 400, mass: 0.5 },
              y: { type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }
            }),
          }}
          className={inline ? "flex flex-col items-center justify-center" : fullScreen ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F2F2F7]/60 backdrop-blur-sm" : "pointer-events-none fixed left-0 top-0 z-[9999]"}
        >
          <div
            className={`relative flex items-center justify-center ${fullScreen ? 'scale-150 h-12 w-12' : inline ? 'scale-[1.75] opacity-60 h-12 w-12' : 'scale-110 h-9 w-9'}`}
            role="status"
            aria-label="Loading"
          >
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              className={`${fullScreen || inline ? 'h-8 w-8' : 'h-6 w-6'} rounded-full object-contain`}
            />

            <motion.svg
              viewBox="0 0 36 36"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="25.13 75.4"
                animate={{
                  stroke: ['#a855f7', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'linear',
                }}
              />
            </motion.svg>
          </div>
          {text && fullScreen && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-[17px] font-semibold tracking-tight text-[#1D1D1F]"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}