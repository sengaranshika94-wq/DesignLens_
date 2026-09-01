import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import WebsitePreview from '@/components/WebsitePreview';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute left-1/2 top-0 -z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8">
        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Design Audit
            <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
              Beta
            </span>
          </motion.div>

          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your website.
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Critiqued by AI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            Upload a screenshot and get an instant AI-powered UX, UI,
            accessibility and visual design audit.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link to="/login">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                Analyze My Website
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="h-4 w-4" />
                See How It Works
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 lg:justify-start">
            <div>
              <div className="text-2xl font-bold text-foreground">12k+</div>
              <div className="text-xs text-muted-foreground">Designs analyzed</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-xs text-muted-foreground">Accuracy rate</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">3s</div>
              <div className="text-xs text-muted-foreground">Avg analysis</div>
            </div>
          </div>
        </motion.div>

        {/* Right — product preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-cyan-400/10 blur-2xl" />
          <div className="relative">
            <WebsitePreview showMarkers />
          </div>

          {/* Floating score badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-5 -left-3 rounded-xl border border-border bg-card p-3 shadow-xl sm:-left-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <span className="text-sm font-bold text-success">82</span>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground">Overall Score</div>
                <div className="text-[10px] text-muted-foreground">Good design</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
