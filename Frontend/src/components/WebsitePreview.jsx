import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export default function WebsitePreview({
  imageUrl = null,
  showMarkers = false,
  className,
  markers = defaultMarkers,
}) {
  const [scanComplete, setScanComplete] = useState(
    !showMarkers
  );

  useEffect(() => {
    if (!showMarkers) {
      setScanComplete(true);
      return;
    }

    setScanComplete(false);

    const timer = setTimeout(() => {
      setScanComplete(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showMarkers]);

  const safeMarkers = useMemo(() => {
    if (!Array.isArray(markers)) {
      return [];
    }

    return markers.filter(
      (marker) =>
        marker &&
        marker.position &&
        Number.isFinite(Number(marker.position.x)) &&
        Number.isFinite(Number(marker.position.y))
    );
  }, [markers]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-2xl',
        className
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>

        <div className="ml-2 flex-1">
          <div className="flex h-6 items-center gap-1.5 rounded-md bg-background px-2.5 text-[10px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-400" />

            <span className="truncate font-mono">
              {imageUrl
                ? 'uploaded-design'
                : 'portfolio.studio'}
            </span>
          </div>
        </div>
      </div>

      {/* Screenshot */}
      <div className="relative bg-background">
        {imageUrl ? (
          <RealScreenshot imageUrl={imageUrl} />
        ) : (
          <FakeWebsite />
        )}

        {/* Scan line */}
        {showMarkers && !scanComplete && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_2px_rgba(14,165,233,0.5)] animate-scan-line" />

            <div className="absolute inset-0 bg-primary/5" />
          </div>
        )}

        {/* Markers */}
        {showMarkers && scanComplete && safeMarkers.length > 0 && (
          <div className="pointer-events-none absolute inset-0">
            <AnimatePresence>
              {safeMarkers.map((marker, index) => {
                const x = clamp(
                  Number(marker.position.x),
                  0,
                  100
                );

                const y = clamp(
                  Number(marker.position.y),
                  0,
                  100
                );

                const color =
                  marker.color ||
                  getSeverityColor(marker.severity);

                return (
                  <motion.div
                    key={`${marker.label}-${index}`}
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: index * 0.15,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    {/* Marker */}
                    <div
                      className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background shadow-lg"
                      style={{
                        borderColor: color,
                        boxShadow: `0 0 0 5px ${color}30`,
                      }}
                    />

                    {/* Label */}
                    <div
                      className="absolute left-3 top-3 max-w-[220px] whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[10px] font-medium shadow-lg backdrop-blur-md"
                      style={{
                        background: `${color}18`,
                        borderColor: `${color}55`,
                        color,
                      }}
                    >
                      {marker.label}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function RealScreenshot({ imageUrl }) {
  return (
    <div className="flex max-h-[760px] justify-center overflow-auto bg-secondary/20 p-2 sm:p-4">
      <img
        src={imageUrl}
        alt="Uploaded website design"
        className="block h-auto max-h-[720px] w-full object-contain"
      />
    </div>
  );
}

function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case 'high':
      return '#ef4444';

    case 'medium':
      return '#f59e0b';

    case 'low':
      return '#0ea5e9';

    default:
      return '#0ea5e9';
  }
}

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

const defaultMarkers = [
  {
    label: 'Poor contrast',
    color: '#ef4444',
    position: {
      top: '14%',
      left: '48%',
    },
  },
  {
    label: 'CTA placement',
    color: '#f59e0b',
    position: {
      top: '30%',
      left: '20%',
    },
  },
  {
    label: 'Typography',
    color: '#0ea5e9',
    position: {
      top: '52%',
      left: '55%',
    },
  },
  {
    label: 'Spacing',
    color: '#a855f7',
    position: {
      top: '68%',
      left: '18%',
    },
  },
  {
    label: 'Accessibility',
    color: '#22c55e',
    position: {
      top: '84%',
      left: '60%',
    },
  },
];

function FakeWebsite() {
  return (
    <div className="bg-background">
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-primary/60" />
          <div className="h-2 w-16 rounded bg-foreground/20" />
        </div>

        <div className="flex gap-4">
          <div className="h-2 w-10 rounded bg-foreground/10" />
          <div className="h-2 w-10 rounded bg-foreground/10" />
          <div className="h-2 w-10 rounded bg-foreground/10" />
          <div className="h-5 w-16 rounded bg-primary/40" />
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 py-10 text-center">
        <div className="mx-auto mb-3 h-3 w-40 rounded bg-foreground/20" />
        <div className="mx-auto mb-2 h-2.5 w-56 rounded bg-foreground/10" />
        <div className="mx-auto mb-5 h-2.5 w-44 rounded bg-foreground/10" />

        <div className="flex justify-center gap-3">
          <div className="h-8 w-28 rounded bg-primary/30" />
          <div className="h-8 w-24 rounded border border-border" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 px-6 pb-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border p-3"
          >
            <div className="mb-2 h-8 w-8 rounded-md bg-foreground/5" />
            <div className="mb-1.5 h-2 w-16 rounded bg-foreground/15" />
            <div className="h-1.5 w-full rounded bg-foreground/5" />
            <div className="mt-1 h-1.5 w-2/3 rounded bg-foreground/5" />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-secondary/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 rounded bg-foreground/10" />

          <div className="flex gap-2">
            <div className="h-5 w-5 rounded bg-foreground/5" />
            <div className="h-5 w-5 rounded bg-foreground/5" />
            <div className="h-5 w-5 rounded bg-foreground/5" />
          </div>
        </div>
      </div>
    </div>
  );
}