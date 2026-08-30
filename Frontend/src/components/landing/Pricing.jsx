import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for trying out DesignLens.',
    features: ['5 analyses per month', 'Basic scoring', '1 user'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For freelancers and small teams.',
    features: [
      'Unlimited analyses',
      'Full AI insights',
      'History & comparisons',
      'Priority processing',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/mo',
    description: 'For agencies and growing teams.',
    features: [
      'Everything in Pro',
      '5 team members',
      'Shared history',
      'API access',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            Start free. Upgrade when you need more.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative rounded-xl border p-7 transition-shadow hover:shadow-lg',
                plan.highlighted
                  ? 'border-primary/40 bg-card shadow-md'
                  : 'border-border bg-card'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-cyan-400 px-3 py-1 text-[10px] font-semibold text-white shadow-md">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  POPULAR
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <Button
                variant={plan.highlighted ? 'gradient' : 'outline'}
                className="mt-5 w-full"
              >
                {plan.cta}
              </Button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full',
                        plan.highlighted ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
