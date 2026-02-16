import Image from "next/image";
import Link from "next/link";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import { AUTHORS_LIST_QUERY } from "@/lib/sanity/query";
import { draftMode } from "next/headers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";

type AuthorListItem = {
  _id: string;
  name: string | null;
  slug: { current: string | null } | null;
  avatar: {
    asset?: { _id: string; url: string | null } | null;
  } | null;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function AuthorsPage() {
  const { isEnabled } = await draftMode();
  const authors = await client.fetch<AuthorListItem[]>(AUTHORS_LIST_QUERY, {}, {
    perspective: isEnabled ? "previewDrafts" : "published",
    next: { revalidate: isEnabled ? 0 : 30 },
  });

  return (
    <main className="container mx-auto min-h-screen p-8">
      <h1 className="mb-8 text-4xl font-bold">Authors</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {authors.map((author) => {
          const slug = author.slug?.current;
          if (!slug) return null;
          const avatarUrl = author.avatar?.asset
            ? urlFor(author.avatar)?.width(200).height(200).url() ?? null
            : null;
          return (
            <li key={author._id}>
              <Link href={`/authors/${slug}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="relative mx-auto size-20 overflow-hidden rounded-full bg-muted">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={author.name ?? "Author"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-muted-foreground">
                          <User className="size-10" aria-hidden />
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-semibold text-foreground">
                      {author.name ?? "Unnamed author"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
      {!authors?.length && (
        <p className="text-muted-foreground">No authors yet.</p>
      )}
    </main>
  );
}
