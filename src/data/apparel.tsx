import type { CSSProperties, ReactElement } from 'react';
import { Diamond } from '../components/layout/DiamondMark';

export interface Swatch {
  bg: string;
  title: string;
  style?: CSSProperties;
}

export interface JerseyCard {
  stage: string;
  tag: { text: string; className: string };
  sku: string;
  labelText: string;
  jerseyFill: string;
  jerseyStroke: string;
  wordmark: string;
  wordmarkFill: string;
  number: string;
  numberFill: string;
  numberStroke?: string;
  numberStrokeWidth?: string;
  type: string;
  name: string;
  desc: string;
  swatches: Swatch[];
  extraColors: string;
  price: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
  day: string;
  yellow: boolean;
}

export interface AlsoAvailableItem {
  stage: string;
  label: string;
  title: string;
  price: string;
  render: () => ReactElement;
}

export const jerseyCards: JerseyCard[] = [
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

export const processSteps: ProcessStep[] = [
  { num: '01', title: 'Pick a base', desc: 'Sublimated, tackle-twill, throwback, or button-front. Four cuts, four price points.', day: 'Day 1', yellow: false },
  { num: '02', title: 'Drop your art', desc: "Wordmark, logo, sponsors. We'll vector it for free if you've only got a phone photo.", day: 'Day 1', yellow: false },
  { num: '03', title: 'Approve proof', desc: 'Same-day digital proof. Two free revisions. Sign off and we send it to print.', day: 'Day 2', yellow: false },
  { num: '04', title: 'Ship to field', desc: 'Direct to the dugout in seven business days. Local Lafayette delivery available.', day: 'Day 7', yellow: true },
];

export const alsoAvailable: AlsoAvailableItem[] = [
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

export const JERSEY_STYLE_OPTIONS = jerseyCards.map((c) => c.name);
// ['The Slugger', 'The Signal', 'The Captain', 'The Acadian']

export const JERSEY_SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL', 'A2XL', 'A3XL'] as const;
export type JerseySize = (typeof JERSEY_SIZES)[number];
