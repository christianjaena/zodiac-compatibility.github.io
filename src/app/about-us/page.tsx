export default function AboutUs() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center py-12 px-4'>
      <div className='w-full max-w-xl rounded-3xl border border-white/20 bg-white/60 p-8 shadow-lg backdrop-blur-md dark:bg-zinc-900/60 dark:border-white/10'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-4 text-center text-zinc-900 dark:text-zinc-100'>
          About Us
        </h1>
        <p className='mb-4 text-center text-zinc-700 dark:text-zinc-300'>
          Welcome to{' '}
          <span className='font-semibold text-violet-700 dark:text-violet-300'>
            Zodiac Compatibility
          </span>
          ! Our mission is to help you explore the fascinating world of
          astrology and zodiac signs. We provide insightful articles,
          compatibility guides, and resources to help you better understand
          yourself and your relationships.
        </p>
        <p className='mb-4 text-center text-zinc-700 dark:text-zinc-300'>
          Our team is passionate about astrology and dedicated to delivering
          accurate, engaging, and original content. Whether you’re a curious
          beginner or a seasoned astrology enthusiast, you’ll find something
          valuable here.
        </p>
        <p className='text-center text-zinc-700 dark:text-zinc-300'>
          Thank you for visiting our site and being part of our community!
        </p>
      </div>
    </div>
  );
}
