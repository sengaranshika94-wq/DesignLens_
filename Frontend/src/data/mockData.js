// Mock data for DesignLens — structured so it can be replaced with API responses later.

export const analysisResult = {
  websiteName: 'Portfolio Website',
  url: 'portfolio.studio',
  date: '2026-08-24',
  overallScore: 82,
  categories: [
    { name: 'UX', score: 78, icon: 'Layers' },
    { name: 'Visual Design', score: 86, icon: 'Palette' },
    { name: 'Accessibility', score: 91, icon: 'Accessibility' },
    { name: 'Typography', score: 76, icon: 'Type' },
    { name: 'Color', score: 85, icon: 'Eye' },
    { name: 'Spacing', score: 81, icon: 'Ruler' },
  ],
  insights: {
    needsAttention: [
      {
        title: 'Low CTA Contrast',
        severity: 'high',
        explanation:
          'The primary CTA does not stand out sufficiently from the surrounding content, making it easy for users to miss.',
        recommendation:
          'Increase contrast between the CTA background and surrounding elements. Use a bold accent color with at least 4.5:1 contrast ratio.',
      },
      {
        title: 'Missing Alt Text on Images',
        severity: 'high',
        explanation:
          'Several images in the portfolio section lack alt text, failing WCAG 2.1 Level A accessibility requirements.',
        recommendation:
          'Add descriptive alt attributes to all informational images. Use empty alt="" for purely decorative images.',
      },
      {
        title: 'Inconsistent Button Styles',
        severity: 'high',
        explanation:
          'Buttons across the page use three different border-radius values and two different font sizes.',
        recommendation:
          'Define a button design token system with consistent radius, padding, and typography. Limit to 2 button variants.',
      },
    ],
    improvements: [
      {
        title: 'Navigation Spacing',
        severity: 'medium',
        explanation:
          'The spacing between the navigation bar and the hero section is tighter than the spacing between other sections.',
        recommendation:
          'Increase the top padding of the hero section to match the vertical rhythm used elsewhere (e.g. 80px or 5rem).',
      },
      {
        title: 'Font Size Scale',
        severity: 'medium',
        explanation:
          'The body text uses 14px which is slightly small for comfortable reading on larger screens.',
        recommendation:
          'Increase base font size to 16px for body text. Use a modular type scale (1.25 ratio) for headings.',
      },
      {
        title: 'Color Palette Saturation',
        severity: 'medium',
        explanation:
          'The accent color is used heavily in multiple sections, reducing its effectiveness as a visual highlight.',
        recommendation:
          'Reserve the primary accent color for interactive elements and CTAs only. Use neutral tones for decorative elements.',
      },
      {
        title: 'Mobile Breakpoint Issues',
        severity: 'medium',
        explanation:
          'At 768px width, the three-column card layout becomes cramped with insufficient whitespace.',
        recommendation:
          'Add a breakpoint at 880px to switch from 3 columns to 2, and at 640px to switch to a single column.',
      },
    ],
    lookingGood: [
      {
        title: 'Typography Hierarchy',
        severity: 'low',
        explanation:
          'Heading hierarchy is consistent and well-structured, making the content easy to scan.',
        recommendation: null,
      },
      {
        title: 'Consistent Spacing System',
        severity: 'low',
        explanation:
          'The layout uses an 8px spacing grid throughout most sections, creating a cohesive rhythm.',
        recommendation: null,
      },
      {
        title: 'Clear Visual Structure',
        severity: 'low',
        explanation:
          'The page follows a logical top-to-bottom flow with clear section separation.',
        recommendation: null,
      },
    ],
  },
};

export const dashboardStats = [
  { label: 'Websites Analyzed', value: 24, icon: 'Globe', accent: 'primary' },
  { label: 'Average Score', value: 81, icon: 'TrendingUp', accent: 'success' },
  { label: 'Issues Fixed', value: 67, icon: 'Wrench', accent: 'warning' },
  { label: 'Improvement', value: '+18%', icon: 'ArrowUpRight', accent: 'primary', trend: 'vs last month', trendDirection: 'up' },
];

export const recentAnalyses = [
  {
    id: 1,
    name: 'Portfolio',
    url: 'portfolio.studio',
    score: 92,
    date: '2026-08-24',
    status: 'excellent',
    issues: 2,
    thumbnail: 'portfolio',
  },
  {
    id: 2,
    name: 'Landing Page',
    url: 'saas landing.io',
    score: 84,
    date: '2026-08-22',
    status: 'good',
    issues: 5,
    thumbnail: 'landing',
  },
  {
    id: 3,
    name: 'E-commerce',
    url: 'shop.example.com',
    score: 76,
    date: '2026-08-20',
    status: 'needs-improvement',
    issues: 11,
    thumbnail: 'ecommerce',
  },
  {
    id: 4,
    name: 'Dashboard',
    url: 'app.analytics.io',
    score: 88,
    date: '2026-08-18',
    status: 'good',
    issues: 4,
    thumbnail: 'dashboard',
  },
  {
    id: 5,
    name: 'Marketing Site',
    url: 'growth.tools',
    score: 71,
    date: '2026-08-15',
    status: 'needs-improvement',
    issues: 8,
    thumbnail: 'marketing',
  },
  {
    id: 6,
    name: 'Blog',
    url: 'dev.notes.blog',
    score: 95,
    date: '2026-08-12',
    status: 'excellent',
    issues: 1,
    thumbnail: 'blog',
  },
];

export const historyFilters = ['All', 'Excellent', 'Needs Improvement', 'Poor'];

export function getFilteredHistory(filter, search = '') {
  let items = recentAnalyses;
  if (filter === 'Excellent') items = items.filter((a) => a.score >= 85);
  else if (filter === 'Needs Improvement') items = items.filter((a) => a.score >= 50 && a.score < 85);
  else if (filter === 'Poor') items = items.filter((a) => a.score < 50);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (a) => a.name.toLowerCase().includes(q) || a.url.toLowerCase().includes(q)
    );
  }
  return items;
}

// Status filter mapping
export const statusMap = {
  excellent: { label: 'Excellent', variant: 'success' },
  good: { label: 'Good', variant: 'primary' },
  'needs-improvement': { label: 'Needs Improvement', variant: 'warning' },
  poor: { label: 'Poor', variant: 'destructive' },
};
