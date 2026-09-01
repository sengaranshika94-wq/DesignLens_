
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  Wrench,
  ArrowUpRight,
  ArrowRight,
  ScanLine,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getUserAnalyses } from '@/services/analysisService';
import { getScoreColor, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const statIcons = {
  Globe,
  TrendingUp,
  Wrench,
  ArrowUpRight,
};

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        setError('');

        const data = await getUserAnalyses();

        setAnalyses(data.analyses || []);
      } catch (error) {
        console.error('Failed to fetch analyses:', error);

        setError(
          error.response?.data?.message ||
            'Failed to load recent analyses.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  const recentAnalyses = analyses.slice(0, 5);

  const totalAnalyses = analyses.length;

  const averageScore =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce(
            (total, analysis) => total + analysis.overallScore,
            0
          ) / totalAnalyses
        )
      : 0;

  const totalIssues = analyses.reduce(
    (total, analysis) => total + (analysis.issues?.length || 0),
    0
  );

  const dashboardStatsData = [
  {
    label: 'Websites Analyzed',
    value: totalAnalyses,
    icon: 'Globe',
    accent: 'primary',
  },
  {
    label: 'Average Score',
    value: averageScore,
    icon: 'TrendingUp',
    accent: 'success',
  },
  {
    label: 'Issues Found',
    value: totalIssues,
    icon: 'Wrench',
    accent: 'warning',
  },
  {
    label: 'Improvement',
    value: '—',
    icon: 'ArrowUpRight',
    accent: 'primary',
    trend: 'Coming soon',
    trendDirection: 'up',
  },
];

    if (loading) {
      return (
        <DashboardLayout>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Loading your analyses...
              </p>
            </div>
          </div>
        </DashboardLayout>
      );
    }

  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.username || 'User'}
        </h1>

        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your design analyses.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStatsData.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={statIcons[stat.icon]}
            accent={stat.accent}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Recent analyses + quick actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent analyses */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="text-base font-semibold text-foreground">
                Recent Analyses
              </h2>

              <Link to="/history">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <ScanLine className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="text-sm font-semibold text-foreground">
                  No analyses yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Upload your first website screenshot to get an AI-powered
                  design audit.
                </p>

                <Link to="/analyze" className="mt-4">
                  <Button variant="gradient" size="sm">
                    Start Analysis
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                        <th className="px-5 py-3">Website</th>
                        <th className="px-5 py-3">Score</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {recentAnalyses.map((item, i) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30"
                        >
                          <td className="max-w-[280px] px-5 py-3.5">
                            <div className="truncate font-medium text-foreground">
                              {item.design?.title || 'Untitled Design'}
                            </div>

                            <div className="truncate text-xs text-muted-foreground">
                              {item.design?.screenshotUrl || 'No screenshot'}
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`font-semibold tabular-nums ${getScoreColor(
                                item.overallScore
                              )}`}
                            >
                              {item.overallScore}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                            {item.createdAt
                              ? formatDate(item.createdAt)
                              : '—'}
                          </td>

                          <td className="px-5 py-3.5">
                            <Badge variant="success">
                              Completed
                            </Badge>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <Link to={`/results/${item._id}`}>
                              <Button variant="ghost" size="sm">
                                View
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-border sm:hidden">
                  {recentAnalyses.map((item, i) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">
                            {item.design?.title || 'Untitled Design'}
                          </div>

                          <div className="truncate text-xs text-muted-foreground">
                            {item.design?.screenshotUrl || 'No screenshot'}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-xl font-bold tabular-nums ${getScoreColor(
                            item.overallScore
                          )}`}
                        >
                          {item.overallScore}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {item.createdAt
                            ? formatDate(item.createdAt)
                            : '—'}
                        </span>

                        <Link to={`/results/${item._id}`}>
                          <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/10 to-cyan-400/5 p-6">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ScanLine className="h-5.5 w-5.5" size={22} />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  Analyze a new website
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a screenshot and get instant AI feedback.
                </p>

                <Link to="/analyze" className="mt-4 block">
                  <Button variant="gradient" className="w-full">
                    Start Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Temporary score trend */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Score Trend
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Demo data — we&apos;ll make this dynamic later.
            </p>

            <div className="mt-4 flex items-end justify-between gap-2">
              {[76, 84, 71, 88, 92, 82].map((score, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${score}%` }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                  }}
                  className="flex w-full flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t-md ${
                      score >= 85
                        ? 'bg-success'
                        : score >= 70
                          ? 'bg-primary'
                          : 'bg-warning'
                    }`}
                    style={{
                      height: `${score}%`,
                      minHeight: '4px',
                    }}
                  />

                  <span className="text-[9px] text-muted-foreground">
                    {score}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

/*
 * Temporary dashboard stats.
 * We'll replace these with real calculations
 * from the user's analyses once the core pages are complete.
 */
