import type { ContactSubmission } from '../../shared/contact';

/**
 * The two contact form emails: the auto-reply to the submitter and the notice to
 * the team. Each comes back as `{ subject, html, text }` for `resend.emails.send`.
 * Building only; nothing here sends. Every typed value in the notice goes through
 * `esc()`, and the auto-reply carries nothing typed at all.
 */
export type ContactEmail = { subject: string; html: string; text: string };

// Mirrors SITE_URL in src/config/site.ts; functions can't import from src/.
const SITE_URL = 'https://playmakersports.co';
const APPAREL_URL = `${SITE_URL}/apparel`;

// Served as-is from public/email/. Logo is 400x156 and the photo 1200x784 (2x).
const LOGO_URL = `${SITE_URL}/email/logo.png`;
const PHOTO_URL = `${SITE_URL}/email/tent-team.jpg`;
// The auto-reply's yellow button, drawn as a picture (561x150, 3x). See pictureButton().
const GEAR_BUTTON_URL = `${SITE_URL}/email/browse-our-gear-button.png`;
const GEAR_BUTTON = { width: 187, height: 50 };
const LOGO_RATIO = 156 / 400;
const PHOTO_RATIO = 784 / 1200;
const PHOTO_ALT = 'A youth team holding up jerseys in front of the Playmaker Sports tents';

const AUTOREPLY_SUBJECT = 'Thanks for reaching out to Playmaker Sports';
const REPLY_SUBJECT = 'Re: your message to Playmaker Sports';

// Longest message the notice carries, so a huge paste can't push it past Gmail's clipping size.
const MESSAGE_LIMIT = 8000;

const C = {
  page: '#f2f2f7',
  card: '#ffffff',
  ink: '#141414',
  sub: '#5c5c61',
  hair: '#e5e5ea',
  quote: '#f2f2f7',
  yellow: '#ffd82c',
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Trimmed, with control and invisible formatting characters removed, cut at `max`. */
function clean(value: string | undefined, max = 500): string {
  if (value == null) return '';
  let s = value
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069\ufeff]/g, '')
    .trim();
  if (s.length > max) s = s.slice(0, max).trimEnd() + '\u2026';
  return s;
}

/** One line: every run of whitespace, line breaks included, becomes one space. */
const oneLine = (value: string | undefined, max?: number) => clean(value, max).replace(/\s+/g, ' ').trim();

