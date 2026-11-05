import { Helmet } from 'react-helmet-async';
import { NightGround } from '@/components/layout/NightGround';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function NotFoundPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Page not found · Playmaker Sports</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <NightGround variant="page" labelledBy="page-title">
        <Container className="relative pt-8 pb-16 lg:pt-12 lg:pb-24">
          <h1 id="page-title" className="page-h1 enter">
            <span className="sr-only">Page not found · </span>404
          </h1>
          <p className="page-lede mt-5 enter enter-2">This page doesn't exist. Head back to the homepage and try again.</p>
          <ButtonLink to="/" size="lg" arrow className="mt-8 enter enter-2">
            Back to home
          </ButtonLink>
        </Container>
      </NightGround>
      <div className="awning" aria-hidden="true" />
    </PageLayout>
  );
}
