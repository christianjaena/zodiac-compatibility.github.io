'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Body,
  DEG2RAD,
  Ecliptic,
  EclipticGeoMoon,
  GeoVector,
  MakeTime,
  RAD2DEG,
  SiderealTime,
  SunPosition,
  e_tilt
} from 'astronomy-engine';

type ZodiacChart = {
  symbol: string;
  sign: string;
  matches: string[];
};

type BirthChartResult = {
  sun: string;
  moon: string;
  rising: string;
  venus: string;
};

type GeoLocation = {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

type BirthChartCompatibilityResult = {
  chartOne: BirthChartResult;
  chartTwo: BirthChartResult;
  percentage: number;
  level: string;
  barToneClass: string;
  strengths: string;
  weaknesses: string;
};

const compatibilityChart: ZodiacChart[] = [
  {
    symbol: '♈',
    sign: 'Aries',
    matches: [
      'Leo',
      'Sagittarius',
      'Gemini',
      'Aquarius',
      'Libra',
      'Aries',
      'Scorpio',
      'Pisces',
      'Taurus',
      'Capricorn',
      'Virgo',
      'Cancer'
    ]
  },
  {
    symbol: '♉',
    sign: 'Taurus',
    matches: [
      'Virgo',
      'Capricorn',
      'Cancer',
      'Pisces',
      'Taurus',
      'Scorpio',
      'Libra',
      'Aries',
      'Leo',
      'Aquarius',
      'Gemini',
      'Sagittarius'
    ]
  },
  {
    symbol: '♊',
    sign: 'Gemini',
    matches: [
      'Libra',
      'Aquarius',
      'Aries',
      'Leo',
      'Gemini',
      'Sagittarius',
      'Pisces',
      'Virgo',
      'Taurus',
      'Capricorn',
      'Scorpio',
      'Cancer'
    ]
  },
  {
    symbol: '♋',
    sign: 'Cancer',
    matches: [
      'Scorpio',
      'Pisces',
      'Taurus',
      'Virgo',
      'Cancer',
      'Capricorn',
      'Libra',
      'Leo',
      'Gemini',
      'Aquarius',
      'Aries',
      'Sagittarius'
    ]
  },
  {
    symbol: '♌',
    sign: 'Leo',
    matches: [
      'Aries',
      'Sagittarius',
      'Libra',
      'Gemini',
      'Leo',
      'Aquarius',
      'Scorpio',
      'Pisces',
      'Taurus',
      'Virgo',
      'Capricorn',
      'Cancer'
    ]
  },
  {
    symbol: '♍',
    sign: 'Virgo',
    matches: [
      'Taurus',
      'Capricorn',
      'Cancer',
      'Scorpio',
      'Virgo',
      'Pisces',
      'Libra',
      'Leo',
      'Gemini',
      'Aquarius',
      'Aries',
      'Sagittarius'
    ]
  },
  {
    symbol: '♎',
    sign: 'Libra',
    matches: [
      'Gemini',
      'Aquarius',
      'Leo',
      'Sagittarius',
      'Libra',
      'Aries',
      'Taurus',
      'Pisces',
      'Virgo',
      'Capricorn',
      'Scorpio',
      'Cancer'
    ]
  },
  {
    symbol: '♏',
    sign: 'Scorpio',
    matches: [
      'Cancer',
      'Pisces',
      'Virgo',
      'Capricorn',
      'Scorpio',
      'Taurus',
      'Libra',
      'Leo',
      'Aquarius',
      'Gemini',
      'Aries',
      'Sagittarius'
    ]
  },
  {
    symbol: '♐',
    sign: 'Sagittarius',
    matches: [
      'Aries',
      'Leo',
      'Aquarius',
      'Libra',
      'Sagittarius',
      'Gemini',
      'Pisces',
      'Scorpio',
      'Taurus',
      'Cancer',
      'Virgo',
      'Capricorn'
    ]
  },
  {
    symbol: '♑',
    sign: 'Capricorn',
    matches: [
      'Taurus',
      'Virgo',
      'Scorpio',
      'Pisces',
      'Capricorn',
      'Cancer',
      'Libra',
      'Aries',
      'Leo',
      'Sagittarius',
      'Aquarius',
      'Gemini'
    ]
  },
  {
    symbol: '♒',
    sign: 'Aquarius',
    matches: [
      'Gemini',
      'Libra',
      'Sagittarius',
      'Aries',
      'Aquarius',
      'Leo',
      'Capricorn',
      'Pisces',
      'Virgo',
      'Taurus',
      'Scorpio',
      'Cancer'
    ]
  },
  {
    symbol: '♓',
    sign: 'Pisces',
    matches: [
      'Cancer',
      'Scorpio',
      'Taurus',
      'Capricorn',
      'Pisces',
      'Virgo',
      'Libra',
      'Sagittarius',
      'Leo',
      'Aquarius',
      'Aries',
      'Gemini'
    ]
  }
];

const zodiacDateRanges: Record<string, string> = {
  Aries: 'Mar 21 – Apr 19',
  Taurus: 'Apr 20 – May 20',
  Gemini: 'May 21 – Jun 20',
  Cancer: 'Jun 21 – Jul 22',
  Leo: 'Jul 23 – Aug 22',
  Virgo: 'Aug 23 – Sep 22',
  Libra: 'Sep 23 – Oct 22',
  Scorpio: 'Oct 23 – Nov 21',
  Sagittarius: 'Nov 22 – Dec 21',
  Capricorn: 'Dec 22 – Jan 19',
  Aquarius: 'Jan 20 – Feb 18',
  Pisces: 'Feb 19 – Mar 20'
};

const zodiacSigns = compatibilityChart.map((entry) => entry.sign);
const zodiacSymbolBySign = compatibilityChart.reduce<Record<string, string>>(
  (accumulator, entry) => {
    accumulator[entry.sign] = entry.symbol;
    return accumulator;
  },
  {}
);

const zodiacElementBySign: Record<string, string> = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water'
};