/** Capitalises a word typed all lower or all upper case; mixed case is left alone. */
function tidyWord(word: string): string {
  const lower = word.toLowerCase();
  if (word !== lower && word !== word.toUpperCase()) return word.charAt(0).toUpperCase() + word.slice(1);
  return lower.replace(/(^|['\u2019-])(\p{L})/gu, (_m, lead: string, ch: string) => lead + ch.toUpperCase());
}

/** "hudson smith" becomes "Hudson Smith". */
const tidyName = (value: string | undefined, max = 80) => oneLine(value, max).split(' ').filter(Boolean).map(tidyWord).join(' ');

/** The first name for the Reply button, or '' when it doesn't look like one. */
function safeFirstName(value: string | undefined): string {
  const first = oneLine(value, 200).split(' ')[0] || '';
  if (first.length < 2 || first.length > 20) return '';
  if (!/^\p{L}(?:[\p{L}'\u2019-]*\p{L})?$/u.test(first)) return '';
  return tidyWord(first);
}

/** A plain looking address for mailto links, or ''. */
function validEmail(value: string): string {
  return /^[^\s@<>"'(),;:\\[\]]+@[^\s@<>"'(),;:\\[\]]+\.[^\s@<>"'(),;:\\[\]]+$/.test(value) ? value : '';
}

/** A US number becomes `(337) 555-0142` with a `+13375550142` tel link; anything else shows as typed. */
function formatPhone(value: string | undefined): { display: string; tel: string } | null {
  const typed = oneLine(value, 40);
  if (!typed) return null;
  if (/^[\d\s().+-]+$/.test(typed) && !(typed.startsWith('+') && !typed.startsWith('+1'))) {
    let digits = typed.replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
    if (digits.length === 10 && /^[2-9]\d{2}[2-9]/.test(digits)) {
      return { display: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`, tel: '+1' + digits };
    }
  }
  return { display: typed, tel: '' };
}

/** An ISO timestamp as "Mon, Nov 23, 12:18 PM Central", or as given if it can't be read. */
function formatTime(value: string): string {
  const date = new Date(value);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) || isNaN(date.getTime())) return oneLine(value, 80);
  const parts: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).formatToParts(date)) parts[p.type] = p.value;
  return `${parts.weekday}, ${parts.month} ${parts.day}, ${parts.hour}:${parts.minute} ${(parts.dayPeriod ?? '').toUpperCase()} Central`;
}

/** Plain text wrapped at `width`, keeping long words (links) whole. */
function wrap(paragraph: string, width = 72): string {
  const out: string[] = [];
  for (const line of paragraph.split('\n')) {
    let cur = '';
    for (const w of line.split(/ +/)) {
      if (!cur) cur = w;
      else if ((cur + ' ' + w).length <= width) cur += ' ' + w;
      else { out.push(cur); cur = w; }
    }
    out.push(cur);
  }
  return out.join('\n');
}

// ── Shared pieces ──

// Light/dark rules for the clients that read a <style> block. Every colour is also
// inline, so a client that drops this block still gets the light version.
const STYLE = `<style>
:root { color-scheme: light dark; supported-color-schemes: light dark; }
a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
@media only screen and (max-width: 600px) {
  .pm-outer { padding: 16px 16px 24px !important; }
  .pm-card { width: 100% !important; }
  .pm-pad { padding: 28px 22px !important; }
  .pm-h1 { font-size: 24px !important; line-height: 30px !important; }
}
@media (prefers-color-scheme: dark) {
  body, .pm-page, .pm-outer { background: #000000 !important; }
  .pm-card { background: #1c1c1e !important; }
  .pm-ink { color: #f2f2f7 !important; }
  .pm-sub { color: #aeaeb2 !important; }
  .pm-link { color: #f2f2f7 !important; }
  .pm-hair { border-color: #3a3a3c !important; }
  .pm-quote, .pm-chip { background: #2c2c2e !important; }
  .pm-btn-td { background: ${C.yellow} !important; }
  .pm-btn { color: #141414 !important; }
  .pm-logo { color: #f2f2f7 !important; }
  .pm-btn-alt { color: #f2f2f7 !important; }
}
[data-ogsc] .pm-ink, [data-ogsc] .pm-link, [data-ogsc] .pm-logo { color: #f2f2f7 !important; }
[data-ogsc] .pm-sub { color: #aeaeb2 !important; }
[data-ogsb] .pm-page, [data-ogsb] .pm-outer { background: #000000 !important; }
[data-ogsb] .pm-card { background: #1c1c1e !important; }
[data-ogsb] .pm-quote, [data-ogsb] .pm-chip { background: #2c2c2e !important; }
[data-ogsc] .pm-btn { color: #141414 !important; }
[data-ogsc] .pm-btn-alt { color: #f2f2f7 !important; }
</style>`;

// Only the auto-reply carries the photo.
const PHOTO_RULES = `@media (prefers-color-scheme: dark) { .pm-photo { background: #2c2c2e !important; color: #aeaeb2 !important; } }
[data-ogsb] .pm-photo { background: #2c2c2e !important; }
`;

/** The hidden inbox preview line, padded so the inbox doesn't pull body text in after it. */
const preheader = (text: string) =>
  `<div class="pm-pre" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${C.page}">${esc(text)}${'&#847;&zwnj;&nbsp;'.repeat(40)}</div>`;

function documentShell({ title, pre, card, footer }: { title: string; pre: string; card: string; footer: string }): string {
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(title)}</title>
${card.includes('class="pm-photo') ? STYLE.replace('</style>', PHOTO_RULES + '</style>') : STYLE}
</head>
<body class="pm-page" style="margin:0;padding:0;width:100%;background:${C.page};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
${preheader(pre)}
<table role="presentation" class="pm-page" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="width:100%;background:${C.page};border-collapse:collapse">
<tr><td class="pm-outer" align="center" style="padding:24px 16px 32px;background:${C.page}">
<table role="presentation" class="pm-card" width="560" border="0" cellpadding="0" cellspacing="0" bgcolor="${C.card}" style="width:100%;max-width:560px;background:${C.card};border-radius:14px;border-collapse:separate">
<tr><td class="pm-pad" style="padding:32px 32px 32px;font-family:${FONT};text-align:left">
${card}
</td></tr>
</table>
<table role="presentation" width="560" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;border-collapse:collapse">
<tr><td align="center" style="padding:20px 16px 0;font-family:${FONT};font-size:13px;line-height:19px;color:${C.sub};text-align:center" class="pm-sub">
${footer}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

function logo(width: number, align: 'center' | 'left'): string {
  const height = Math.round(width * LOGO_RATIO);
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
<tr><td align="${align}" style="padding:0;text-align:${align}"><img class="pm-logo" src="${esc(LOGO_URL)}" width="${width}" height="${height}" alt="Playmaker Sports" style="display:block;${align === 'center' ? 'margin:0 auto;' : ''}width:${width}px;height:${height}px;max-width:100%;border:0;outline:none;text-decoration:none;font-family:${FONT};font-size:16px;line-height:20px;font-weight:800;letter-spacing:-0.3px;color:${C.ink}"></td></tr>
</table>`;
}

/**
 * A painted yellow button: a table cell with bgcolor, so Outlook for Windows draws it too.
 * Only the notice uses it, because "Reply to <name>" changes per person and so can't be a
 * picture. In the Gmail phone apps' dark mode it turns a darker yellow but stays readable;
 * that is accepted, since only the team gets the notice.
 */
function button(label: string, href: string, { full = false } = {}): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" ${full ? 'width="100%" ' : ''}style="border-collapse:separate;margin:0 auto${full ? ';width:100%' : ''}">
<tr><td class="pm-btn-td" align="center" bgcolor="${C.yellow}" height="50" style="height:50px;border-radius:14px;background:${C.yellow};mso-padding-alt:0 28px">
<a class="pm-btn" href="${esc(href)}" target="_blank" style="display:block;padding:0 28px;font-family:${FONT};font-size:17px;line-height:50px;mso-line-height-rule:exactly;font-weight:700;color:#141414;text-decoration:none;text-align:center;border-radius:14px;white-space:nowrap">${esc(label)}</a>
</td></tr>
</table>`;
}

/**
 * A yellow button drawn as a picture, for words that never change. The Gmail phone
 * apps and the Outlook family ignore the dark rules above and recolour every painted
 * colour, so a painted yellow turns brown there; they never recolour a picture.
 * Nothing is painted behind it, so with pictures off it is just the bold alt words,
 * still the link (a yellow cell there would go brown again in Outlook's dark mode).
 */
function pictureButton(label: string, href: string, src: string, { width, height }: { width: number; height: number }): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse:collapse;margin:0 auto">
<tr><td align="center" style="padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly">
<a class="pm-btn" href="${esc(href)}" target="_blank" style="display:inline-block;vertical-align:top;font-family:${FONT};font-size:17px;line-height:22px;font-weight:700;color:${C.ink};text-decoration:none"><img class="pm-btn-alt" src="${esc(src)}" width="${width}" height="${height}" alt="${esc(label)}" style="display:block;width:${width}px;height:${height}px;border:0;outline:none;text-decoration:none;font-family:${FONT};font-size:17px;line-height:22px;font-weight:700;color:${C.ink};text-align:center"></a>
</td></tr>
</table>`;
}

/**
 * The tent photo inside the card, linked to the apparel page. It scales down on a
 * phone and keeps its pixel width in Outlook; with images blocked, the grey slot
 * shows the alt text.
 */
function photo(width: number, radius: string): string {
  const height = Math.round(width * PHOTO_RATIO);
  return `<td class="pm-photo" bgcolor="${C.hair}" style="padding:0;border-radius:${radius};background:${C.hair};font-size:0;line-height:0;mso-line-height-rule:exactly">`
    + `<a href="${APPAREL_URL}" target="_blank" style="display:block;border:0;text-decoration:none">`
    + `<img class="pm-photo" src="${esc(PHOTO_URL)}" width="${width}" height="${height}" alt="${esc(PHOTO_ALT)}" style="display:block;width:100%;max-width:${width}px;height:auto;border:0;outline:none;text-decoration:none;border-radius:${radius};background:${C.hair};font-family:${FONT};font-size:14px;line-height:20px;color:${C.sub};text-align:center">`
    + `</a></td>`;
}

// ── Auto-reply ──

// The auto-reply goes to whatever address the submitter typed, so it is fully static:
// nothing from the submission (name, message) is reflected back to that address.
// That is why it takes no arguments.
export function renderThanks(): ContactEmail {
  const headline = 'Thanks for reaching out.';
  const body = 'We got your message, and a person from our team will get back to you soon. Need to add something? Just reply to this email.';
  const pre = 'We got your message. A person from our team will reply soon.';
  const note = 'You are getting this because you sent us a message on playmakersports.co.';

  const card = `${logo(200, 'center')}
<h1 class="pm-ink pm-h1" style="font-family:${FONT};font-size:26px;line-height:32px;font-weight:700;letter-spacing:-0.4px;color:${C.ink};margin:28px 0 12px;text-align:center">${esc(headline)}</h1>
<p class="pm-ink" style="font-family:${FONT};font-size:16px;line-height:24px;color:${C.ink};margin:0;text-align:center">${esc(body)}</p>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:24px 0 0"><tr>${photo(496, '16px')}</tr></table>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:24px 0 4px" align="center">
${pictureButton('Browse our gear', APPAREL_URL, GEAR_BUTTON_URL, GEAR_BUTTON)}
</td></tr></table>`;

  const footer = `<span class="pm-ink" style="color:${C.ink};font-weight:600">Playmaker Sports</span><br>
<a class="pm-sub" href="${SITE_URL}" target="_blank" style="color:${C.sub};text-decoration:underline">playmakersports.co</a><br>
<span style="display:inline-block;padding-top:8px">${note}</span>`;

  const text = [headline, '', wrap(body), '', 'Browse our gear:', APPAREL_URL, '', 'Playmaker Sports', SITE_URL, '', wrap(note), ''].join('\n');

  return { subject: AUTOREPLY_SUBJECT, html: documentShell({ title: AUTOREPLY_SUBJECT, pre, card, footer }), text };
}

// ── Team notice ──

/** The notice to the team, built to be read and answered from a phone. `submittedAt` is an ISO timestamp. */
export function renderNotice(data: ContactSubmission, submittedAt: string): ContactEmail {
  const name = tidyName(data.name, 80);
  const role = data.role;
  const email = oneLine(data.email, 254);
  const goodEmail = validEmail(email);
  const phone = formatPhone(data.phone);
  const event = oneLine(data.event_name, 200);
  const when = formatTime(submittedAt);
  const first = safeFirstName(data.name);

  let message = clean(data.message, Number.MAX_SAFE_INTEGER);
  let trimmedNote = '';
  if (message.length > MESSAGE_LIMIT) {
    trimmedNote = `Message cut short after ${MESSAGE_LIMIT.toLocaleString('en-US')} characters. It was ${message.length.toLocaleString('en-US')} long.`;
    message = message.slice(0, MESSAGE_LIMIT).trimEnd() + '\u2026';
  }

  // One line, so a typed name can't add header lines.
  const subject = oneLine(`New contact: ${role}, ${name || goodEmail || email}`, 160);

  const flat = message.replace(/\s+/g, ' ').trim();
  const pre = flat ? (flat.length > 90 ? flat.slice(0, 90).replace(/\s+\S*$/, '') + '\u2026' : flat) : `${role}, no message written.`;

  const headline = name || 'Name not given';
  const replyHref = goodEmail ? `mailto:${goodEmail}?subject=${encodeURIComponent(REPLY_SUBJECT)}` : '';

  const link = (href: string, label: string) =>
    `<a class="pm-link" href="${esc(href)}" style="color:${C.ink};text-decoration:underline">${esc(label)}</a>`;
  const rows: [string, string][] = [['Email', goodEmail ? link(`mailto:${goodEmail}`, goodEmail) : esc(email)]];
  if (phone) rows.push(['Phone', phone.tel ? link(`tel:${phone.tel}`, phone.display) : esc(phone.display)]);
  if (event) rows.push(['Event', esc(event)]);

  const rowCell = (last: boolean) => `border-top:1px solid ${C.hair};${last ? `border-bottom:1px solid ${C.hair};` : ''}font-family:${FONT};`;
  const rowsHtml = `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px 0 0">
${rows.map(([label, value], i) => `<tr>
<td class="pm-sub pm-hair" valign="top" width="72" style="width:72px;padding:13px 12px 13px 0;${rowCell(i === rows.length - 1)}font-size:15px;line-height:22px;color:${C.sub}">${label}</td>
<td class="pm-ink pm-hair" valign="top" align="right" style="padding:13px 0;${rowCell(i === rows.length - 1)}font-size:16px;line-height:22px;color:${C.ink};text-align:right;word-break:break-word;overflow-wrap:anywhere">${value}</td>
</tr>`).join('\n')}
</table>`;

  const actions: string[] = [];
  if (replyHref) {
    actions.push(`<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:28px 0 0">
${button(first ? `Reply to ${first}` : 'Reply by email', replyHref, { full: true })}
</td></tr></table>`);
  }
  if (phone?.tel) {
    actions.push(`<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td align="center" style="padding:${replyHref ? '6' : '24'}px 0 0;text-align:center">
<a class="pm-link" href="tel:${esc(phone.tel)}" style="display:inline-block;padding:0 12px;font-family:${FONT};font-size:16px;line-height:44px;font-weight:600;color:${C.ink};text-decoration:underline">Call ${esc(phone.display)}</a>
</td></tr></table>`);
  }

  const messageHtml = message
    ? esc(message).replace(/\n/g, '<br>')
    : `<span class="pm-sub" style="color:${C.sub}">No message written.</span>`;

  const card = `${logo(132, 'left')}
<p class="pm-sub" style="font-family:${FONT};font-size:13px;line-height:18px;font-weight:600;letter-spacing:0.2px;color:${C.sub};margin:24px 0 4px;text-transform:uppercase">New contact</p>
<h1 class="pm-ink pm-h1" style="font-family:${FONT};font-size:26px;line-height:32px;font-weight:700;letter-spacing:-0.4px;color:${C.ink};margin:0;word-break:break-word">${esc(headline)}</h1>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:10px 0 0"><tr><td class="pm-chip pm-sub" bgcolor="${C.quote}" style="background:${C.quote};border-radius:8px;padding:4px 10px;font-family:${FONT};font-size:13px;line-height:18px;font-weight:600;color:${C.sub}">${esc(role)}</td></tr></table>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:20px 0 0"><tr><td class="pm-quote pm-ink" bgcolor="${C.quote}" style="background:${C.quote};border-radius:12px;padding:16px 18px;font-family:${FONT};font-size:16px;line-height:24px;color:${C.ink};word-break:break-word;overflow-wrap:anywhere">${messageHtml}${trimmedNote ? `<br><br><span class="pm-sub" style="font-size:13px;line-height:18px;color:${C.sub}">${esc(trimmedNote)}</span>` : ''}</td></tr></table>
${rowsHtml}
${actions.join('\n')}`;

  const footer = `From the contact form on playmakersports.co${when ? `<br>${esc(when)}` : ''}`;

  const text = [
    `New contact: ${headline} (${role})`,
    '',
    'Message:',
    message ? wrap(message) : 'No message written.',
    ...(trimmedNote ? ['', trimmedNote] : []),
    '',
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone.display}`] : []),
    ...(event ? [`Event: ${event}`] : []),
    '',
    ...(goodEmail ? ['Reply by email:', `mailto:${goodEmail}`, ''] : []),
    ...(phone?.tel ? ['Call:', `tel:${phone.tel}`, ''] : []),
    wrap(`From the contact form on playmakersports.co${when ? `, ${when}` : ''}.`),
    '',
  ].join('\n');

  return { subject, html: documentShell({ title: subject, pre, card, footer }), text };
}
