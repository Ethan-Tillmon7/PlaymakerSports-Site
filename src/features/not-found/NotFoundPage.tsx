import { Helmet } from 'react-helmet-async';
import { PageLayout } from '@/components/layout/PageLayout';
import { Diamond } from '@/components/layout/DiamondMark';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function NotFoundPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Page not found · Playmaker Sports</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Container as="section" className="py-24 flex flex-col items-center text-center gap-6">
        <Diamond className="w-10 h-10 text-pm-yellow" />
        <h1 className="font-display uppercase text-[clamp(72px,14vw,160px)] leading-none text-pm-black">
          <span className="sr-only">Page not found · </span>404
        </h1>
        <p className="text-[16px] leading-[1.6] text-pm-ink max-w-[420px]">
          This page doesn't exist. Head back to the homepage and try again.
        </p>
        <ButtonLink to="/" size="lg">
          Back to home
        </ButtonLink>
      </Container>
    </PageLayout>
  );
}
