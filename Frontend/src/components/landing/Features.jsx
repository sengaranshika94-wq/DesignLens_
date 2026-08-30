import { motion } from 'framer-motion';
import {
  Layers,
  Palette,
  Type,
  Ruler,
  Accessibility,
  Lightbulb,
} from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

const features = [
  {
    icon: Layers,
    title: 'Visual Hierarchy',
    description:
      'Understand whether users can quickly identify the important elements.',
  },
  {
    icon: Palette,
    title: 'Color & Contrast',
    description:
      'Identify contrast problems and weak visual relationships.',
  },
  {
    icon: Type,
    title: 'Typography',
    description:
      'Analyze font hierarchy, readability and consistency.',
  },
  {
    icon: Ruler,
    title: 'Spacing & Layout',
    description: 'Detect inconsistent spacing and alignment.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    description: 'Identify potential accessibility problems.',
  },
  {
    icon: Lightbulb,
    title: 'UX Recommendations',
    description:
      'Receive practical suggestions to improve the interface.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Everything analyzed
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            Comprehensive design feedback across six critical dimensions.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
