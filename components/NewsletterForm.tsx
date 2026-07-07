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
        className="flex-1 rounded-none border-b border-surface/20 bg-transparent px-2 py-4 text-sm text-surface placeholder-surface/40 outline-none transition-all duration-300 focus:border-surface focus:bg-surface/5"
      />
      <button
        id="footer-newsletter-submit"
        type="submit"
        className="text-xs uppercase tracking-widest text-surface/70 transition-colors duration-300 hover:text-surface px-4 border-b border-transparent hover:border-surface"
      >
        Subscribe
      </button>
    </form>
  );
}
