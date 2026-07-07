import Link from 'next/link';

export const metadata = {
  title: 'About Us | SesemeFoods',
  description: 'Our story and commitment to delivering the finest premium foods.',
};

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            Our Story
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl md:text-6xl">
            Passionate About Pure, Uncompromising Flavor.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-content">
            Founded with a simple mission: to bring the world's most vibrant and authentic flavors
            directly to your kitchen. We believe that great food starts with exceptional
            ingredients, sourced ethically and prepared with care.
          </p>
        </div>
      </section>

      {/* Image / Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940&auto=format&fit=crop"
            alt="Kitchen preparation"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/30 mix-blend-multiply"></div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { label: 'Ethically Sourced', value: '100%' },
            { label: 'Artisan Partners', value: '50+' },
            { label: 'Happy Customers', value: '10k+' },
            { label: 'Awards Won', value: '12' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-brass">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              The Seseme Standard
            </h2>
            <div className="mt-8 space-y-8 text-content">
              <p className="leading-relaxed">
                We travel the globe to build direct relationships with farmers and artisans who
                share our obsession with quality. From the rolling hills of Tuscany to the spice
                markets of Marrakech, every product in our catalog has been meticulously chosen.
              </p>
              <p className="leading-relaxed">
                But premium shouldn't mean inaccessible. We've optimized our supply chain to ensure
                that these incredible ingredients arrive at your door at their absolute peak of
                freshness, without the traditional retail markup.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-8 py-4 text-sm font-semibold text-white transition hover:bg-charcoal/90"
              >
                Explore Our Collection
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1605333396914-22b6ff9bc5ff?q=80&w=2940&auto=format&fit=crop"
              alt="Spices"
              className="h-64 w-full rounded-3xl object-cover shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2940&auto=format&fit=crop"
              alt="Fresh ingredients"
              className="mt-12 h-64 w-full rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
