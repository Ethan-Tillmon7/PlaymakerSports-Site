import { Link } from 'react-router-dom';
import { teaserFaqs } from '../faqs';
import { FAQItem } from './FAQItem';

/**
 * The homepage's short FAQ list: same items and answers as /faq, the first one
 * open. The closing line points at the contact form on the home page.
 */
export function FaqTeaser() {
  return (
    <div>
      {teaserFaqs.map((faq, i) => (
        <FAQItem key={faq.question} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
      ))}
      <p className="small mt-5">
        Didn't find yours?{' '}
        <Link to={{ pathname: '/', hash: '#contact' }} className="link">
          Ask us directly.
        </Link>
      </p>
    </div>
  );
}
