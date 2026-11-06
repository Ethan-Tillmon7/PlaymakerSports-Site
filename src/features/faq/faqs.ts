export const FAQ_GROUPS = [
  {
    topic: 'Events',
    faqs: [
      {
        question: 'What happens if there is severe weather at a tournament?',
        answer: 'If there is severe weather or heavy rain during the tournament weekend, there is a possibility we may not be able to attend. Outside of weather-related circumstances, we fully plan on being at every event we commit to.',
      },
      {
        question: 'What is your refund policy?',
        answer: 'Card purchases are refunded directly through the Square app. Cash purchases can be refunded in cash, Venmo, Zelle, or Cash App.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'Square is our preferred option. We also accept cash, Cash App, Venmo, and Zelle.',
      },
    ],
  },
  {
    topic: 'Apparel',
    faqs: [
      {
        question: 'What does Playmaker Sports sell?',
        answer: 'We carry jerseys, sliding mitts, arm sleeves, sunglasses, chains and necklaces, eye black, cooling towels, hats, batting gloves and other sport accessories.',
      },
      {
        question: 'Can you make custom jerseys for my team?',
        answer: "Yes — we are capable of filling custom jersey orders. If you can dream it we can create it. Send us your inspiration photos or mockups and we'll work with you from there.",
      },
      {
        question: 'How do I place an apparel order?',
        answer: 'Browse the catalog on our Apparel page and reach out through the contact form. We send a digital proof same-day.',
      },
      {
        question: 'Can I upload my own logo or artwork?',
        answer: "Absolutely. We accept AI, EPS, PDF, or high-res PNG files. If you only have a phone photo, we'll work with it.",
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Shipping is free on orders over $100; customers pay shipping under that.',
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.faqs);


// The three the homepage shows, in this order. Looked up by question so the
// answer text has one home; a reworded question fails the build here instead of
// silently dropping off the homepage.
export const TEASER_FAQS = [
  'Can you make custom jerseys for my team?',
  'How do I place an apparel order?',
  'What happens if there is severe weather at a tournament?',
].map((question) => {
  const faq = ALL_FAQS.find((f) => f.question === question);
  if (!faq) throw new Error(`TEASER_FAQS: no FAQ titled "${question}"`);
  return faq;
});
