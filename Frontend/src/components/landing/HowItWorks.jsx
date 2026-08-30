import { motion } from 'framer-motion';
import { Upload, ScanLine, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Upload a screenshot of your website.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'AI Analysis',
    description:
      'DesignLens evaluates visual hierarchy, typography, spacing, color, accessibility and UX.',
    icon: ScanLine,
  },
  {
    number: '03',
    title: 'Improve',
    description:
      'Get actionable recommendations and an overall design score.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            Three simple steps from screenshot to actionable insight.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-7 transition-shadow hover:shadow-lg"
            >
              {/* Connecting line for desktop */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-12 translate-x-full bg-gradient-to-r from-border to-transparent md:block" />
              )}

              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-4xl font-bold text-secondary-foreground/30">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
