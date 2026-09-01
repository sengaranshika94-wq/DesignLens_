import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Calendar,
  AlertCircle,
  Eye,
  ScanLine,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { getUserAnalyses } from '@/services/analysisService';
import { getScoreColor, formatDate, cn } from '@/lib/utils';

const categoryFilters = [
  'All',
  'Visual Design',
  'UX',
  'Accessibility',
  'Typography',
  'Layout',
  'Consistency',
];

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        setError('');

        const data = await getUserAnalyses();

        setAnalyses(
          Array.isArray(data?.analyses)
            ? data.analyses
            : []
        );
      } catch (err) {
        console.error('Failed to fetch history:', err);

        setError(
          err.response?.data?.message ||
            'Failed to load your analysis history.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  /*
   * Convert backend analysis objects into a simple shape
   * that is easier for the UI to work with.
   */
  const normalizedAnalyses = useMemo(() => {
    return analyses.map((analysis) => ({
      id: analysis._id,

      analysisId: analysis._id,

      name:
        analysis.design?.title ||
        'Untitled Design',

      screenshotUrl:
        analysis.design?.screenshotUrl ||
        '',

      score:
        Number(analysis.overallScore) || 0,

      date:
        analysis.createdAt || null,

      issues: Array.isArray(analysis.issues)
        ? analysis.issues
        : [],

      issueCount: Array.isArray(analysis.issues)
        ? analysis.issues.length
        : 0,
    }));
  }, [analyses]);

  /*
   * Search + category filtering.
   */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedAnalyses.filter((item) => {
      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === 'All' ||
        item.issues.some((issue) => {
          return normalizeCategory(issue.category) ===
            normalizeCategory(categoryFilter);
        });

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    normalizedAnalyses,
    search,
    categoryFilter,
  ]);

  const hasActiveFilters =
    search.trim() !== '' ||
    categoryFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">
              Loading your analysis history...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              Unable to load history
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {error}
            </p>

            <Button
              className="mt-5"
              variant="gradient"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
              <ScanLine className="h-3.5 w-3.5" />
              Audit History
            </div>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              History
            </h1>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Browse your previous design analyses and open
              any saved report.
            </p>
          </div>

          <Link to="/analyze">
            <Button variant="gradient">
              <ScanLine className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-5"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by design name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="pl-9 pr-10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-semibold text-foreground">
            Category
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-medium text-primary transition-colors hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categoryFilters.map((category) => {
            const active =
              categoryFilter === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setCategoryFilter(category)
                }
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Result count */}
      {normalizedAnalyses.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">
              {normalizedAnalyses.length}
            </span>{' '}
            analyses
          </p>
        </div>
      )}

      {/* No analyses */}
      {normalizedAnalyses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <ScanLine className="h-7 w-7 text-muted-foreground" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            No analyses yet
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            Your completed design audits will appear here
            after you analyze a screenshot.
          </p>

          <Link
            to="/analyze"
            className="mt-5"
          >
            <Button variant="gradient">
              Start Your First Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      ) : filtered.length === 0 ? (
        /* No matching analyses */
        <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            No matching analyses
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            No saved analysis matches your current search
            or category filter.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        /* Analysis cards */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -3 }}
              >
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                  {/* Screenshot */}
                  <div className="relative h-40 overflow-hidden border-b border-border bg-secondary/30">
                    {item.screenshotUrl ? (
                      <img
                        src={item.screenshotUrl}
                        alt={`${item.name} screenshot`}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ScanLine className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Bottom readability overlay */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />

                    {/* Status */}
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Completed
                      </span>
                    </div>

                    {/* Score */}
                    <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-card/90 shadow-sm backdrop-blur">
                      <span
                        className={cn(
                          'text-sm font-bold tabular-nums',
                          getScoreColor(item.score)
                        )}
                      >
                        {item.score}
                      </span>
                    </div>

                    {/* Issue count */}
                    <div className="absolute bottom-3 left-3 text-xs font-medium text-white">
                      {item.issueCount}{' '}
                      {item.issueCount === 1
                        ? 'issue'
                        : 'issues'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="truncate font-semibold text-foreground">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Design audit
                    </p>

                    {/* Metadata */}
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {item.date
                            ? formatDate(item.date)
                            : 'Unknown date'}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />

                        <span>
                          {item.issueCount}
                        </span>
                      </span>
                    </div>

                    {/* Issue categories */}
                    {item.issues.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {getIssueCategories(item.issues)
                          .slice(0, 3)
                          .map((category) => (
                            <span
                              key={category}
                              className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground"
                            >
                              {formatCategory(category)}
                            </span>
                          ))}

                        {getIssueCategories(item.issues).length >
                          3 && (
                          <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
                            +
                            {getIssueCategories(item.issues).length -
                              3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Report button */}
                    <Link
                      to={`/results/${item.analysisId}`}
                      className="mt-4 block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Report
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}

/*
 * Normalizes category names so values such as:
 *
 * visualDesign
 * visual-design
 * visual design
 *
 * can be treated as the same category.
 */
function normalizeCategory(category) {
  if (!category) {
    return '';
  }

  return String(category)
    .trim()
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ');
}

function formatCategory(category) {
  if (!category) {
    return 'Other';
  }

  return String(category)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getIssueCategories(issues) {
  return [
    ...new Set(
      issues
        .map((issue) => issue.category)
        .filter(Boolean)
        .map((category) => String(category))
    ),
  ];
}