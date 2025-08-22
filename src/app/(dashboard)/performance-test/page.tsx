import ResponsiveTestGrid from '@/components/performance/ResponsiveTestGrid';

export default function PerformanceTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <ResponsiveTestGrid />
      </div>
    </div>
  );
}
