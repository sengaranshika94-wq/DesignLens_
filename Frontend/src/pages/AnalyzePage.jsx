import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ScanLine,
  Clock,
  Settings,
  Download,
  Sparkles,
} from 'lucide-react';

import Logo from '@/components/Logo';
import UploadZone from '@/components/UploadZone';
import Button from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';

import { createDesign } from '@/services/designService';
import { analyzeDesign } from '@/services/analysisService';
import { useAuth } from '@/context/AuthContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const username = user?.username || 'User';

  const initials =
    username.length >= 2
      ? username.slice(0, 2).toUpperCase()
      : username.slice(0, 1).toUpperCase();

  const handleDemo = () => {
    // Demo uses the existing mock results route.
    navigate('/results');
  };

  const handleFile = (file) => {
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setSelectedFile(null);
      setError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError('The screenshot must be smaller than 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a name for your design.');
      return;
    }

    if (trimmedTitle.length > 80) {
      setError('Design name must be 80 characters or less.');
      return;
    }

    if (!selectedFile) {
      setError('Please select a screenshot first.');
      return;
    }

    try {
      setError('');
      setIsAnalyzing(true);

      // Step 1:
      // Upload the screenshot and create a Design document.
      const designResponse = await createDesign(
        selectedFile,
        trimmedTitle
      );

      const designId = designResponse?.design?._id;

      if (!designId) {
        throw new Error('Design was created but no design ID was returned.');
      }

      console.log('Design created:', designId);

      // Step 2:
      // Send the created Design to Gemini for analysis.
      const analysisResponse = await analyzeDesign(designId);

      const analysisId = analysisResponse?.analysis?._id;

      if (!analysisId) {
        throw new Error(
          'Analysis completed but no analysis ID was returned.'
        );
      }

      console.log('Analysis created:', analysisId);

      // Step 3:
      // Open the exact saved analysis.
      navigate(`/results/${analysisId}`);
    } catch (err) {
      console.error('ANALYSIS FLOW ERROR:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong while analyzing your design.'
      );

      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
            >
              <ScanLine className="h-4 w-4" />
              Analyze
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Clock className="h-4 w-4" />
              History
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-400 text-xs font-semibold text-white"
            title={username}
          >
            {initials}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Design Audit
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Analyze your website
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Give your design a name, upload a screenshot, and let
            DesignLens evaluate its visual quality, UX, and accessibility.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {!isAnalyzing && (
            <>
              {/* Design name */}
              <div className="mb-6 rounded-xl border border-border bg-card p-5">
                <label
                  htmlFor="designTitle"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Design name
                </label>

                <input
                  id="designTitle"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  maxLength={80}
                  placeholder="e.g. Portfolio Homepage"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    Use a name you&apos;ll recognize later in History.
                  </p>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {title.length}/80
                  </span>
                </div>
              </div>

              {/* Upload */}
              <UploadZone
                onFileSelected={handleFile}
                onAnalyze={handleAnalyze}
                onDemo={handleDemo}
              />
            </>
          )}

          {/* Real analysis loading state */}
          {isAnalyzing && (
            <AnalyzingState title={title.trim()} />
          )}
        </motion.div>

        {/* Demo report */}
        {!isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Download className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Want to see an example report?
                </p>

                <p className="text-muted-foreground">
                  Explore a sample DesignLens audit without uploading anything.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDemo}
            >
              <Sparkles className="h-3.5 w-3.5" />
              View Demo Report
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function AnalyzingState({ title }) {
  const steps = [
    {
      label: 'Uploading screenshot',
      description: 'Storing your screenshot securely',
    },
    {
      label: 'Preparing design',
      description: 'Creating your DesignLens project',
    },
    {
      label: 'AI analyzing design',
      description: 'Evaluating layout, UX and visual quality',
    },
    {
      label: 'Generating recommendations',
      description: 'Preparing your personalized audit',
    },
  ];

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
        >
          <ScanLine className="h-8 w-8 text-primary" />
        </motion.div>

        <h2 className="text-lg font-semibold text-foreground">
          Analyzing your design...
        </h2>

        {title && (
          <p className="mt-1 max-w-md truncate text-sm font-medium text-primary">
            {title}
          </p>
        )}

        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          DesignLens is evaluating your screenshot and generating an
          AI-powered design audit. This may take a little while.
        </p>

        <div className="mt-8 w-full max-w-md space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 p-3 text-left"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.65, 1, 0.65],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: index * 0.25,
                }}
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {step.label}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}