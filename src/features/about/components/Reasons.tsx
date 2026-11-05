import { ButtonLink } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import { REASONS } from '../ourStory';

/** A small diamond with `runners` bases lit: one more on each reason. */
function Bases({ runners }: { runners: number }) {
  return (
    <svg className="diamond" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15 5 25 15 15 25 5 15Z" stroke="currentColor" strokeWidth="1.5" />
      <rect className={runners >= 1 ? 'base on' : 'base'} x="22" y="12" width="6" height="6" transform="rotate(45 25 15)" />
      <rect className={runners >= 2 ? 'base on' : 'base'} x="12" y="2" width="6" height="6" transform="rotate(45 15 5)" />
      <rect className={runners >= 3 ? 'base on' : 'base'} x="2" y="12" width="6" height="6" transform="rotate(45 5 15)" />
    </svg>
  );
}

/**
 * The three reasons, in Jake's words. On the home page they are a plain list;
 * on About each gets a heading and a link to where it leads (`withLinks`).
 */
export function Reasons({ withLinks = false }: { withLinks?: boolean }) {
  const [ref, inView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  const Title = withLinks ? 'h3' : 'p';

  return (
    <ul ref={ref} aria-label={withLinks ? undefined : 'Why Playmaker'} className={inView ? 'bases in' : 'bases'}>
      {REASONS.map((reason, i) => (
        <li key={reason.title}>
          <Bases runners={i + 1} />
          <div className="min-w-0 flex flex-col items-start">
            <Title className="title">{reason.title}</Title>
            <p className="text-[16px] leading-[1.6] text-pm-muted mt-1.5 max-w-[48ch]">{reason.body}</p>
            {withLinks && (
              <ButtonLink to={reason.link.to} variant="secondary" size="sm" arrow className="mt-5">
                {reason.link.label}
              </ButtonLink>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
