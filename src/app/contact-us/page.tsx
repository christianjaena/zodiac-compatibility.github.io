
export default function ContactUs() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/60 p-8 shadow-lg backdrop-blur-md dark:bg-zinc-900/60 dark:border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-zinc-900 dark:text-zinc-100">Contact Us</h1>
        <p className="mb-4 text-center text-zinc-700 dark:text-zinc-300">
          Have questions, feedback, or partnership inquiries? We’d love to hear from you!
        </p>
        <p className="mb-4 text-center text-zinc-700 dark:text-zinc-300">
          Email us at: <a href="mailto:info@jaenachristian@gmail.com" className="text-violet-700 underline dark:text-violet-300">jaenachristian@gmail.com</a>
        </p>
        <p className="text-center text-zinc-700 dark:text-zinc-300">
          We aim to respond to all messages within 2 business days.
        </p>
      </div>
    </div>
  );
}
