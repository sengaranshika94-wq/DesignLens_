import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import WebsitePreview from '@/components/WebsitePreview';
import ProgressBar from '@/components/ui/ProgressBar';

const categoryScores = [
  { label: 'UX Score', value: 78 },
  { label: 'Visual Design', value: 86 },
  { label: 'Accessibility', value: 91 },
  { label: 'Typography', value: 76 },
];

const insights = [
  {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    text: 'Primary CTA has low visual contrast.',
  },
  {
    icon: Lightbulb,
    color: 'text-primary',
    bg: 'bg-primary/10',
    text: 'Increase spacing between the navigation and hero content.',
  },
  {
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
    text: 'Typography hierarchy is consistent.',
  },
];

export default function ProductPreview() {
  return (
    <section id="product" className="relative border-b border-border py-20 lg:py-28">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            A complete design audit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            See exactly what the AI sees — with scores, markers, and actionable recommendations.
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left — screenshot with markers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <WebsitePreview
              showMarkers
              markers={[
                {
                  label: 'Low contrast',
                  color: '#ef4444',
                  position: { top: '14%', left: '48%' },
                },
                {
                  label: 'Weak CTA hierarchy',
                  color: '#f59e0b',
                  position: { top: '30%', left: '20%' },
                },
                {
                  label: 'Good spacing',
                  color: '#22c55e',
                  position: { top: '68%', left: '18%' },
                },
              ]}
            />
          </motion.div>

          {/* Right — scores & insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Overall score */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-5xl font-bold tabular-nums text-foreground">
                      82
                    </span>
                    <span className="mb-1 text-lg text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-success/20 bg-success/5">
                  <span className="text-xl font-bold text-success">82</span>
                </div>
              </div>
            </div>

            {/* Category scores */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="space-y-4">
                {categoryScores.map((cat, i) => (
                  <ProgressBar
                    key={cat.label}
                    label={cat.label}
                    value={cat.value}
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                AI Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}
                    >
                      <insight.icon className={`h-4 w-4 ${insight.color}`} />
                    </div>
                    <p className="pt-0.5 text-sm leading-relaxed text-foreground/80">
                      {insight.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
