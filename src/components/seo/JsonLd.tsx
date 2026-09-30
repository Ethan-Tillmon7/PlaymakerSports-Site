interface JsonLdProps {
  data: Record<string, unknown>;
}

function safeJsonStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // safeJsonStringify escapes <, >, & to prevent any HTML injection
      // even though all data comes from controlled application sources
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
    />
  );
}
