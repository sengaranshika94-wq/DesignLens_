import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  ArrowLeft,
  Download,
  Share2,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
  Accessibility,
  Type,
  Eye,
  Ruler,
  Check,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/ScoreRing';
import ScoreCard from '@/components/ScoreCard';
import InsightCard from '@/components/InsightCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import WebsitePreview from '@/components/WebsitePreview';

import { getAnalysis } from '@/services/analysisService';
import { formatDate } from '@/lib/utils';
import { analysisResult } from '@/data/mockData';

/* =========================================================
   ICON MAP
========================================================= */

const iconMap = {
  Layers,
  Palette,
  Accessibility,
  Type,
  Eye,
  Ruler,
};

/* =========================================================
   REAL FINDING SECTIONS
========================================================= */

const realSectionConfig = {
  needsAttention: {
    title: 'Needs Attention',
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },

  improvements: {
    title: 'Improvements',
    icon: Lightbulb,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },

  minorIssues: {
    title: 'Minor Issues',
    icon: Lightbulb,
    color: 'text-muted-foreground',
    bg: 'bg-secondary',
  },
};

/* =========================================================
   DEMO FINDING SECTIONS
========================================================= */

const demoSectionConfig = {
  needsAttention: {
    title: 'Needs Attention',
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },

  improvements: {
    title: 'Improvements',
    icon: Lightbulb,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },

  lookingGood: {
    title: 'Looking Good',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  /*
   * Real analysis:
   * /results/:id
   *
   * Demo:
   * /results
   */
  useEffect(() => {
    if (!id) {
      setAnalysis(null);
      setLoading(false);
      return;
    }

    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError('');

        const data = await getAnalysis(id);

        if (!data?.analysis) {
          throw new Error('Analysis data was not returned.');
        }

        setAnalysis(data.analysis);
      } catch (err) {
        console.error('Failed to fetch analysis:', err);

        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load this analysis.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  /* =======================================================
     DEMO REPORT
  ======================================================= */

  if (!id) {
    return (
      <DashboardLayout>
        <DemoResultsPage
          demo={analysisResult}
          navigate={navigate}
        />
      </DashboardLayout>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">
              Loading your analysis...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !analysis) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              Unable to load analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {error || 'This analysis could not be found.'}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/history')}
              >
                Back to History
              </Button>

              <Button
                variant="gradient"
                onClick={() => navigate('/analyze')}
              >
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     REAL REPORT
  ======================================================= */

  return (
    <DashboardLayout>
      <RealResultsPage
        analysis={analysis}
        navigate={navigate}
      />
    </DashboardLayout>
  );
}

/* =========================================================
   REAL RESULTS
========================================================= */

function RealResultsPage({ analysis, navigate }) {
  const [copied, setCopied] = useState(false);

  const websiteName =
    analysis.design?.title || 'Untitled Design';

  const screenshotUrl =
    analysis.design?.screenshotUrl || '';

  const createdDate =
    analysis.createdAt ||
    analysis.design?.createdAt ||
    null;

  const score = Math.max(
    0,
    Math.min(
      100,
      Number(analysis.overallScore) || 0
    )
  );

  const totalIssues = Array.isArray(analysis.issues)
    ? analysis.issues.length
    : 0;

  const strengths = Array.isArray(analysis.strengths)
    ? analysis.strengths
    : [];

  const scoreLabel =
    score >= 90
      ? 'Excellent'
      : score >= 80
        ? 'Very Good'
        : score >= 70
          ? 'Good'
          : score >= 50
            ? 'Needs Work'
            : 'Needs Attention';

  /* =======================================================
     CATEGORY SCORES
  ======================================================= */

  const categories = useMemo(() => {
    const scores = analysis.categoryScores || {};

    return [
      {
        name: 'Visual Design',
        score: Number(scores.visualDesign) || 0,
        icon: 'Palette',
      },
      {
        name: 'UX',
        score: Number(scores.ux) || 0,
        icon: 'Layers',
      },
      {
        name: 'Accessibility',
        score: Number(scores.accessibility) || 0,
        icon: 'Accessibility',
      },
      {
        name: 'Typography',
        score: Number(scores.typography) || 0,
        icon: 'Type',
      },
      {
        name: 'Layout',
        score: Number(scores.layout) || 0,
        icon: 'Ruler',
      },
      {
        name: 'Consistency',
        score: Number(scores.consistency) || 0,
        icon: 'Eye',
      },
    ];
  }, [analysis.categoryScores]);

  /* =======================================================
     GROUP ISSUES BY SEVERITY
  ======================================================= */

  const insights = useMemo(() => {
    const issues = Array.isArray(analysis.issues)
      ? analysis.issues
      : [];

    return {
      needsAttention: issues.filter(
        (issue) =>
          issue?.severity?.toLowerCase() === 'high'
      ),

      improvements: issues.filter(
        (issue) =>
          issue?.severity?.toLowerCase() === 'medium'
      ),

      minorIssues: issues.filter(
        (issue) =>
          issue?.severity?.toLowerCase() === 'low'
      ),
    };
  }, [analysis.issues]);

  /* =======================================================
     REAL SCREENSHOT MARKERS
  ======================================================= */

  const analysisMarkers = useMemo(() => {
    if (!Array.isArray(analysis.issues)) {
      return [];
    }

    return analysis.issues
      .filter((issue) => {
        const x = Number(issue?.position?.x);
        const y = Number(issue?.position?.y);

        return (
          Number.isFinite(x) &&
          Number.isFinite(y) &&
          x >= 0 &&
          x <= 100 &&
          y >= 0 &&
          y <= 100
        );
      })
      .map((issue, index) => ({
        label:
          issue.title ||
          `Issue ${index + 1}`,

        severity:
          issue.severity || 'medium',

        position: {
          x: Number(issue.position.x),
          y: Number(issue.position.y),
        },
      }));
  }, [analysis.issues]);

  /* =======================================================
     SHARE
  ======================================================= */

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `DesignLens — ${websiteName}`,
          text: `Design audit for ${websiteName}`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      if (err?.name === 'AbortError') {
        return;
      }

      console.error('Share failed:', err);
    }
  };

  /* =======================================================
     EXPORT
  ======================================================= */

  const handleExport = () => {
    window.print();
  };

  return (
    <>
      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex min-w-0 items-start gap-3">
          <Link to="/history">
            <Button
              variant="outline"
              size="icon"
              aria-label="Back to history"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="mb-1 inline-flex rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              AI Design Audit
            </div>

            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {websiteName}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {createdDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(createdDate)}
                </span>
              )}

              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />

                {totalIssues}{' '}
                {totalIssues === 1
                  ? 'issue'
                  : 'issues'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analyze')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Re-analyze
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}

            {copied ? 'Copied' : 'Share'}
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Share feedback */}
      {copied && (
        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-4 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success print:hidden"
        >
          <Check className="h-4 w-4" />
          Report link copied to clipboard.
        </motion.div>
      )}

      {/* ===================================================
          MAIN CONTENT
      ==================================================== */}

      <div className="space-y-7">
        {/* =================================================
            SCREENSHOT
        ================================================== */}

        <section>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Screenshot Preview
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Visual findings are positioned directly on the design.
              </p>
            </div>

            {analysisMarkers.length > 0 && (
              <span className="w-fit rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                {analysisMarkers.length}{' '}
                {analysisMarkers.length === 1
                  ? 'marker'
                  : 'markers'}
              </span>
            )}
          </div>

          <WebsitePreview
            imageUrl={screenshotUrl}
            showMarkers
            markers={analysisMarkers}
            className="w-full"
          />
        </section>

        {/* =================================================
            SUMMARY
        ================================================== */}

        {analysis.summary && (
          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lightbulb className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  AI Summary
                </h2>

                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                  {analysis.summary}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* =================================================
            SCORE + CATEGORY SCORES
        ================================================== */}

        <section className="grid gap-6 lg:grid-cols-3">
          {/* Overall Score */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col items-center text-center">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Overall Score
              </p>

              <ScoreRing
                score={score}
                size={150}
                strokeWidth={12}
              />

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant={
                    score >= 70
                      ? 'success'
                      : 'warning'
                  }
                >
                  {scoreLabel}
                </Badge>

                <span className="text-xs text-muted-foreground">
                  {totalIssues}{' '}
                  {totalIssues === 1
                    ? 'issue found'
                    : 'issues found'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Category Scores */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Category Scores
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                A breakdown of your design performance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category, index) => (
                <ScoreCard
                  key={category.name}
                  title={category.name}
                  score={category.score}
                  icon={iconMap[category.icon]}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            STRENGTHS
        ================================================== */}

        {strengths.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                What&apos;s Working
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Areas where your design is already performing well.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {strengths.map((strength, index) => (
                <motion.div
                  key={`${strength.title || 'strength'}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  className="rounded-xl border border-success/20 bg-success/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {strength.title ||
                          'Strong design choice'}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {strength.description || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            AI FINDINGS
        ================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              AI Findings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Issues identified from your uploaded design.
            </p>
          </div>

          {totalIssues === 0 ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-5.5 w-5.5 text-success" />
              </div>

              <h3 className="font-semibold text-foreground">
                No issues reported
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                The AI analysis did not identify any issues in this design.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(realSectionConfig).map(
                ([key, config]) => {
                  const items = insights[key];

                  if (!items || items.length === 0) {
                    return null;
                  }

                  const Icon = config.icon;

                  return (
                    <div key={key}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
                        >
                          <Icon
                            className={`h-4.5 w-4.5 ${config.color}`}
                            size={18}
                          />
                        </div>

                        <h3 className="text-base font-semibold text-foreground">
                          {config.title}
                        </h3>

                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {items.length}
                        </span>
                      </div>

                      <div className="grid gap-3">
                        {items.map((item, index) => (
                          <InsightCard
                            key={`${item.title || 'issue'}-${index}`}
                            title={
                              item.title ||
                              'Design issue'
                            }
                            explanation={
                              item.description ||
                              item.explanation ||
                              item.whyItMatters ||
                              'No additional explanation was provided.'
                            }
                            recommendation={
                              item.recommendation ||
                              'Review this part of the design and consider improving it.'
                            }
                            severity={
                              item.severity ||
                              'medium'
                            }
                            delay={index * 0.05}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* =========================================================
   DEMO RESULTS
========================================================= */

function DemoResultsPage({ demo, navigate }) {
  const websiteName =
    demo?.websiteName || 'Demo Website';

  const url =
    demo?.url || 'portfolio.studio';

  const date =
    demo?.date || new Date().toISOString();

  const overallScore =
    Number(demo?.overallScore) || 0;

  const categories = Array.isArray(demo?.categories)
    ? demo.categories
    : [];

  const insights = demo?.insights || {};

  return (
    <>
      {/* Demo Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex min-w-0 items-start gap-3">
          <Link to="/analyze">
            <Button
              variant="outline"
              size="icon"
              aria-label="Back to analyze"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="mb-1 inline-flex rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Demo Report
            </div>

            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {websiteName}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => navigate('/analyze')}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Run Your Own Analysis
        </Button>
      </div>

      <div className="space-y-7">
        {/* Demo Screenshot */}
        <section>
          <div className="mb-3">
            <p className="text-sm font-semibold text-foreground">
              Screenshot Preview
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Example DesignLens analysis.
            </p>
          </div>

          <WebsitePreview
            showMarkers
            className="w-full"
          />
        </section>

        {/* Demo Score + Categories */}
        <section className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col items-center text-center">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Overall Score
              </p>

              <ScoreRing
                score={overallScore}
                size={150}
                strokeWidth={12}
              />

              <div className="mt-5 flex items-center gap-2">
                <Badge variant="success">
                  Good
                </Badge>

                <span className="text-xs text-muted-foreground">
                  Demo analysis
                </span>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-2">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Category Scores
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Example breakdown of the audit.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category, index) => (
                <ScoreCard
                  key={category.name}
                  title={category.name}
                  score={category.score}
                  icon={iconMap[category.icon]}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Demo Findings */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              AI Findings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Example findings from a DesignLens audit.
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(demoSectionConfig).map(
              ([key, config]) => {
                const items = Array.isArray(
                  insights[key]
                )
                  ? insights[key]
                  : [];

                if (items.length === 0) {
                  return null;
                }

                const Icon = config.icon;

                return (
                  <div key={key}>
                    <div className="mb-3 flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
                      >
                        <Icon
                          className={`h-4.5 w-4.5 ${config.color}`}
                          size={18}
                        />
                      </div>

                      <h3 className="text-base font-semibold text-foreground">
                        {config.title}
                      </h3>

                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {items.length}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {items.map((item, index) => (
                        <InsightCard
                          key={`${key}-${item.title || index}`}
                          title={
                            item.title ||
                            'Design insight'
                          }
                          explanation={
                            item.explanation ||
                            item.description ||
                            ''
                          }
                          recommendation={
                            item.recommendation ||
                            ''
                          }
                          severity={
                            item.severity ||
                            getDemoSeverity(key)
                          }
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================================================
   DEMO HELPERS
========================================================= */

function getDemoSeverity(key) {
  if (key === 'needsAttention') {
    return 'high';
  }

  if (key === 'lookingGood') {
    return 'low';
  }

  return 'medium';
}