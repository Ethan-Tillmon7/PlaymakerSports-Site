import { ContactForm } from './ContactForm';

/**
 * The form as the one lit card on a night ground (the home hero, the Contact
 * page header). `#contact` is where every "reach out" link on those pages lands.
 */
export function ContactCard() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="card card-night on-day scroll-mt-28">
      <div className="awning" aria-hidden="true" />
      <div className="p-5 sm:p-6">
        <h2 id="contact-title" className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-pm-black">
          Let's talk about your team
        </h2>
        <ContactForm />
      </div>
    </section>
  );
}
