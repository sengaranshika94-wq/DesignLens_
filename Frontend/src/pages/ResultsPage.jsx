import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    dot: 'bg-destructive',
  },
  improvements: {
    title: 'Improvements',
    icon: Lightbulb,
    color: 'text-warning',
    bg: 'bg-warning/10',
    dot: 'bg-warning',
  },
  lookingGood: {
    title: 'Looking Good',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
    dot: 'bg-success',
  },
};

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError('');

        const data = await getAnalysis(id);

        setAnalysis(data.analysis);
      } catch (err) {
        console.error('Failed to fetch analysis:', err);

        setError(
          err.response?.data?.message ||
            'Failed to load this design analysis.'
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  // Convert backend categoryScores object into the array
  // expected by the existing ScoreCard component.
  const categories = useMemo(() => {
    if (!analysis?.categoryScores) {
      return [];
    }

    return [
      {
        name: 'Visual Design',
        score: analysis.categoryScores.visualDesign,
        icon: 'Palette',
      },
      {
        name: 'UX',
        score: analysis.categoryScores.ux,
        icon: 'Layers',
      },
      {
        name: 'Accessibility',
        score: analysis.categoryScores.accessibility,
        icon: 'Accessibility',
      },
      {
        name: 'Typography',
        score: analysis.categoryScores.typography,
        icon: 'Type',
      },
      {
        name: 'Layout',
        score: analysis.categoryScores.layout,
        icon: 'Ruler',
      },
      {
        name: 'Consistency',
        score: analysis.categoryScores.consistency,
        icon: 'Eye',
      },
    ];
  }, [analysis]);

  // Convert the backend issues array into the three
  // sections already used by the existing UI.
  const insights = useMemo(() => {
    if (!analysis?.issues) {
      return {
        needsAttention: [],
        improvements: [],
        lookingGood: [],
      };
    }

    return {
      needsAttention: analysis.issues.filter(
        (issue) => issue.severity?.toLowerCase() === 'high'
      ),

      improvements: analysis.issues.filter(
        (issue) => issue.severity?.toLowerCase() === 'medium'
      ),

      lookingGood: analysis.issues.filter(
        (issue) => issue.severity?.toLowerCase() === 'low'
      ),
    };
  }, [analysis]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Loading analysis...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !analysis) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />

            <h2 className="text-lg font-semibold text-foreground">
              Unable to load analysis
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error || 'Analysis not found.'}
            </p>

            <Button
              className="mt-5"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const websiteName =
    analysis.design?.title || 'Untitled Design';

  const createdDate =
    analysis.createdAt || analysis.design?.createdAt;

  const screenshotUrl =
    analysis.design?.screenshotUrl;

  // Converts numeric score into a simple label.
  const scoreLabel =
    analysis.overallScore >= 85
      ? 'Excellent'
      : analysis.overallScore >= 70
        ? 'Good'
        : analysis.overallScore >= 50
          ? 'Needs Work'
          : 'Poor';

  return (
    <DashboardLayout>
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/analyze">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Website Design Audit
            </h1>

            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {websiteName}
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

          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          <Button variant="gradient" size="sm">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Screenshot + score */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Screenshot Preview
            </p>

            {/* Use real screenshot when WebsitePreview supports imageUrl */}
            <WebsitePreview
              imageUrl={screenshotUrl}
              showMarkers
              compact
            />
          </div>

          {/* Overall score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-6"
          >
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Overall Score
            </p>

            <ScoreRing
              score={analysis.overallScore}
              size={140}
              strokeWidth={12}
            />

            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant={
                  analysis.overallScore >= 70
                    ? 'success'
                    : 'warning'
                }
              >
                {scoreLabel}
              </Badge>

              <span className="text-xs text-muted-foreground">
                {websiteName}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right — Category cards + insights */}
        <div className="space-y-6 lg:col-span-2">
          {/* Category scores */}
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

          {/* Insights */}
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
                          explanation={item.description}
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
    </DashboardLayout>
  );
}