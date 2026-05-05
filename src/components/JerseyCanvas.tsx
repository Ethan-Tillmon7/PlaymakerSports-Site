import { useEffect, useRef } from 'react';
import { useJerseyStore } from '../store/jerseyStore';
import jerseyFrontUrl from '../assets/templates/jersey-front.svg?raw';
import type { JerseyDesign, PlacementSlot } from '../types/jersey';

/**
 * JerseyCanvas — renders the jersey-front SVG and applies the current
 * design from the store. Subscribed to design.revision so a single
 * imperative re-render runs on every store mutation.
 *
 * Phase 0 strategy: pure DOM-driven SVG manipulation. No Fabric.js yet.
 * The brief flagged Fabric/React conflict as a known risk — we add the
 * Fabric overlay layer in Phase 2 when we actually need drag/resize on
 * placement content. For now, the SVG IS the canvas, and we mutate it
 * by id. This is simpler, faster, and zero-risk for proving the loop.
 *
 * Naming contract enforced here (must match the SVG):
 *   id="region-{base|accent|collar|sleeve-left|sleeve-right}"
 *   id="overlay-pinstripe"
 *   id="slot-{PlacementSlot}"
 */
export function JerseyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const design = useJerseyStore((s) => s.design);

  // One-time mount: drop the raw SVG markup into the container.
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = jerseyFrontUrl;
    }
  }, []);

  // Re-apply design on every revision bump.
  useEffect(() => {
    const root = containerRef.current?.querySelector('svg');
    if (!root) return;
    applyDesign(root, design);
  }, [design]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md aspect-[6/7] bg-white rounded-lg shadow-sm border border-neutral-200"
      data-revision={design.revision}
    />
  );
}

/**
 * Applies a JerseyDesign to a mounted SVG element by mutating its
 * children by id. Idempotent — safe to run on every revision bump.
 */
function applyDesign(svg: SVGElement, design: JerseyDesign): void {
  const { colors, sleeveTreatment, bodyPattern } = design;

  // ── 1. Recolor base regions ────────────────────────────────────────────
  setFill(svg, 'region-base', colors.base);
  setFill(svg, 'region-collar', colors.accent);

  // Sleeve treatment determines which color the sleeves take.
  const sleeveColor = sleeveTreatment === 'contrast' ? colors.accent : colors.base;
  setFill(svg, 'region-sleeve-left', sleeveColor);
  setFill(svg, 'region-sleeve-right', sleeveColor);

  // ── 2. Toggle pattern overlays ─────────────────────────────────────────
  setVisible(svg, 'overlay-pinstripe', bodyPattern === 'pinstripe');
  // Recolor the pinstripes themselves to follow the accent color.
  svg.querySelectorAll('#overlay-pinstripe line').forEach((line) => {
    line.setAttribute('stroke', colors.accent);
  });

  // ── 3. Render text/image content into placement slots ──────────────────
  for (const slot of [
    'jersey-front-center',
    'jersey-front-lower-left',
    'jersey-front-body-graphic',
  ] as PlacementSlot[]) {
    renderSlot(svg, slot, design);
  }
}

function setFill(svg: SVGElement, id: string, color: string): void {
  const el = svg.querySelector(`#${id}`);
  if (el) el.setAttribute('fill', color);
}

function setVisible(svg: SVGElement, id: string, visible: boolean): void {
  const el = svg.querySelector(`#${id}`) as SVGElement | null;
  if (el) el.style.display = visible ? '' : 'none';
}

/**
 * Render the content of a single placement slot. Removes any prior
 * rendered content, then inserts a fresh <text> or <image> element
 * positioned within the slot's bounds.
 */
function renderSlot(
  svg: SVGElement,
  slot: PlacementSlot,
  design: JerseyDesign,
): void {
  const slotRect = svg.querySelector(`#slot-${slot}`) as SVGRectElement | null;
  if (!slotRect) return;

  // Strip any previously-rendered content for this slot.
  const renderedId = `rendered-${slot}`;
  svg.querySelector(`#${renderedId}`)?.remove();

  const content = design.placements[slot];
  if (!content) return;

  const x = parseFloat(slotRect.getAttribute('x') || '0');
  const y = parseFloat(slotRect.getAttribute('y') || '0');
  const w = parseFloat(slotRect.getAttribute('width') || '0');
  const h = parseFloat(slotRect.getAttribute('height') || '0');

  if (content.kind === 'text' && content.text) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('id', renderedId);
    text.setAttribute('x', String(x + w / 2));
    text.setAttribute('y', String(y + h / 2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', content.fillColor || design.colors.text);
    if (content.outlineColor) {
      text.setAttribute('stroke', content.outlineColor);
      text.setAttribute('stroke-width', '2');
      text.setAttribute('paint-order', 'stroke');
    }

    // Choose font sizing & family based on the slot's role.
    const isWordmark = slot === 'jersey-front-center';
    const isBigNumber = slot === 'jersey-back-center';
    text.setAttribute('font-size', isWordmark ? '56' : isBigNumber ? '120' : '64');
    text.setAttribute(
      'font-family',
      isWordmark
        ? "'Brush Script MT', 'Lucida Handwriting', cursive"
        : "'Oswald', 'Barlow Condensed', Impact, sans-serif",
    );
    text.setAttribute('font-weight', '700');
    if (isWordmark) {
      text.setAttribute('font-style', 'italic');
    }

    text.textContent = content.text;
    slotRect.parentNode?.appendChild(text);
  } else if (content.kind === 'image' && content.imageUrl) {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('id', renderedId);
    img.setAttribute('x', String(x));
    img.setAttribute('y', String(y));
    img.setAttribute('width', String(w));
    img.setAttribute('height', String(h));
    img.setAttribute('href', content.imageUrl);
    img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    slotRect.parentNode?.appendChild(img);
  }
}
