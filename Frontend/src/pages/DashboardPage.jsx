import { Link } from 'react-router-dom';
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
import { recentAnalyses, statusMap } from '@/data/mockData';
import { getScoreColor, formatDate } from '@/lib/utils';

const statIcons = { Globe, TrendingUp, Wrench, ArrowUpRight };

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, Jordan
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your design analyses.
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

      {/* Recent analyses + quick actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent analyses table */}
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

            {/* Desktop table */}
            <div className="hidden sm:block">
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
                  {recentAnalyses.slice(0, 5).map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.url}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold tabular-nums ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusMap[item.status]?.variant}>
                          {statusMap[item.status]?.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link to="/results">
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
              {recentAnalyses.slice(0, 5).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.url}</div>
                    </div>
                    <span className={`text-xl font-bold tabular-nums ${getScoreColor(item.score)}`}>
                      {item.score}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </span>
                    <Link to="/results">
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick action */}
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

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Score Trend</h3>
            <p className="mt-1 text-xs text-muted-foreground">Last 6 analyses</p>
            <div className="mt-4 flex items-end justify-between gap-2">
              {[76, 84, 71, 88, 92, 82].map((score, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${score}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex w-full flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t-md ${
                      score >= 85 ? 'bg-success' : score >= 70 ? 'bg-primary' : 'bg-warning'
                    }`}
                    style={{ height: `${score}%`, minHeight: '4px' }}
                  />
                  <span className="text-[9px] text-muted-foreground">{score}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

const dashboardStatsData = [
  { label: 'Websites Analyzed', value: 24, icon: 'Globe', accent: 'primary' },
  { label: 'Average Score', value: 81, icon: 'TrendingUp', accent: 'success' },
  { label: 'Issues Fixed', value: 67, icon: 'Wrench', accent: 'warning' },
  {
    label: 'Improvement',
    value: '+18%',
    icon: 'ArrowUpRight',
    accent: 'primary',
    trend: 'vs last month',
    trendDirection: 'up',
  },
];
