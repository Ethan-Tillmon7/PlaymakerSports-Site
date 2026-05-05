import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { DiamondMarkSymbol, Diamond } from '../components/layout/DiamondMark';

const jerseyCards = [
  {
    stage: 'stage-cream',
    tag: { text: 'New', className: 'bg-pm-yellow text-pm-black' },
    sku: 'PM-J-01',
    labelText: '[ home jersey · front ]',
    jerseyFill: '#FFFFFF', jerseyStroke: '#D9D5C4',
    wordmark: 'SLUGGERS', wordmarkFill: '#111111',
    number: '07', numberFill: '#F5C842', numberStroke: '#111', numberStrokeWidth: '1.2',
    type: 'Sublimated · Home',
    name: 'The Slugger',
    desc: 'Classic v-neck home jersey. White base with two-color trim and your team wordmark across the chest.',
    swatches: [
      { bg: 'bg-white border border-pm-rule', title: 'White' },
      { bg: 'bg-pm-yellow border border-pm-yellow-deep', title: 'Yellow' },
      { bg: 'bg-pm-navy', title: 'Navy' },
      { bg: 'bg-pm-cream', title: 'Cream' },
    ],
    extraColors: '+2 colors',
    price: '$48',
  },
  {
    stage: 'stage-paper',
    tag: { text: 'Bestseller', className: 'bg-pm-black text-pm-yellow' },
    sku: 'PM-J-02',
    labelText: '[ road jersey · front ]',
    jerseyFill: '#F5C842', jerseyStroke: '#C99E1F',
    wordmark: 'PLAYMAKER', wordmarkFill: '#111111',
    number: '12', numberFill: '#111111', numberStroke: undefined, numberStrokeWidth: undefined,
    type: 'Sublimated · Road',
    name: 'The Signal',
    desc: 'High-visibility road jersey in our signature yellow. Black numbers and trim. Reads from the bleachers.',
    swatches: [
      { bg: 'bg-pm-yellow border border-pm-yellow-deep', title: 'Yellow' },
      { bg: 'bg-pm-black', title: 'Black' },
      { bg: 'bg-pm-navy', title: 'Navy' },
    ],
    extraColors: '3 colors',
    price: '$52',
  },
  {
    stage: 'stage-mint',
    tag: { text: 'Tackle-twill', className: 'bg-white text-pm-black border border-pm-rule' },
    sku: 'PM-J-03',
    labelText: '[ alternate · front ]',
    jerseyFill: '#1A2B5C', jerseyStroke: '#0E1A40',
    wordmark: 'RIVERDOGS', wordmarkFill: '#F5C842',
    number: '23', numberFill: '#F5C842', numberStroke: '#FFF', numberStrokeWidth: '0.8',
    type: 'Tackle-twill · Alternate',
    name: 'The Captain',
    desc: 'Heavyweight pullover with sewn-on letters and numbers. Looks like the throwback your dad still has hanging in his closet.',
    swatches: [
      { bg: 'bg-pm-navy', title: 'Navy' },
      { bg: 'bg-pm-black', title: 'Black' },
      { bg: '', style: { background: '#7A1F1F' }, title: 'Maroon' },
      { bg: '', style: { background: '#1F4D2C' }, title: 'Forest' },
    ],
    extraColors: '+3 colors',
    price: '$68',
  },
  {
    stage: 'stage-blush',
    tag: { text: 'Limited', className: 'bg-pm-cream text-pm-black' },
    sku: 'PM-J-04',
    labelText: '[ throwback · front ]',
    jerseyFill: '#E8D89A', jerseyStroke: '#B8A66E',
    wordmark: 'CAJUNS', wordmarkFill: '#7A1F1F',
    number: '42', numberFill: '#7A1F1F', numberStroke: undefined, numberStrokeWidth: undefined,
    type: 'Tackle-twill · Throwback',
    name: 'The Acadian',
    desc: 'Vintage-cream button-front with felt arch lettering. Built for season-opener parades and tournament photo days.',
    swatches: [
      { bg: 'bg-pm-cream border border-pm-rule', title: 'Cream' },
      { bg: '', style: { background: '#7A1F1F' }, title: 'Maroon' },
      { bg: 'bg-pm-navy', title: 'Navy' },
    ],
    extraColors: '3 colors',
    price: '$74',
  },
];

const processSteps = [
  { num: '01', title: 'Pick a base', desc: 'Sublimated, tackle-twill, throwback, or button-front. Four cuts, four price points.', day: 'Day 1', yellow: false },
  { num: '02', title: 'Drop your art', desc: "Wordmark, logo, sponsors. We'll vector it for free if you've only got a phone photo.", day: 'Day 1', yellow: false },
  { num: '03', title: 'Approve proof', desc: 'Same-day digital proof. Two free revisions. Sign off and we send it to print.', day: 'Day 2', yellow: false },
  { num: '04', title: 'Ship to field', desc: 'Direct to the dugout in seven business days. Local Lafayette delivery available.', day: 'Day 7', yellow: true },
];

