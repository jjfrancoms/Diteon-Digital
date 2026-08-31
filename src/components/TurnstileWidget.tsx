import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: (errorCode: string) => boolean | void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          retry?: 'auto' | 'never';
          'retry-interval'?: number;
          [key: string]: any;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY, onVerify, onExpire, onError, className = '', theme = 'light' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    // Keep callback refs stable across re-renders to prevent widget re-mounting on parent state changes
    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
      onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
      onErrorRef.current = onError;
    }, [onError]);

    // Expose reset method to parent component
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e) {
            if (import.meta.env.DEV) {
              console.error('[Turnstile Reset Error]', e);
            }
          }
        }
      }
    }));

    useEffect(() => {
      const activeSiteKey = siteKey?.trim();
      if (!activeSiteKey) {
        return;
      }

      let isMounted = true;

      const renderWidget = () => {
        if (!isMounted || !containerRef.current || !window.turnstile) return;

        // Clear any previous widget only when recreating for new siteKey/theme
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore removal errors
          }
          widgetIdRef.current = null;
        }

        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: activeSiteKey,
            theme,
            retry: 'auto',
            'retry-interval': 8000,
            callback: (token: string) => {
              if (isMounted) {
                onVerifyRef.current(token);
              }
            },
            'expired-callback': () => {
              if (isMounted) {
                onExpireRef.current?.();
              }
            },
            'error-callback': (errorCode: string) => {
              if (import.meta.env.DEV) {
                console.warn('[Turnstile Widget Error Callback]', errorCode);
              }
              if (isMounted) {
                onErrorRef.current?.(errorCode);
              }
              return true;
            }
          });
          widgetIdRef.current = id;
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('[Turnstile Render Error]', err);
          }
          onErrorRef.current?.('RENDER_FAILED');
        }
      };

      // Check if script is already present
      const existingScript = document.querySelector(`script[src*="challenges.cloudflare.com/turnstile"]`);

      if (window.turnstile) {
        renderWidget();
      } else if (existingScript) {
        // Script is loading, wait for it
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderWidget();
          }
        }, 100);
        return () => clearInterval(interval);
      } else {
        // Inject script tag
        const script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderWidget();
        };
        script.onerror = () => {
          if (isMounted) {
            onErrorRef.current?.('SCRIPT_LOAD_ERROR');
          }
        };
        document.head.appendChild(script);
      }

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore cleanup errors on unmount
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, theme]);

    if (!siteKey?.trim()) {
      return null;
    }

    return (
      <div className={`turnstile-container flex justify-start my-2 min-h-[65px] ${className}`}>
        <div ref={containerRef} />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
