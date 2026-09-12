interface PageSection {
  id: string;
  type: "HERO" | "TEXT_IMAGE" | "FEATURE_GRID" | "TESTIMONIALS" | "CTA_BANNER" | "IMAGE_GALLERY" | "CUSTOM_HTML";
  content: Record<string, unknown>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getPageSections(pageSlug: string): Promise<PageSection[]> {
  try {
    const res = await fetch(`${API_URL}/api/page-sections/${pageSlug}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function HeroBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="bg-navy-50 py-16 text-center">
      <div className="mx-auto max-w-3xl px-4">
        {content.title != null && (
          <h2 className="mb-3 text-2xl font-bold text-navy-900 md:text-4xl">{String(content.title)}</h2>
        )}
        {content.subtitle != null && <p className="mb-6 text-navy-500">{String(content.subtitle)}</p>}
        {content.imageUrl != null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={String(content.imageUrl)} alt="" className="mx-auto mb-6 max-h-64 w-auto rounded-card object-contain" />
        )}
        {content.ctaText != null && content.ctaLink != null && (
          <a
            href={String(content.ctaLink)}
            className="inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600"
          >
            {String(content.ctaText)}
          </a>
        )}
      </div>
    </section>
  );
}

function TextImageBlock({ content }: { content: Record<string, unknown> }) {
  const imageOnRight = content.imagePosition !== "left";
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${imageOnRight ? "" : "md:[&>*:first-child]:order-2"}`}>
        <div>
          {content.title != null && (
            <h3 className="mb-3 text-xl font-bold text-navy-800">{String(content.title)}</h3>
          )}
          {content.text != null && (
            <p className="text-sm leading-7 text-navy-500">{String(content.text)}</p>
          )}
        </div>
        {content.imageUrl != null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={String(content.imageUrl)} alt="" className="w-full rounded-card object-contain" />
        )}
      </div>
    </section>
  );
}

function FeatureGridBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as { title: string; description?: string }[]) ?? [];
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {content.title != null && (
        <h3 className="mb-8 text-center text-xl font-bold text-navy-800">{String(content.title)}</h3>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-card bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-navy-800">{item.title}</p>
            {item.description && <p className="mt-1 text-xs text-navy-400">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as { name: string; text: string }[]) ?? [];
  return (
    <section className="bg-navy-50 py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-card bg-white p-5 shadow-sm">
            <p className="text-sm text-navy-600">«{item.text}»</p>
            <p className="mt-3 text-xs font-semibold text-navy-800">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBannerBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="bg-navy-800 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-right">
        <div>
          {content.title != null && <p className="text-lg font-bold text-white">{String(content.title)}</p>}
          {content.subtitle != null && <p className="text-sm text-navy-200">{String(content.subtitle)}</p>}
        </div>
        {content.buttonText != null && content.buttonLink != null && (
          <a
            href={String(content.buttonLink)}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-navy-800 hover:bg-navy-50"
          >
            {String(content.buttonText)}
          </a>
        )}
      </div>
    </section>
  );
}

function ImageGalleryBlock({ content }: { content: Record<string, unknown> }) {
  const images = (content.images as string[]) ?? [];
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={idx} src={src} alt="" className="h-32 w-full rounded-card object-contain" />
        ))}
      </div>
    </section>
  );
}

function CustomHtmlBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section
      className="mx-auto max-w-4xl px-4 py-12"
      dangerouslySetInnerHTML={{ __html: String(content.html ?? "") }}
    />
  );
}

export function PageSectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "HERO":
            return <HeroBlock key={section.id} content={section.content} />;
          case "TEXT_IMAGE":
            return <TextImageBlock key={section.id} content={section.content} />;
          case "FEATURE_GRID":
            return <FeatureGridBlock key={section.id} content={section.content} />;
          case "TESTIMONIALS":
            return <TestimonialsBlock key={section.id} content={section.content} />;
          case "CTA_BANNER":
            return <CtaBannerBlock key={section.id} content={section.content} />;
          case "IMAGE_GALLERY":
            return <ImageGalleryBlock key={section.id} content={section.content} />;
          case "CUSTOM_HTML":
            return <CustomHtmlBlock key={section.id} content={section.content} />;
          default:
            return null;
        }
      })}
    </>
  );
}