const alsoAvailable = [
  {
    stage: 'stage-stone', label: '[ cap · 6-panel ]', title: 'Caps', price: 'From $24',
    render: () => (
      <div className="w-[60%] aspect-square rounded-full bg-white shadow-[0_18px_30px_rgba(17,17,17,0.10)] border border-pm-rule flex items-center justify-center">
        <Diamond className="w-12 h-12 text-pm-yellow-deep" />
      </div>
    ),
  },
  {
    stage: 'stage-sky', label: '[ pants · belted ]', title: 'Pants', price: 'From $32',
    render: () => (
      <div className="w-[36%] h-[72%] bg-white border border-pm-rule shadow-[0_18px_30px_rgba(17,17,17,0.10)] relative">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-pm-yellow" />
      </div>
    ),
  },
  {
    stage: 'stage-mint', label: '[ practice tee ]', title: 'Practice gear', price: 'From $18',
    render: () => (
      <div className="w-[58%] h-[40%] bg-pm-black shadow-[0_18px_30px_rgba(17,17,17,0.18)] flex items-center justify-center">
        <span className="font-display uppercase text-[24px] tracking-[0.04em] text-pm-yellow">Practice</span>
      </div>
    ),
  },
  {
    stage: 'stage-cream', label: '[ patch · 3" sewn ]', title: 'Patches', price: 'From $6',
    render: () => (
      <div className="w-[44%] aspect-square bg-pm-yellow border-[3px] border-pm-black flex items-center justify-center shadow-[0_18px_30px_rgba(17,17,17,0.12)]">
        <Diamond className="w-2/3 h-2/3 text-pm-black" />
      </div>
    ),
  },
];

