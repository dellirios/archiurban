import { Outlet } from 'react-router-dom';
import ArchiSidebar from '@/components/archi/ArchiSidebar';
import ArchiTopbar from '@/components/archi/ArchiTopbar';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const ArchiLayout = () => {
  const { sidebarOpen, viewMode } = useApp();

  if (viewMode === 'client') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ArchiSidebar />
      <div className={cn('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-[68px]')}>
        <ArchiTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ArchiLayout;
