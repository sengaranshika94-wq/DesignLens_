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
  Globe,
  Calendar,
  Layers,
  Palette,
  Accessibility,
  Type,
  Eye,
  Ruler,
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

const iconMap = {
  Layers,
  Palette,
  Accessibility,
  Type,
  Eye,
  Ruler,
};

const sectionConfig = {
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

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  /*
   * When there is an ID, this is a real saved analysis.
   *
   * When there is no ID, /results is our demo report.
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

  /*
   * DEMO REPORT
   */
  if (!id) {
    return (
      <DashboardLayout>
        <DemoResultsPage
          analysisResult={analysisResult}
          navigate={navigate}
        />
      </DashboardLayout>
    );
  }

  /*
   * LOADING
   */
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

  /*
   * ERROR
   */
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

  /*
   * REAL ANALYSIS DATA
   */
  return (
    <DashboardLayout>
      <RealResultsPage
        analysis={analysis}
        navigate={navigate}
      />
    </DashboardLayout>
  );
}

/*
 * REAL RESULTS
 */
function RealResultsPage({ analysis, navigate }) {
  const categories = useMemo(() => {
    const scores = analysis.categoryScores || {};

    return [
      {
        name: 'Visual Design',
        score: scores.visualDesign ?? 0,
        icon: 'Palette',
      },
      {
        name: 'UX',
        score: scores.ux ?? 0,
        icon: 'Layers',
      },
      {
        name: 'Accessibility',
        score: scores.accessibility ?? 0,
        icon: 'Accessibility',
      },
      {
        name: 'Typography',
        score: scores.typography ?? 0,
        icon: 'Type',
      },
      {
        name: 'Layout',
        score: scores.layout ?? 0,
        icon: 'Ruler',
      },
      {
        name: 'Consistency',
        score: scores.consistency ?? 0,
        icon: 'Eye',
      },
    ];
  }, [analysis.categoryScores]);

  const insights = useMemo(() => {
    const issues = Array.isArray(analysis.issues)
      ? analysis.issues
      : [];

    return {
      needsAttention: issues.filter(
        (issue) => issue.severity?.toLowerCase() === 'high'
      ),

      improvements: issues.filter(
        (issue) =>
          ['medium', 'low'].includes(
            issue.severity?.toLowerCase()
          )
      ),

      lookingGood: [],
    };
  }, [analysis.issues]);

  const websiteName =
    analysis.design?.title || 'Untitled Design';

  const screenshotUrl =
    analysis.design?.screenshotUrl || null;

  const createdDate =
    analysis.createdAt ||
    analysis.design?.createdAt;

  const score = Number(analysis.overallScore) || 0;

  const scoreLabel =
    score >= 85
      ? 'Excellent'
      : score >= 70
        ? 'Good'
        : score >= 50
          ? 'Needs Work'
          : 'Poor';

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link to="/analyze">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Website Design Audit
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1">
                <Globe className="h-3 w-3 shrink-0" />

                <span className="truncate">
                  {websiteName}
                </span>
              </span>

              {createdDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(createdDate)}
                </span>
              )}
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
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `DesignLens — ${websiteName}`,
                  text: `Design audit for ${websiteName}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard?.writeText(
                  window.location.href
                );
              }
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => window.print()}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Screenshot */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Screenshot Preview
              </p>

              {screenshotUrl && (
                <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  Uploaded screenshot
                </span>
              )}
            </div>

            <WebsitePreview
              imageUrl={screenshotUrl}
              showMarkers={!screenshotUrl}
              compact
            />
          </div>

          {/* Overall score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6"
          >
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Overall Score
            </p>

            <ScoreRing
              score={score}
              size={140}
              strokeWidth={12}
            />

            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant={
                  score >= 70 ? 'success' : 'warning'
                }
              >
                {scoreLabel}
              </Badge>

              <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                {websiteName}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Category scores */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Category Scores
              </h2>

              <span className="text-xs text-muted-foreground">
                {categories.length} categories
              </span>
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

          {/* Issues */}
          <div className="space-y-6">
            {Object.entries(sectionConfig).map(
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

                      <h2 className="text-base font-semibold text-foreground">
                        {config.title}
                      </h2>

                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {items.length}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {items.map((item, index) => (
                        <InsightCard
                          key={`${item.title || 'issue'}-${index}`}
                          title={item.title || 'Design issue'}
                          explanation={
                            item.description ||
                            item.explanation ||
                            'No additional explanation was provided.'
                          }
                          recommendation={
                            item.recommendation ||
                            'Review this area of the design and consider improving it.'
                          }
                          severity={
                            item.severity || 'medium'
                          }
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            )}

            {/* No issues */}
            {analysis.issues?.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>

                <h3 className="font-semibold text-foreground">
                  No issues reported
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  The AI analysis did not identify any issues in this design.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/*
 * DEMO RESULTS
 *
 * Keeps your original mock report working at /results.
 */
function DemoResultsPage({ analysisResult, navigate }) {
  const {
    websiteName,
    url,
    date,
    overallScore,
    categories,
    insights,
  } = analysisResult;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link to="/analyze">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <div>
            <div className="mb-1 inline-flex rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Demo Report
            </div>

            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Website Design Audit
            </h1>

            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {url}
              </span>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Screenshot Preview
            </p>

            <WebsitePreview showMarkers compact />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6"
          >
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Overall Score
            </p>

            <ScoreRing
              score={overallScore}
              size={140}
              strokeWidth={12}
            />

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="success">
                Good
              </Badge>

              <span className="text-xs text-muted-foreground">
                {websiteName}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Category Scores
            </h2>

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

          <div className="space-y-6">
            {Object.entries(sectionConfig).map(
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

                      <h2 className="text-base font-semibold text-foreground">
                        {config.title}
                      </h2>

                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {items.length}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {items.map((item, index) => (
                        <InsightCard
                          key={`${item.title}-${index}`}
                          title={item.title}
                          explanation={item.explanation}
                          recommendation={item.recommendation}
                          severity={item.severity}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </>
  );
}