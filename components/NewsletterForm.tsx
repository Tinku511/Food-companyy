'use client';

export default function NewsletterForm() {
  return (
    <form
      id="footer-newsletter-form"
      className="flex w-full max-w-sm gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        id="footer-email-input"
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded-full border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20"
      />
      <button
        id="footer-newsletter-submit"
        type="submit"
        className="btn-primary whitespace-nowrap text-xs"
      >
        Subscribe
      </button>
    </form>
  );
}
