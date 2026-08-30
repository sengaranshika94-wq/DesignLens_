import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score) {
  if (score >= 85) return 'text-success';
  if (score >= 70) return 'text-primary';
  if (score >= 50) return 'text-warning';
  return 'text-destructive';
}

export function getScoreBg(score) {
  if (score >= 85) return 'bg-success';
  if (score >= 70) return 'bg-primary';
  if (score >= 50) return 'bg-warning';
  return 'bg-destructive';
}

export function getScoreStroke(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#0ea5e9';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
