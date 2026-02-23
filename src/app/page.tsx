type ZodiacChart = {
  symbol: string;
  sign: string;
  matches: string[];
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

export default function Home() {
  return (
    <div className='relative min-h-screen overflow-hidden px-6 py-14 sm:px-10'>
      <div className='pointer-events-none absolute -top-28 left-1/3 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl' />
      <div className='pointer-events-none absolute top-56 -left-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl' />

      <main className='relative mx-auto flex w-full max-w-6xl flex-col gap-10'>
        <header className='rounded-3xl border border-white/30 bg-white/50 p-8 backdrop-blur-md dark:border-white/20 dark:bg-black/30'>
          <p className='text-sm font-medium tracking-[0.3em] text-violet-700 dark:text-violet-300'>
            ZODIAC COMPATIBILITY
          </p>
          <h1 className='mt-3 text-4xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-5xl'>
            Cosmic Match Chart
          </h1>
          <p className='mt-4 max-w-2xl text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base'>
            Explore each sign&apos;s compatibility order, from strongest spark
            to most challenging connection.
          </p>
        </header>

        <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
          {compatibilityChart.map((entry) => (
            <article
              key={entry.sign}
              className='rounded-3xl border border-white/30 bg-white/55 p-6 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-zinc-900/45'
            >
              <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
                {entry.symbol} {entry.sign}
              </h2>
              <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-300'>
                {zodiacDateRanges[entry.sign]}
              </p>
              <ol className='mt-4 space-y-2'>
                {entry.matches.map((match, index) => (
                  <li
                    key={`${entry.sign}-${match}-${index}`}
                    className='flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-200'
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
