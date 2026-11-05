import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { askTo } from '@/lib/contactLink';

// Sample colorways for the blank jersey: body, trim, lettering, and a number to go with each.
const COLORWAYS = [
  { name: 'Black and yellow', body: '#111111', trim: '#F5C842', ink: '#F5C842', number: '00' },
  { name: 'Yellow and black', body: '#F5C842', trim: '#111111', ink: '#111111', number: '07' },
  { name: 'Navy and white', body: '#1A2B5C', trim: '#FFFFFF', ink: '#FFFFFF', number: '12' },
  { name: 'Cream and navy', body: '#E8D89A', trim: '#1A2B5C', ink: '#1A2B5C', number: '23' },
  { name: 'White and black', body: '#FFFFFF', trim: '#111111', ink: '#111111', number: '34' },
] as const;

// Approved wording (PRODUCT.md): construction, size range, proof and artwork formats.
const SPEC = [
  { label: 'Made', value: 'Sublimated or tackle twill' },
  { label: 'Sizes', value: 'YS to Adult 3XL' },
  { label: 'Proof', value: 'Digital proof, same day' },
  { label: 'Artwork', value: "AI, EPS, PDF or high-res PNG. If you only have a phone photo, we'll work with it." },
] as const;

/**
 * One blank jersey in every colorway: a diagram, not a product photo. It
 * cycles while it's on screen until someone picks a swatch. This is marketing
 * illustration with its own small state; it is not the customizer.
 */
function Locker() {
  const lockerRef = useRef<HTMLDivElement>(null);
  const jerseyRef = useRef<SVGSVGElement>(null);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState(false);
  const colorway = COLORWAYS[current];

  // Cycle while the jersey is on screen, until a swatch is picked.
  useEffect(() => {
    const locker = lockerRef.current;
    if (!locker || picked || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (entry.isIntersecting) timer = window.setInterval(() => setCurrent((i) => (i + 1) % COLORWAYS.length), 2600);
      },
      { threshold: 0.4 },
    );
    observer.observe(locker);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [picked]);

  // A small settle each time the colours change. Skipped on first render.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    jerseyRef.current?.animate([{ transform: 'scale(.965) rotate(-1.2deg)' }, { transform: 'none' }], {
      duration: 500,
      easing: 'cubic-bezier(.16,1,.3,1)',
    });
  }, [current]);

  return (
    <div
      ref={lockerRef}
      className="card locker px-4 pt-8 pb-4 sm:px-8 sm:pt-10 sm:pb-5"
      style={{ '--jb': colorway.body, '--ja': colorway.trim, '--jt': colorway.ink } as CSSProperties}
    >
      <div className="stage-j">
        <svg
          ref={jerseyRef}
          viewBox="0 0 240 250"
          role="img"
          aria-label="A blank baseball jersey shown in several colorways, with your team name and number on the front"
        >
          <g stroke="#111" strokeWidth="1.6" strokeLinejoin="round">
            <path className="body" d="M62 34 L14 72 L34 102 L56 84 Z" />
            <path className="body" d="M178 34 L226 72 L206 102 L184 84 Z" />
            <path className="trim" d="M14 72 L34 102 L39.8 98.1 L19.8 68.1 Z" />
            <path className="trim" d="M226 72 L206 102 L200.2 98.1 L220.2 68.1 Z" />
            <path className="body" d="M92 22 Q120 42 148 22 L178 34 L184 84 L186 212 Q120 246 54 212 L56 84 L62 34 Z" />
            <path className="collar" d="M92 22 Q120 42 148 22" strokeWidth="6" strokeLinecap="round" />
          </g>
          <text className="anton ink" x="120" y="104" textAnchor="middle">
            YOUR TEAM
          </text>
          <path className="trim" d="M80 112h80v4H80z" />
          <text className="anton num ink" x="120" y="196" textAnchor="middle">
            {colorway.number}
          </text>
        </svg>
        <span className="callout left" style={{ left: '3%', right: '59%', top: '45.6%' }}>
          <span>Your logo</span>
        </span>
        <span className="callout" style={{ left: '68.6%', right: '3%', top: '27%' }}>
          <span>Your colors</span>
        </span>
        <span className="callout" style={{ left: '57.4%', right: '3%', top: '69%' }}>
          <span>Numbers</span>
        </span>
      </div>
      <div className="flex items-center justify-center gap-0.5 mt-5" role="group" aria-label="Preview a sample colorway">
        {COLORWAYS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className="swatch"
            aria-pressed={i === current}
            aria-label={c.name}
            style={{ '--a': c.body, '--b': c.trim } as CSSProperties}
            onClick={() => {
              setPicked(true);
              setCurrent(i);
            }}
          >
            <i />
          </button>
        ))}
      </div>
      <p className="small text-center">
        Sample colorway: <span className="text-pm-ink font-medium">{colorway.name}</span>
      </p>
    </div>
  );
}

/**
 * The team uniforms block, shared by the home page and /apparel. `onHome`
 * sends "Start a team order" up to the form on the home page instead of to /contact.
 */
export function TeamUniforms({ headingId, onHome = false }: { headingId: string; onHome?: boolean }) {
  return (
    <>
      <div className="min-w-0">
        <h2 id={headingId} className="h-section">
          Team uniforms
        </h2>
        <p className="lead mt-3">Full team sets with names, numbers and your logo. You send inspiration, we send a proof.</p>
        <dl className="spec mt-7 max-w-[520px]">
          {SPEC.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-7">
          <ButtonLink to={askTo('a custom uniform order for my team', 'Coach', { onHome })} size="lg" arrow>
            Start a team order
          </ButtonLink>
          <span className="small">Online jersey builder coming soon</span>
        </div>
      </div>
      <Locker />
    </>
  );
}
