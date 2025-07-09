import { DateTime } from 'luxon';

const FALLBACK = 'Etc/UTC';
const REGIONS = ['Europe','America','Asia','Africa','Australia','Pacific','Atlantic'];

const canonicalize = (s: string) =>
  s.trim()
   .split(/[\s_-]+/)
   .filter(Boolean)
   .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
   .join('_');

export const fetchTime = (city: string) => {
  const t = city?.trim();
  if (!t) return fallbackTime();

  const name = canonicalize(t);
  const candidates = REGIONS.map(r => `${r}/${name}`).concat(FALLBACK);

  for (const tz of candidates) {
    const z = DateTime.now().setZone(tz);
    if (z.isValid) return formatResult(z);
  }

  return fallbackTime();
};

const formatResult = (z: DateTime) => ({
  timezone: z.zoneName,
  datetime: z.toISO()!,
  utcOffset: z.toFormat('ZZ'),
});

const fallbackTime = () => {
  const now = DateTime.now().setZone(FALLBACK);
  return formatResult(now);
};
