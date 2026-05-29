import { useLoadingBarStore } from '../../store/loadingBarStore';

export function LoadingBar() {
  const active = useLoadingBarStore((s) => s.active);
  const progress = useLoadingBarStore((s) => s.progress);

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[3px] bg-pm-yellow pointer-events-none"
      style={{
        width: `${progress * 100}%`,
        opacity: active ? 1 : 0,
        transition: active
          ? 'width 800ms ease-out'
          : 'opacity 350ms ease-out',
      }}
    />
  );
}