export function ApparelPage() {
  return (
    <>
      <DiamondMarkSymbol />

      {/* Breadcrumb strip — sits above the nav on interior pages */}
      <div className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-3 flex items-baseline justify-between font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">
          <div><a href="/" className="hover:text-pm-ink">Home</a> &nbsp;/&nbsp; <span className="text-pm-ink">Apparel</span></div>
          <div className="hidden sm:block">Spring / Summer 2026 · Catalog v3</div>
        </div>
      </div>
      <Nav />

      {/* ── PAGE HEADER ── */}
      <header className="border-b border-pm-rule">

        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-20 items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Custom uniforms · Acadiana made</span>
              <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6 m-0">
                Jerseys<br />built for<br />the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span>
              </h1>
            </div>
            <div className="max-w-[420px]">
              <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] text-pm-ink">
                Pick a base, drop your wordmark, choose numbers and names. Sublimated or tackle-twill, sized YS through Adult 3XL. We send proofs the same day and ship to the dugout in seven business days.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-7">
                <a href="#catalog" className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl">
                  Browse catalog
                </a>
                <a href="#" className="font-display uppercase text-[16px] tracking-[0.04em] text-pm-black border-b-2 border-pm-black pb-0.5 hover:text-pm-yellow-deep">
                  Get a quote →
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── CATEGORY FILTER ── */}
      <section className="border-b border-pm-rule bg-white sticky top-16 z-20">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between gap-4 overflow-x-auto">
          <ul className="flex items-center gap-1 font-display uppercase text-[14px] tracking-[0.04em] whitespace-nowrap">
            {[
              { label: 'All Apparel', active: true },
              { label: 'Jerseys' },
              { label: 'Caps' },
              { label: 'Pants' },
              { label: 'Practice' },
              { label: 'Patches' },
            ].map(({ label, active }) => (
              <li key={label}>
                <a
                  href="#"
                  className={`px-4 h-9 inline-flex items-center ${
                    active ? 'bg-pm-black text-white rounded-lg' : 'text-pm-ink hover:bg-pm-paper-2 rounded-lg'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] uppercase text-pm-muted shrink-0">
            <span>Sort</span>
            <button className="inline-flex items-center gap-2 border border-pm-rule px-3 h-9 hover:border-pm-ink rounded-lg">
              Featured <span className="text-pm-muted">▾</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CATALOG GRID ── */}
      <section id="catalog" className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">Jerseys</h2>
          <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">04 styles · base price from $48</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
          {jerseyCards.map((card) => (
            <article key={card.sku} className="group flex flex-col">
              <a href="#" className={`block ${card.stage} aspect-[4/5] relative overflow-hidden rounded-xl`}>
                <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black/60 bg-white/70 px-2 py-1">
                  {card.labelText}
                </div>
                <span className={`absolute top-3 right-3 font-mono text-[10px] tracking-[0.1em] uppercase px-2 py-1 ${card.tag.className}`}>
                  {card.tag.text}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 240"
                    className="w-[64%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]"
                    aria-hidden="true"
                  >
                    <use href="#jersey" fill={card.jerseyFill} stroke={card.jerseyStroke} strokeWidth="1.2" />
                    <text x="100" y="100" textAnchor="middle" fontFamily="Anton" fontSize="28" letterSpacing="2" fill={card.wordmarkFill}>
                      {card.wordmark}
                    </text>
                    <text
                      x="100" y="170" textAnchor="middle" fontFamily="Anton" fontSize="58"
                      fill={card.numberFill}
                      stroke={card.numberStroke}
                      strokeWidth={card.numberStrokeWidth}
                    >
                      {card.number}
                    </text>
                  </svg>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">
                  <span>SKU · {card.sku}</span>
                  <span className="bg-white px-2 py-1">Hover to flip ↻</span>
                </div>
              </a>

              <div className="pt-5 flex flex-col flex-1">
                <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">{card.type}</span>
                <h3 className="font-display uppercase text-[26px] leading-[0.95] tracking-[0.005em] mt-2 text-pm-black">{card.name}</h3>
                <p className="text-[14px] leading-[1.55] text-pm-ink mt-2">{card.desc}</p>

                <div className="flex items-center gap-2 mt-4">
                  {card.swatches.map((sw) => (
                    <span
                      key={sw.title}
                      className={`w-4 h-4 rounded-full ${sw.bg}`}
                      style={(sw as { style?: React.CSSProperties }).style}
                      title={sw.title}
                    />
                  ))}
                  <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted ml-1">{card.extraColors}</span>
                </div>

                <div className="flex items-end justify-between mt-5 pt-4 border-t border-pm-rule">
                  <div>
                    <div className="font-display text-[22px] leading-none text-pm-black">
                      {card.price}<span className="text-pm-muted text-[14px]">/team min 12</span>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted mt-1">YS — Adult 3XL</div>
                  </div>
                  <a href="#" className="font-display uppercase text-[14px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow group-hover:border-pm-black transition-colors">
                    Customize →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-pm-paper-2 border-y border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-8">
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">02 / Process</div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <h2 className="font-display uppercase text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[0.005em] m-0">
                From idea to dugout in 7 days.
              </h2>
              <a href="#" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border-b-2 border-pm-yellow pb-1 hover:border-pm-black self-start">
                Full timeline →
              </a>
            </div>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((step) => (
              <li
                key={step.num}
                className={`p-6 flex flex-col border rounded-xl ${
                  step.yellow
                    ? 'bg-pm-yellow border-pm-yellow-deep'
                    : 'bg-white border-pm-rule'
                }`}
              >
                <span className={`font-display text-[44px] leading-none ${step.yellow ? 'text-pm-black' : 'text-pm-yellow-deep'}`}>
                  {step.num}
                </span>
                <h3 className="font-display uppercase text-[22px] leading-[1] tracking-[0.005em] mt-3 text-pm-black">{step.title}</h3>
                <p className={`text-[14px] leading-[1.55] mt-3 flex-1 ${step.yellow ? 'text-pm-black' : 'text-pm-ink'}`}>
                  {step.desc}
                </p>
                <span className={`font-mono text-[10px] tracking-[0.1em] uppercase mt-5 ${step.yellow ? 'text-pm-black/70' : 'text-pm-muted'}`}>
                  {step.day}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ALSO AVAILABLE ── */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">Also available</h2>
          <a href="#" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border-b-2 border-pm-yellow pb-1 hover:border-pm-black">
            Full catalog →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {alsoAvailable.map((item) => (
            <a key={item.title} href="#" className="group flex flex-col">
              <div className={`${item.stage} aspect-[4/5] relative rounded-xl overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.render()}
                </div>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted bg-white px-2 py-1">
                  {item.label}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="font-display uppercase text-[20px] leading-[1] tracking-[0.005em] text-pm-black">{item.title}</h3>
                <div className="flex items-center justify-between mt-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                  <span>{item.price}</span>
                  <span className="group-hover:text-pm-ink">Browse →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="bg-pm-yellow border-y border-pm-black">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-black/70">Ready when you are</span>
            <h2 className="font-display uppercase text-[clamp(40px,6vw,88px)] leading-[0.88] tracking-[0.005em] mt-3 text-pm-black">
              Wear it<br />on opening day.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#catalog" className="font-display uppercase text-[17px] tracking-[0.04em] bg-pm-black text-white px-7 h-12 inline-flex items-center justify-center hover:bg-pm-ink transition-colors border-b-2 border-black/40 hover:border-white rounded-xl">
              Start an order →
            </a>
            <a href="/about" className="font-display uppercase text-[17px] tracking-[0.04em] bg-transparent text-pm-black px-7 h-12 inline-flex items-center justify-center border-b-2 border-pm-black hover:bg-pm-black hover:text-pm-yellow transition-colors rounded-xl">
              Contact us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
