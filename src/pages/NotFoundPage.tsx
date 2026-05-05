import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';

export function NotFoundPage() {
  return (
    <PageLayout>
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-24 flex flex-col items-center text-center gap-6">
        <Diamond className="w-10 h-10 text-pm-yellow" />
        <span className="font-display uppercase text-[clamp(72px,14vw,160px)] leading-none text-pm-black">
          404
        </span>
        <p className="text-[16px] leading-[1.6] text-pm-ink max-w-[420px]">
          This page doesn't exist. Head back to the homepage and try again.
        </p>
        <Link
          to="/"
          className="font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
        >
          Back to home
        </Link>
      </section>
    </PageLayout>
  );
}
