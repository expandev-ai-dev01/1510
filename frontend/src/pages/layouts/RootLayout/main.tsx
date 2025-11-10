import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

/**
 * @component RootLayout
 * @summary Root layout component that wraps all pages with common structure.
 * @domain core
 * @type layout-component
 * @category layout
 */
export const RootLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default RootLayout;
