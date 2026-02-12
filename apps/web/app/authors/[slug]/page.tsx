/**
 * Author profile page: shows author bio and their posts by slug.
 */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "next-sanity";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { draftMode } from "next/headers";

import { client } from "@/lib/sanity/client";
import {
  AUTHOR_BY_SLUG_QUERY,
  POSTS_BY_AUTHOR_SLUG_QUERY,
} from "@/lib/sanity/query";
import type { POSTS_QUERY_RESULT } from "@/lib/sanity/sanity.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/PostCard";
import { ArrowLeft, User } from "lucide-react";

type Author = {
  _id: string;
  name: string | null;
  slug: { current: string | null } | null;
  bio: PortableTextBlock[] | null;
  avatar: {
    asset?: { _id: string; url: string | null } | null;
  } | null;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const [author, posts] = await Promise.all([
    client.fetch<Author | null>(AUTHOR_BY_SLUG_QUERY, { slug }, {
      perspective: isEnabled ? "previewDrafts" : "published",
      next: { revalidate: isEnabled ? 0 : 30 },
    }),
    client.fetch<POSTS_QUERY_RESULT>(POSTS_BY_AUTHOR_SLUG_QUERY, { slug }, {
      perspective: isEnabled ? "previewDrafts" : "published",
      next: { revalidate: isEnabled ? 0 : 30 },
    }),
  ]);

  if (!author) notFound();

  const avatarUrl = author.avatar?.asset
    ? urlFor(author.avatar)?.width(200).height(200).url() ?? null
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-muted">
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
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl">
              {author.name}
            </CardTitle>
          </div>
        </CardHeader>

        {author.bio && Array.isArray(author.bio) && author.bio.length > 0 && (
          <>
            <Separator />
            <CardContent className="pt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                <PortableText value={author.bio} />
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">
          Posts by {author.name}
        </h2>
        {posts && posts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts.map((post: POSTS_QUERY_RESULT[number]) => (
              <PostCard key={post._id} post={post} />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No posts by this author yet.
          </p>
        )}
      </section>
    </main>
  );
}
