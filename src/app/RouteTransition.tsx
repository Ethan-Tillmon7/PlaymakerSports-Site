import { useLocation } from 'react-router-dom';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-fade-in">
      {children}
    </div>
  );
}
