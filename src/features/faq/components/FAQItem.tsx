import { useId, useState } from 'react';
import { ChevronIcon } from '@/components/ui/icons';

/** One question. The answer comes into focus as it opens (`.acc-*`, components.css). */
export function FAQItem({ question, answer, defaultOpen = false }: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={open ? 'acc-item open' : 'acc-item'}>
      <h3>
        <button type="button" className="acc-q" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId}>
          {question}
          <ChevronIcon />
        </button>
      </h3>
      {/* inert while collapsed, so screen readers don't read an answer that isn't shown. */}
      <div id={panelId} className="acc-a" inert={!open}>
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
