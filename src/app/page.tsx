import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="rounded-3xl border border-amber-100 bg-white/80 p-10 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Cafe Menu Manager
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-amber-950 sm:text-5xl">
            The cafe console for menus, stock, and orders.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-amber-900/80">
            Admins control pricing, GST, images, and stock. Guests browse the
            menu, and signed-in customers place orders in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/menu-items"
              className="inline-flex items-center justify-center rounded-full bg-amber-800 px-6 py-3 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-900"
            >
              Manage menu items
            </Link>
            <Link
              href="/orders/new"
              className="inline-flex items-center justify-center rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-300"
            >
              Place an order
            </Link>
            <div className="rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800">
              Built for real cafe workflows
            </div>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Stock-aware ordering",
              copy: "Prevent orders when items are out of stock.",
            },
            {
              title: "Visual menu control",
              copy: "Upload item images and keep the menu polished.",
            },
            {
              title: "Admin-grade edits",
              copy: "Pricing, GST, and availability are managed in one place.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-amber-100 bg-white/70 p-6 text-sm text-amber-900"
            >
              <h3 className="text-base font-semibold text-amber-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-amber-900/70">{feature.copy}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