const geocodePlace = async (place: string): Promise<GeoLocation | null> => {
  const query = place.trim();

  if (!query) {
    return null;
  }

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error('Unable to geocode this place');
  }

  const data = (await response.json()) as {
    results?: Array<{
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }>;
  };

  const topResult = data.results?.[0];
  if (!topResult) {
    return null;
  }

  return {
    displayName: [topResult.name, topResult.admin1, topResult.country]
      .filter(Boolean)
      .join(', '),
    latitude: topResult.latitude,
    longitude: topResult.longitude,
    timezone: topResult.timezone ?? 'UTC'
  };
};

const useGeocodedPlace = (place: string) => {
  const placeQuery = place.trim();
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  useEffect(() => {
    if (!placeQuery) {
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      setStatus('loading');

      try {
        const geocoded = await geocodePlace(placeQuery);
        if (!isActive) {
          return;
        }

        setLocation(geocoded);
        setStatus(geocoded ? 'success' : 'error');
      } catch {
        if (!isActive) {
          return;
        }

        setLocation(null);
        setStatus('error');
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [placeQuery]);

  if (!placeQuery) {
    return { location: null, status: 'idle' as const };
  }

  return { location, status };
};

const rankToPercent = (rank: number) => {
  return Math.round(((13 - rank) / 12) * 100);
};

const getRelationshipStrength = (averageRank: number, rankGap: number) => {
  if (averageRank <= 3 && rankGap <= 2) {
    return 'Strong two-way attraction with naturally aligned energy and communication.';
  }

  if (averageRank <= 6) {
    return 'Solid potential for a steady bond, with good room for teamwork and trust.';
  }

  if (averageRank <= 9) {
    return "The relationship can work well when both focus on understanding each other's differences.";
  }

  return 'Growth potential is high if both people are intentional, patient, and willing to adapt.';
};

const getRelationshipWeakness = (averageRank: number, rankGap: number) => {
  if (rankGap >= 5) {
    return 'One-sided expectations may appear, so balance and clear communication are essential.';
  }

  if (averageRank <= 3) {
    return 'Strong chemistry may also bring intensity, which can lead to friction during conflict.';
  }

  if (averageRank <= 6) {
    return 'Differences in pace or emotional style may require consistent compromise.';
  }

  if (averageRank <= 9) {
    return 'Misunderstandings can build up if needs and boundaries are not discussed early.';
  }

  return 'Core personality differences can feel draining unless both invest in long-term adjustment.';
};

const getCompatibilityLevel = (percentage: number) => {
  if (percentage >= 85) {
    return {
      label: 'Exceptional',
      barToneClass: 'bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500'
    };
  }

  if (percentage >= 70) {
    return {
      label: 'Strong',
      barToneClass: 'bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500'
    };
  }

  if (percentage >= 50) {
    return {
      label: 'Balanced',
      barToneClass: 'bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500'
    };
  }

  if (percentage >= 35) {
    return {
      label: 'Mixed',
      barToneClass: 'bg-linear-to-r from-amber-400 via-orange-500 to-rose-500'
    };
  }

  return {
    label: 'Challenging',
    barToneClass: 'bg-linear-to-r from-rose-500 via-red-500 to-orange-500'
  };
};

const parseDateParts = (dateValue: string) => {
  const [yearValue, monthValue, dayValue] = dateValue.split('-').map(Number);

  if (!yearValue || !monthValue || !dayValue) {
    return null;
  }

  return { year: yearValue, month: monthValue, day: dayValue };
};

const parseTimeParts = (timeValue: string) => {
  const [hourValue, minuteValue] = timeValue.split(':').map(Number);

  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return null;
  }

  return { hour: hourValue, minute: minuteValue };
};

const normalizeDegrees = (degrees: number) => {
  const modded = degrees % 360;
  return modded < 0 ? modded + 360 : modded;
};

const signFromLongitude = (longitude: number) => {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30) % 12;
  return zodiacSigns[signIndex];
};

const getTimeZoneOffsetMillis = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(date);
  const values = parts.reduce<Record<string, string>>((accumulator, part) => {
    if (part.type !== 'literal') {
      accumulator[part.type] = part.value;
    }
    return accumulator;
  }, {});

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return asUtc - date.getTime();
};

const zonedDateTimeToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) => {
  let utcMillis = Date.UTC(year, month - 1, day, hour, minute, 0);

  for (let index = 0; index < 3; index += 1) {
    const offset = getTimeZoneOffsetMillis(new Date(utcMillis), timeZone);
    utcMillis = Date.UTC(year, month - 1, day, hour, minute, 0) - offset;
  }

  return new Date(utcMillis);
};

const buildBirthChart = (
  birthDate: string,
  birthTime: string,
  birthLocation: GeoLocation | null
): BirthChartResult | null => {
  const dateParts = parseDateParts(birthDate);
  const timeParts = parseTimeParts(birthTime);

  if (!dateParts || !timeParts || !birthLocation) {
    return null;
  }

  const { year, month, day } = dateParts;
  const { hour, minute } = timeParts;
  const utcDate = zonedDateTimeToUtc(
    year,
    month,
    day,
    hour,
    minute,
    birthLocation.timezone
  );
  const astroTime = MakeTime(utcDate);

  const sunLongitude = normalizeDegrees(SunPosition(astroTime).elon);
  const moonLongitude = normalizeDegrees(EclipticGeoMoon(astroTime).lon);
  const venusLongitude = normalizeDegrees(
    Ecliptic(GeoVector(Body.Venus, astroTime, true)).elon
  );

  const trueObliquityRad = e_tilt(astroTime).tobl * DEG2RAD;
  const latitudeRad = birthLocation.latitude * DEG2RAD;
  const localSiderealDegrees = normalizeDegrees(
    SiderealTime(astroTime) * 15 + birthLocation.longitude
  );
  const localSiderealRad = localSiderealDegrees * DEG2RAD;

  const ascendantLongitude = normalizeDegrees(
    Math.atan2(
      -Math.cos(localSiderealRad),
      Math.sin(localSiderealRad) * Math.cos(trueObliquityRad) +
        Math.tan(latitudeRad) * Math.sin(trueObliquityRad)
    ) *
      RAD2DEG +
      180
  );

  return {
    sun: signFromLongitude(sunLongitude),
    moon: signFromLongitude(moonLongitude),
    rising: signFromLongitude(ascendantLongitude),
    venus: signFromLongitude(venusLongitude)
  };
};

