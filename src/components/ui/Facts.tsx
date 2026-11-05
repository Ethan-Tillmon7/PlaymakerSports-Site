interface FactsProps {
  facts: readonly { label: string; value: string }[];
  className?: string;
}

/** A quiet row of label over value. Takes the colour of its ground (`.on-night`). */
export function Facts({ facts, className }: FactsProps) {
  return (
    <dl className={['facts', className].filter(Boolean).join(' ')}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
