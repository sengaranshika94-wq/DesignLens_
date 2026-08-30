import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, Clock, Settings, Download, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import UploadZone from '@/components/UploadZone';
import Button from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDemo = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate('/results');
    }, 2200);
  };

  const handleFile = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate('/results');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 sm:flex">
            <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <ScanLine className="h-4 w-4" /> Analyze
            </button>
            <button 
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Clock className="h-4 w-4" /> History
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-400 text-xs font-semibold text-white">
            JD
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Analysis Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Analyze your website
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Upload a screenshot and get an instant AI-powered design audit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          {isAnalyzing ? (
            <AnalyzingState />
          ) : (
            <UploadZone onFileSelected={handleFile} onDemo={handleDemo} />
          )}
        </motion.div>

        {/* Recent quick access */}
        {!isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Download className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Want to see a full report?</p>
                <p className="text-muted-foreground">Check out a demo analysis.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDemo}>
              View Demo Report
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
      >
        <ScanLine className="h-8 w-8 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground">
        Analyzing your screenshot...
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Our AI is evaluating visual hierarchy, typography, spacing & accessibility.
      </p>
      <div className="mt-6 w-full max-w-xs space-y-2.5">
        {['Visual hierarchy', 'Color & contrast', 'Typography', 'Accessibility'].map(
          (step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-2.5 text-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                className="h-2 w-2 rounded-full bg-primary"
              />
              <span className="text-muted-foreground">{step}</span>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
