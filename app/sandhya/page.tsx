import Image from "next/image"
import Link from "next/link"

import { photoCategories } from "@/lib/photos"

export default function SandhyaPage() {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-16 flex flex-col gap-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium">
            <span>Sandhya</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Photography Portfolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Visual storyteller &amp; photographer</h1>
          <p className="text-lg text-muted-foreground">
            Portraits, travel, and moments in between. Available for editorial and portrait commissions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#galleries"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              View Portfolio
            </Link>
            <Link
              href="mailto:hello@sandhya.photos"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-foreground hover:border-primary hover:text-primary"
            >
              Book a shoot
            </Link>
          </div>
        </div>
      </section>

      <section id="galleries" className="container mx-auto px-4 pb-24 space-y-14">
        {photoCategories.map((category) => (
          <div key={category.slug} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{category.title}</h2>
              <div className="text-sm text-muted-foreground">Drop photos in public/photos/{category.slug}</div>
            </div>
            {category.photos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
                No photos yet. Add files to public/photos/{category.slug} and list them in lib/photos.ts.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.photos.map((src) => (
                  <div key={src} className="overflow-hidden rounded-lg border border-border/70 bg-card">
                    <Image
                      src={src}
                      alt={`Sandhya ${category.title}`}
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      priority={category.photos.indexOf(src) < 3}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
