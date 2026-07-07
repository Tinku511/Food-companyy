'use client';

export default function NewsletterForm() {
  return (
    <form
      id="footer-newsletter-form"
      className="flex w-full max-w-md gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        id="footer-email-input"
        type="email"
        placeholder="Email address"
        className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brass focus:bg-white/10 focus:ring-4 focus:ring-brass/10"
      />
      <button
        id="footer-newsletter-submit"
        type="submit"
        className="btn-primary whitespace-nowrap px-8"
      >
        Subscribe
      </button>
    </form>
  );
}
