import i18n from './translation/i18n';

const loc = () => (i18n.language === 'en' ? 'en-US' : 'tr-TR');

export const formatNumber = (n, digits = 0) =>
  new Intl.NumberFormat(loc(), { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(n) || 0);

// "₺2.340" (tr) / "₺2,340" (en) — prefix, no decimals unless the value has them.
export const formatCurrency = (n) => {
  const v = Number(n) || 0;
  return `₺${formatNumber(v, Number.isInteger(v) ? 0 : 2)}`;
};

export const formatPercent = (n) => (i18n.language === 'en' ? `${formatNumber(n)}%` : `%${formatNumber(n)}`);

export const formatCompact = (n) => {
  const v = Number(n) || 0;
  if (v < 1000) return formatNumber(v);
  const unit = i18n.language === 'en' ? 'K' : ' B';
  return `${formatNumber(v / 1000, v >= 10000 ? 0 : 1)}${unit}`;
};

export const formatDate = (d, opts = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Intl.DateTimeFormat(loc(), opts).format(new Date(d));

export const formatMonthYear = (d) => formatDate(d, { month: 'long', year: 'numeric' });

const time = (d) => new Intl.DateTimeFormat(loc(), { hour: '2-digit', minute: '2-digit' }).format(d);

export const formatRelative = (value, now = new Date()) => {
  const d = new Date(value);
  const t = i18n.t.bind(i18n);
  const dayDiff = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1) return t('time.now');
  if (dayDiff === 0) return mins < 60 ? t('time.minutesAgo', { count: mins }) : `${t('time.today')}, ${time(d)}`;
  if (dayDiff === 1) return `${t('time.yesterday')}, ${time(d)}`;
  if (dayDiff < 7) return t('time.daysAgo', { count: dayDiff });
  if (dayDiff < 30) return t('time.weeksAgo', { count: Math.floor(dayDiff / 7) });
  return formatDate(d);
};

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toLocaleUpperCase(loc()) ?? '').join('') || 'R';

export const shortName = (name = '') => {
  const p = name.trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toLocaleUpperCase(loc())}.` : p[0] || '';
};
