import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Calendar, AlertCircle, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { useEffect} from 'react';
import { getUserAnalyses } from '@/services/analysisService';
import { getScoreColor, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  

  const [analyses, setAnalyses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getUserAnalyses();

        setAnalyses(data.analyses);
      } catch (err) {
        console.error('Failed to fetch history:', err);

        setError(
          err.response?.data?.message ||
          'Failed to load history.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [])

  const filtered = useMemo(() => {
  const normalized = analyses.map((analysis) => ({
    id: analysis._id,
    name: analysis.design?.title || 'Untitled Design',
    url: analysis.design?.screenshotUrl || '',
    score: analysis.overallScore,
    date: analysis.createdAt,
    status: analysis.design?.status || 'completed',
    issues: analysis.issues?.length || 0,
    analysisId: analysis._id,
  }));

  return normalized.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      item.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });
}, [analyses, filter, search]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and search your past design analyses.
        </p>
      </motion.div>

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <AlertCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No analyses found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Card className="overflow-hidden hover:shadow-md">
                  {/* Thumbnail */}
                  <div className="relative h-32 overflow-hidden border-b border-border bg-secondary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="absolute left-3 top-3">
                      <Badge variant="success">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-card/80 backdrop-blur">
                      <span className={cn('text-sm font-bold tabular-nums', getScoreColor(item.score))}>
                        {item.score}
                      </span>
                    </div>
                    {/* Mini website preview */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-card/50 px-3 pb-2">
                      <div className="flex h-3 items-center gap-1 border-b border-border/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
                        <div className="h-1 w-12 rounded bg-foreground/10" />
                      </div>
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1.5 w-2/3 rounded bg-foreground/10" />
                        <div className="h-1 w-1/2 rounded bg-foreground/5" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.url}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {item.issues} issues
                      </span>
                    </div>
                    <Link
                        to={`/results/${item.analysisId}`}
                        className="mt-4 block"
                      >
                      <Button variant="outline" size="sm" className="w-full">
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
