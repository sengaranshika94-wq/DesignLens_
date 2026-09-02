import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  Wrench,
  ArrowUpRight,
  ArrowRight,
  ScanLine,
  BarChart3,
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

        setAnalyses(
          Array.isArray(data?.analyses)
            ? data.analyses
            : []
        );
      } catch (error) {
        console.error(
          'Failed to fetch analyses:',
          error
        );

        setError(
          error.response?.data?.message ||
            'Failed to load your analyses.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  /*
   * Most recent 5 analyses.
   * Backend already sorts by createdAt, but we sort here too
   * so the dashboard remains correct even if that changes later.
   */
  const recentAnalyses = useMemo(() => {
    return [...analyses]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 6);
  }, [analyses]);

  /*
   * Last 6 analyses for the score trend.
   * Sorted oldest → newest so the chart reads left to right.
   */
  const scoreTrend = useMemo(() => {
    return [...analyses]
      .filter(
        (analysis) =>
          Number.isFinite(
            Number(analysis.overallScore)
          )
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      )
      .slice(-7);
  }, [analyses]);

  /*
   * Total number of completed analysis documents.
   */
  const totalAnalyses = analyses.length;

  /*
   * Average score across all analyses.
   */
  const averageScore =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce(
            (total, analysis) =>
              total +
              (Number(analysis.overallScore) || 0),
            0
          ) / totalAnalyses
        )
      : 0;

  /*
   * Total number of issues returned by the AI.
   */
  const totalIssues = analyses.reduce(
    (total, analysis) =>
      total +
      (Array.isArray(analysis.issues)
        ? analysis.issues.length
        : 0),
    0
  );

  /*
   * Compare latest analysis score with previous analysis score.
   */
  const scoreChange = useMemo(() => {
    const sortedAnalyses = [...analyses]
      .filter(
        (analysis) =>
          Number.isFinite(
            Number(analysis.overallScore)
          )
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );

    if (sortedAnalyses.length < 2) {
      return null;
    }

    const previousScore =
      Number(
        sortedAnalyses[sortedAnalyses.length - 2]
          .overallScore
      ) || 0;

    const latestScore =
      Number(
        sortedAnalyses[sortedAnalyses.length - 1]
          .overallScore
      ) || 0;

    return latestScore - previousScore;
  }, [analyses]);

  /*
   * Dashboard stat cards.
   */
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
      label: 'Score Change',
      value:
        scoreChange === null
          ? '—'
          : `${scoreChange > 0 ? '+' : ''}${scoreChange}`,
      icon: 'ArrowUpRight',
      accent:
        scoreChange === null
          ? 'primary'
          : scoreChange > 0
            ? 'success'
            : scoreChange < 0
              ? 'warning'
              : 'primary',
      trend:
        scoreChange === null
          ? totalAnalyses === 0
            ? 'Run your first analysis'
            : 'Run another analysis to compare'
          : scoreChange > 0
            ? `${scoreChange} point${
                Math.abs(scoreChange) === 1
                  ? ''
                  : 's'
              } higher than previous`
            : scoreChange < 0
              ? `${Math.abs(scoreChange)} point${
                  Math.abs(scoreChange) === 1
                    ? ''
                    : 's'
                } lower than previous`
              : 'No change from previous',
      trendDirection:
        scoreChange > 0
          ? 'up'
          : scoreChange < 0
            ? 'down'
            : undefined,
    },
  ];

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">
              Loading your dashboard...
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
              Overview
            </p>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back, {user?.username || 'User'}
            </h1>

            <p className="mt-1 text-muted-foreground">
              Here&apos;s an overview of your design analyses.
            </p>
          </div>

          <Link
            to="/analyze"
            className="hidden sm:block"
          >
            <Button variant="gradient">
              <ScanLine className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStatsData.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={statIcons[stat.icon]}
            accent={stat.accent}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            delay={index * 0.08}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </motion.div>
      )}

      {/* Main content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent analyses */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden h-full">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Recent Analyses
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your latest design audits
                </p>
              </div>

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
                  Upload your first website screenshot to
                  get an AI-powered design audit.
                </p>

                <Link
                  to="/analyze"
                  className="mt-4"
                >
                  <Button
                    variant="gradient"
                    size="sm"
                  >
                    Start Analysis
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                        <th className="px-5 py-3">
                          Design
                        </th>

                        <th className="px-5 py-3">
                          Score
                        </th>

                        <th className="px-5 py-3">
                          Date
                        </th>

                        <th className="px-5 py-3">
                          Status
                        </th>

                        <th className="px-5 py-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {recentAnalyses.map(
                        (item, index) => {
                          const score =
                            Number(
                              item.overallScore
                            ) || 0;

                          const issueCount =
                            Array.isArray(
                              item.issues
                            )
                              ? item.issues.length
                              : 0;

                          return (
                            <motion.tr
                              key={item._id}
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              transition={{
                                delay:
                                  index * 0.05,
                              }}
                              className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30"
                            >
                              <td className="max-w-[280px] px-5 py-3.5">
                                <div className="truncate font-medium text-foreground">
                                  {item.design
                                    ?.title ||
                                    'Untitled Design'}
                                </div>

                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  {issueCount}{' '}
                                  {issueCount ===
                                  1
                                    ? 'issue'
                                    : 'issues'}
                                </div>
                              </td>

                              <td className="px-5 py-3.5">
                                <span
                                  className={`font-semibold tabular-nums ${getScoreColor(
                                    score
                                  )}`}
                                >
                                  {score}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                                {item.createdAt
                                  ? formatDate(
                                      item.createdAt
                                    )
                                  : '—'}
                              </td>

                              <td className="px-5 py-3.5">
                                <Badge variant="success">
                                  Completed
                                </Badge>
                              </td>

                              <td className="px-5 py-3.5 text-right">
                                <Link
                                  to={`/results/${item._id}`}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                  >
                                    View
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </Link>
                              </td>
                            </motion.tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-border sm:hidden">
                  {recentAnalyses.map(
                    (item, index) => {
                      const score =
                        Number(
                          item.overallScore
                        ) || 0;

                      const issueCount =
                        Array.isArray(item.issues)
                          ? item.issues.length
                          : 0;

                      return (
                        <motion.div
                          key={item._id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay:
                              index * 0.05,
                          }}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {item.design
                                  ?.title ||
                                  'Untitled Design'}
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground">
                                {issueCount}{' '}
                                {issueCount ===
                                1
                                  ? 'issue'
                                  : 'issues'}
                                {' · '}
                                {item.createdAt
                                  ? formatDate(
                                      item.createdAt
                                    )
                                  : '—'}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 text-xl font-bold tabular-nums ${getScoreColor(
                                score
                              )}`}
                            >
                              {score}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <Badge variant="success">
                              Completed
                            </Badge>

                            <Link
                              to={`/results/${item._id}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                View
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex h-full flex-col gap-6">
          {/* Quick action */}
          <Card className="overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/10 to-cyan-400/5 p-6">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ScanLine
                    className="h-5.5 w-5.5"
                    size={22}
                  />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  Analyze a new website
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Upload a screenshot and get instant AI
                  feedback on your design.
                </p>

                <Link
                  to="/analyze"
                  className="mt-4 block"
                >
                  <Button
                    variant="gradient"
                    className="w-full"
                  >
                    Start Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Score trend */}
          <Card className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Score Trend
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {scoreTrend.length > 0
                    ? `Last ${scoreTrend.length} analyses`
                    : 'Your analysis history'}
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {scoreTrend.length === 0 ? (
              <div className="mt-8 flex flex-col items-center text-center">
                <BarChart3 className="h-7 w-7 text-muted-foreground" />

                <p className="mt-2 text-xs text-muted-foreground">
                  Complete an analysis to start tracking
                  your scores.
                </p>

                <Link
                  to="/analyze"
                  className="mt-3"
                >
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Start Analysis
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex h-36 items-end gap-2">
                  {scoreTrend.map(
                    (analysis, index) => {
                      const score =
                        Math.max(
                          0,
                          Math.min(
                            100,
                            Number(
                              analysis.overallScore
                            ) || 0
                          )
                        );

                      return (
                        <div
                          key={analysis._id}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                          <span
                            className={`text-[10px] font-medium ${getScoreColor(
                              score
                            )}`}
                          >
                            {score}
                          </span>

                          <motion.div
                            initial={{
                              height: 0,
                            }}
                            animate={{
                              height: `${Math.max(
                                score,
                                4
                              )}%`,
                            }}
                            transition={{
                              delay:
                                index * 0.08,
                              duration: 0.5,
                            }}
                            className={`w-full max-w-8 rounded-t-md ${
                              score >= 85
                                ? 'bg-success'
                                : score >= 70
                                  ? 'bg-primary'
                                  : 'bg-warning'
                            }`}
                          />

                          <span className="text-[9px] text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[10px] text-muted-foreground">
                    Older
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    Latest
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}