const elementScore = (leftSign: string, rightSign: string) => {
  const leftElement = zodiacElementBySign[leftSign];
  const rightElement = zodiacElementBySign[rightSign];

  if (leftElement === rightElement) {
    return 1;
  }

  const harmonies = new Set([
    'Fire-Air',
    'Air-Fire',
    'Earth-Water',
    'Water-Earth'
  ]);
  const pair = `${leftElement}-${rightElement}`;

  if (harmonies.has(pair)) {
    return 0.8;
  }

  return 0.45;
};

const buildBirthChartCompatibility = (
  chartOne: BirthChartResult,
  chartTwo: BirthChartResult
): BirthChartCompatibilityResult => {
  const sunScore = elementScore(chartOne.sun, chartTwo.sun);
  const moonScore = elementScore(chartOne.moon, chartTwo.moon);
  const risingScore = elementScore(chartOne.rising, chartTwo.rising);
  const venusScore = elementScore(chartOne.venus, chartTwo.venus);
  const crossScore =
    (elementScore(chartOne.sun, chartTwo.moon) +
      elementScore(chartTwo.sun, chartOne.moon)) /
    2;

  const weighted =
    sunScore * 28 +
    moonScore * 22 +
    risingScore * 16 +
    venusScore * 20 +
    crossScore * 14;
  const percentage = Math.max(0, Math.min(100, Math.round(weighted)));
  const compatibilityLevel = getCompatibilityLevel(percentage);

  let strengths =
    'There are meaningful growth opportunities when both partners stay patient and intentional.';
  if (percentage >= 75) {
    strengths =
      'Strong emotional chemistry and complementary life rhythm across core placements.';
  } else if (percentage >= 55) {
    strengths =
      'Good potential with shared values in key placements, especially with consistent communication.';
  }

  let weaknesses =
    'Different emotional and practical needs may require extra compromise and conflict management.';
  if (percentage >= 75) {
    weaknesses =
      'Intensity may lead to high expectations, so personal space and grounded communication remain important.';
  } else if (percentage >= 55) {
    weaknesses =
      'Differences in emotional processing can cause occasional friction without clear boundaries.';
  }

  return {
    chartOne,
    chartTwo,
    percentage,
    level: compatibilityLevel.label,
    barToneClass: compatibilityLevel.barToneClass,
    strengths,
    weaknesses
  };
};

