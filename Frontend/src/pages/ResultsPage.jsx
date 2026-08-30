import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/ScoreRing';
import ScoreCard from '@/components/ScoreCard';
import InsightCard from '@/components/InsightCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import WebsitePreview from '@/components/WebsitePreview';
import {
  Layers,
  Palette,
  Accessibility,
  Type,
  Eye,
  Ruler,
} from 'lucide-react';
import { analysisResult } from '@/data/mockData';
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
  const { websiteName, url, date, overallScore, categories, insights } = analysisResult;

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
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> {url}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-3.5 w-3.5" /> Re-analyze
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="gradient" size="sm">
            <Download className="h-3.5 w-3.5" /> Export
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
            <WebsitePreview showMarkers compact />
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
            <ScoreRing score={overallScore} size={140} strokeWidth={12} />
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="success">Good</Badge>
              <span className="text-xs text-muted-foreground">{websiteName}</span>
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
              {categories.map((cat, i) => (
                <ScoreCard
                  key={cat.name}
                  title={cat.name}
                  score={cat.score}
                  icon={iconMap[cat.icon]}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-6">
            {Object.entries(sectionConfig).map(([key, config]) => {
              const items = insights[key];
              if (!items || items.length === 0) return null;
              const Icon = config.icon;

              return (
                <div key={key}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${config.color}`} size={18} />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">
                      {config.title}
                    </h2>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {items.map((item, i) => (
                      <InsightCard
                        key={item.title}
                        title={item.title}
                        explanation={item.explanation}
                        recommendation={item.recommendation}
                        severity={item.severity}
                        delay={i * 0.05}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