export default function Home() {
  const [firstSign, setFirstSign] = useState<string>(zodiacSigns[0]);
  const [secondSign, setSecondSign] = useState<string>(zodiacSigns[1]);
  const [singleBirthDate, setSingleBirthDate] = useState<string>('');
  const [singleBirthTime, setSingleBirthTime] = useState<string>('');
  const [singleBirthPlace, setSingleBirthPlace] = useState<string>('');
  const [chartOneBirthDate, setChartOneBirthDate] = useState<string>('');
  const [chartOneBirthTime, setChartOneBirthTime] = useState<string>('');
  const [chartOneBirthPlace, setChartOneBirthPlace] = useState<string>('');
  const [chartTwoBirthDate, setChartTwoBirthDate] = useState<string>('');
  const [chartTwoBirthTime, setChartTwoBirthTime] = useState<string>('');
  const [chartTwoBirthPlace, setChartTwoBirthPlace] = useState<string>('');

  const singleGeocodedPlace = useGeocodedPlace(singleBirthPlace);
  const firstGeocodedPlace = useGeocodedPlace(chartOneBirthPlace);
  const secondGeocodedPlace = useGeocodedPlace(chartTwoBirthPlace);

  const birthChart = useMemo(() => {
    return buildBirthChart(
      singleBirthDate,
      singleBirthTime,
      singleGeocodedPlace.location
    );
  }, [singleBirthDate, singleBirthTime, singleGeocodedPlace.location]);

  const chartOne = useMemo(() => {
    return buildBirthChart(
      chartOneBirthDate,
      chartOneBirthTime,
      firstGeocodedPlace.location
    );
  }, [chartOneBirthDate, chartOneBirthTime, firstGeocodedPlace.location]);

  const chartTwo = useMemo(() => {
    return buildBirthChart(
      chartTwoBirthDate,
      chartTwoBirthTime,
      secondGeocodedPlace.location
    );
  }, [chartTwoBirthDate, chartTwoBirthTime, secondGeocodedPlace.location]);

  const birthChartCompatibility = useMemo(() => {
    if (!chartOne || !chartTwo) {
      return null;
    }

    return buildBirthChartCompatibility(chartOne, chartTwo);
  }, [chartOne, chartTwo]);

  const compatibilityResult = useMemo(() => {
    if (!firstSign || !secondSign) {
      return null;
    }

    const firstEntry = compatibilityChart.find(
      (entry) => entry.sign === firstSign
    );
    const secondEntry = compatibilityChart.find(
      (entry) => entry.sign === secondSign
    );

    if (!firstEntry || !secondEntry) {
      return null;
    }

    const firstRank = firstEntry.matches.indexOf(secondSign) + 1;
    const secondRank = secondEntry.matches.indexOf(firstSign) + 1;

    if (!firstRank || !secondRank) {
      return null;
    }

    const percentage = Math.round(
      (rankToPercent(firstRank) + rankToPercent(secondRank)) / 2
    );
    const averageRank = (firstRank + secondRank) / 2;
    const rankGap = Math.abs(firstRank - secondRank);
    const compatibilityLevel = getCompatibilityLevel(percentage);

    return {
      firstEntry,
      secondEntry,
      firstRank,
      secondRank,
      percentage,
      level: compatibilityLevel.label,
      barToneClass: compatibilityLevel.barToneClass,
      strengths: getRelationshipStrength(averageRank, rankGap),
      weaknesses: getRelationshipWeakness(averageRank, rankGap)
    };
  }, [firstSign, secondSign]);

  return (
    <div className='relative min-h-screen overflow-hidden px-4 py-10 sm:px-8 sm:py-12 lg:px-12'>
      <div className='cosmic-overlay pointer-events-none absolute inset-0' />
      <div className='float-slow pointer-events-none absolute -top-28 left-1/3 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl' />
      <div className='float-reverse pointer-events-none absolute top-56 -left-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl' />
      <div className='float-slow pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl' />

      <main className='relative mx-auto flex w-full max-w-6xl flex-col gap-7 sm:gap-9'>
        <header className='fade-in-up rounded-3xl border border-white/35 bg-white/55 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/20 dark:bg-black/35'>
          <p className='text-xs font-semibold tracking-[0.28em] text-violet-700 sm:text-sm dark:text-violet-300'>
            ZODIAC COMPATIBILITY
          </p>
          <h1 className='mt-3 bg-linear-to-r from-zinc-900 via-violet-700 to-zinc-900 bg-clip-text text-3xl font-semibold text-transparent sm:text-5xl dark:from-zinc-100 dark:via-violet-300 dark:to-zinc-100'>
            Cosmic Match Chart
          </h1>
          <p className='mt-4 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base dark:text-zinc-300'>
            Explore each sign&apos;s compatibility order, from strongest spark
            to most challenging connection.
          </p>
        </header>

        <section className='fade-in-up rounded-3xl border border-white/35 bg-white/60 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-white/15 dark:bg-zinc-900/50'>
          <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-100'>
            Birth Chart Calculator
          </h2>
          <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-300'>
            Enter birth date, time, and place to generate an instant chart.
          </p>
          <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
            <label className='text-sm text-zinc-700 dark:text-zinc-200'>
              <span className='mb-2 block font-medium'>Birthday</span>
              <input
                type='date'
                value={singleBirthDate}
                onChange={(event) => setSingleBirthDate(event.target.value)}
                className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
              />
            </label>

            <label className='text-sm text-zinc-700 dark:text-zinc-200'>
              <span className='mb-2 block font-medium'>Birth time</span>
              <input
                type='time'
                value={singleBirthTime}
                onChange={(event) => setSingleBirthTime(event.target.value)}
                className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
              />
            </label>

            <label className='text-sm text-zinc-700 dark:text-zinc-200'>
              <span className='mb-2 block font-medium'>Birth place</span>
              <input
                type='text'
                value={singleBirthPlace}
                onChange={(event) => setSingleBirthPlace(event.target.value)}
                placeholder='City, Country'
                className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100 dark:placeholder:text-zinc-400'
              />
            </label>
          </div>

          {singleGeocodedPlace.status === 'loading' ? (
            <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
              Resolving place coordinates...
            </p>
          ) : null}
          {singleGeocodedPlace.status === 'success' &&
          singleGeocodedPlace.location ? (
            <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
              Using: {singleGeocodedPlace.location.displayName} (
              {singleGeocodedPlace.location.latitude.toFixed(3)},{' '}
              {singleGeocodedPlace.location.longitude.toFixed(3)}) ·{' '}
              {singleGeocodedPlace.location.timezone}
            </p>
          ) : null}
          {singleGeocodedPlace.status === 'error' ? (
            <p className='mt-3 text-xs text-rose-600 dark:text-rose-300'>
              Place not found. Try a clearer format like &quot;City,
              Country&quot;.
            </p>
          ) : null}

          {birthChart ? (
            <div className='fade-in-up mt-5 rounded-2xl border border-white/45 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-800/75'>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                {(
                  [
                    ['Sun', birthChart.sun],
                    ['Moon', birthChart.moon],
                    ['Rising', birthChart.rising],
                    ['Venus', birthChart.venus]
                  ] as const
                ).map(([label, sign]) => (
                  <div
                    key={label}
                    className='zodiac-card tap-soft rounded-xl bg-white/85 px-3 py-3 text-center dark:bg-zinc-900/75'
                  >
                    <p className='text-xs font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400'>
                      {label}
                    </p>
                    <p className='mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
                      {zodiacSymbolBySign[sign]} {sign}
                    </p>
                  </div>
                ))}
              </div>
              <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
                Ephemeris-based tropical chart using geocoded coordinates and
                local timezone conversion to UTC.
              </p>
            </div>
          ) : (
            <p className='mt-4 text-sm text-zinc-600 dark:text-zinc-300'>
              Fill all three fields to generate the chart.
            </p>
          )}
        </section>

        <section className='fade-in-up rounded-3xl border border-white/35 bg-white/60 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-white/15 dark:bg-zinc-900/50'>
          <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-100'>
            Birth Chart Compatibility
          </h2>
          <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-300'>
            Compare two birth charts from birthday, birth time, and birth place.
          </p>

          <div className='mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <div className='rounded-2xl bg-white/80 p-4 dark:bg-zinc-900/75'>
              <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
                Person A
              </p>
              <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <input
                  type='date'
                  value={chartOneBirthDate}
                  onChange={(event) => setChartOneBirthDate(event.target.value)}
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
                />
                <input
                  type='time'
                  value={chartOneBirthTime}
                  onChange={(event) => setChartOneBirthTime(event.target.value)}
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
                />
                <input
                  type='text'
                  value={chartOneBirthPlace}
                  onChange={(event) =>
                    setChartOneBirthPlace(event.target.value)
                  }
                  placeholder='City, Country'
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                />
              </div>
              {firstGeocodedPlace.status === 'loading' ? (
                <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
                  Resolving Person A place...
                </p>
              ) : null}
              {firstGeocodedPlace.status === 'success' &&
              firstGeocodedPlace.location ? (
                <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
                  {firstGeocodedPlace.location.displayName} (
                  {firstGeocodedPlace.location.latitude.toFixed(3)},{' '}
                  {firstGeocodedPlace.location.longitude.toFixed(3)})
                </p>
              ) : null}
            </div>

            <div className='rounded-2xl bg-white/80 p-4 dark:bg-zinc-900/75'>
              <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
                Person B
              </p>
              <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <input
                  type='date'
                  value={chartTwoBirthDate}
                  onChange={(event) => setChartTwoBirthDate(event.target.value)}
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
                />
                <input
                  type='time'
                  value={chartTwoBirthTime}
                  onChange={(event) => setChartTwoBirthTime(event.target.value)}
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
                />
                <input
                  type='text'
                  value={chartTwoBirthPlace}
                  onChange={(event) =>
                    setChartTwoBirthPlace(event.target.value)
                  }
                  placeholder='City, Country'
                  className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                />
              </div>
              {secondGeocodedPlace.status === 'loading' ? (
                <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
                  Resolving Person B place...
                </p>
              ) : null}
              {secondGeocodedPlace.status === 'success' &&
              secondGeocodedPlace.location ? (
                <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>
                  {secondGeocodedPlace.location.displayName} (
                  {secondGeocodedPlace.location.latitude.toFixed(3)},{' '}
                  {secondGeocodedPlace.location.longitude.toFixed(3)})
                </p>
              ) : null}
            </div>
          </div>

          {birthChartCompatibility ? (
            <div className='fade-in-up mt-5 rounded-2xl border border-white/45 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-800/75'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <p className='text-sm font-medium tracking-[0.14em] text-violet-700 dark:text-violet-300'>
                    BIRTH CHART MATCH
                  </p>
                  <p className='mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100'>
                    {birthChartCompatibility.percentage}%
                  </p>
                  <p className='mt-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300'>
                    Match level: {birthChartCompatibility.level}
                  </p>
                </div>
                <div className='relative h-3 w-full overflow-hidden rounded-full border border-white/55 bg-white/75 sm:max-w-sm dark:border-white/10 dark:bg-zinc-700/75'>
                  <div
                    className={`relative h-full rounded-full transition-[width] duration-700 ${birthChartCompatibility.barToneClass}`}
                    style={{ width: `${birthChartCompatibility.percentage}%` }}
                  >
                    <div className='bar-shimmer' />
                  </div>
                </div>
              </div>

              <div className='mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2'>
                <div className='rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                  <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
                    Person A Chart
                  </p>
                  <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                    {zodiacSymbolBySign[birthChartCompatibility.chartOne.sun]}{' '}
                    Sun {birthChartCompatibility.chartOne.sun} ·{' '}
                    {zodiacSymbolBySign[birthChartCompatibility.chartOne.moon]}{' '}
                    Moon {birthChartCompatibility.chartOne.moon} ·{' '}
                    {
                      zodiacSymbolBySign[
                        birthChartCompatibility.chartOne.rising
                      ]
                    }{' '}
                    Rising {birthChartCompatibility.chartOne.rising} ·{' '}
                    {zodiacSymbolBySign[birthChartCompatibility.chartOne.venus]}{' '}
                    Venus {birthChartCompatibility.chartOne.venus}
                  </p>
                </div>

                <div className='rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                  <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
                    Person B Chart
                  </p>
                  <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                    {zodiacSymbolBySign[birthChartCompatibility.chartTwo.sun]}{' '}
                    Sun {birthChartCompatibility.chartTwo.sun} ·{' '}
                    {zodiacSymbolBySign[birthChartCompatibility.chartTwo.moon]}{' '}
                    Moon {birthChartCompatibility.chartTwo.moon} ·{' '}
                    {
                      zodiacSymbolBySign[
                        birthChartCompatibility.chartTwo.rising
                      ]
                    }{' '}
                    Rising {birthChartCompatibility.chartTwo.rising} ·{' '}
                    {zodiacSymbolBySign[birthChartCompatibility.chartTwo.venus]}{' '}
                    Venus {birthChartCompatibility.chartTwo.venus}
                  </p>
                </div>
              </div>

              <div className='mt-4 rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                <p className='text-sm text-zinc-700 dark:text-zinc-200'>
                  <span className='font-medium'>Strengths:</span>{' '}
                  {birthChartCompatibility.strengths}
                </p>
                <p className='mt-2 text-sm text-zinc-700 dark:text-zinc-200'>
                  <span className='font-medium'>Weaknesses:</span>{' '}
                  {birthChartCompatibility.weaknesses}
                </p>
              </div>
            </div>
          ) : (
            <p className='mt-4 text-sm text-zinc-600 dark:text-zinc-300'>
              Fill all six inputs above to calculate compatibility between two
              birth charts.
            </p>
          )}
        </section>

        <section className='fade-in-up rounded-3xl border border-white/35 bg-white/60 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-white/15 dark:bg-zinc-900/50'>
          <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-100'>
            Check Two Signs
          </h2>
          <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
            <label className='text-sm text-zinc-700 dark:text-zinc-200'>
              <span className='mb-2 flex items-center justify-between font-medium'>
                <span>First sign</span>
                <span className='inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/80 px-2 text-base dark:bg-zinc-800/80'>
                  {zodiacSymbolBySign[firstSign]}
                </span>
              </span>
              <select
                value={firstSign}
                onChange={(event) => setFirstSign(event.target.value)}
                className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
              >
                {zodiacSigns.map((sign) => (
                  <option key={`first-${sign}`} value={sign}>
                    {zodiacSymbolBySign[sign]} {sign}
                  </option>
                ))}
              </select>
            </label>

            <label className='text-sm text-zinc-700 dark:text-zinc-200'>
              <span className='mb-2 flex items-center justify-between font-medium'>
                <span>Second sign</span>
                <span className='inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/80 px-2 text-base dark:bg-zinc-800/80'>
                  {zodiacSymbolBySign[secondSign]}
                </span>
              </span>
              <select
                value={secondSign}
                onChange={(event) => setSecondSign(event.target.value)}
                className='tap-soft w-full rounded-xl border border-white/40 bg-white/85 px-3 py-2.5 text-zinc-900 outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-violet-400 dark:border-white/15 dark:bg-zinc-800/85 dark:text-zinc-100'
              >
                {zodiacSigns.map((sign) => (
                  <option key={`second-${sign}`} value={sign}>
                    {zodiacSymbolBySign[sign]} {sign}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {compatibilityResult ? (
            <div className='fade-in-up tap-soft mt-6 rounded-2xl border border-white/45 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-800/75'>
              <p className='text-sm font-medium tracking-[0.14em] text-violet-700 dark:text-violet-300'>
                COMPATIBILITY RESULT
              </p>
              <div className='mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <p className='text-3xl font-semibold text-zinc-900 dark:text-zinc-100'>
                    {compatibilityResult.percentage}%
                  </p>
                  <p className='mt-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300'>
                    Match level: {compatibilityResult.level}
                  </p>
                </div>
                <div className='relative h-3 w-full overflow-hidden rounded-full border border-white/55 bg-white/75 sm:max-w-sm dark:border-white/10 dark:bg-zinc-700/75'>
                  <div
                    className={`relative h-full rounded-full transition-[width] duration-700 ${compatibilityResult.barToneClass}`}
                    style={{ width: `${compatibilityResult.percentage}%` }}
                  >
                    <div className='bar-shimmer' />
                  </div>
                  <div
                    className='absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/70 bg-white/95 shadow-sm transition-[left] duration-700 dark:border-white/20 dark:bg-zinc-100/95'
                    style={{
                      left: `calc(${compatibilityResult.percentage}% - 0.5rem)`
                    }}
                  />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='zodiac-card tap-soft rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                  <p className='text-sm font-medium text-zinc-800 dark:text-zinc-100'>
                    {compatibilityResult.firstEntry.symbol}{' '}
                    {compatibilityResult.firstEntry.sign}
                  </p>
                  <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                    ranks {compatibilityResult.secondEntry.sign} at #
                    {compatibilityResult.firstRank}
                  </p>
                </div>
                <div className='zodiac-card tap-soft rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                  <p className='text-sm font-medium text-zinc-800 dark:text-zinc-100'>
                    {compatibilityResult.secondEntry.symbol}{' '}
                    {compatibilityResult.secondEntry.sign}
                  </p>
                  <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                    ranks {compatibilityResult.firstEntry.sign} at #
                    {compatibilityResult.secondRank}
                  </p>
                </div>
              </div>

              <div className='mt-4 rounded-xl bg-white/85 px-4 py-3 dark:bg-zinc-900/75'>
                <p className='text-sm text-zinc-700 dark:text-zinc-200'>
                  <span className='font-medium'>Strengths:</span>{' '}
                  {compatibilityResult.strengths}
                </p>
                <p className='mt-2 text-sm text-zinc-700 dark:text-zinc-200'>
                  <span className='font-medium'>Weaknesses:</span>{' '}
                  {compatibilityResult.weaknesses}
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3'>
          {compatibilityChart.map((entry) => (
            <article
              key={entry.sign}
              className='zodiac-card tap-soft rounded-3xl border border-white/35 bg-white/60 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-white/15 dark:bg-zinc-900/50'
            >
              <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
                {entry.symbol} {entry.sign}
              </h2>
              <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                {zodiacDateRanges[entry.sign]}
              </p>
              <ol className='mt-4 space-y-2.5'>
                {entry.matches.map((match, index) => (
                  <li
                    key={`${entry.sign}-${match}-${index}`}
                    className='match-row flex items-center justify-between rounded-xl bg-white/75 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800/75 dark:text-zinc-200'
                  >
                    <span className='font-medium'>{match}</span>
                    <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                      #{index + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
