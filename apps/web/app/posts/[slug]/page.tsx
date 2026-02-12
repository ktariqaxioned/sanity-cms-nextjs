import { PortableText } from "next-sanity";
import { createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import {
  POST_BY_SLUG_QUERY,
  type POST_BY_SLUG_QUERY_RESULT,
} from "@/lib/sanity/query";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Award, BookOpen, Calendar, Tag, User } from "lucide-react";

/** Single post from POST_BY_SLUG_QUERY (non-null) */
type Post = NonNullable<POST_BY_SLUG_QUERY_RESULT>;

/** CMS badge value → display label (matches postType.ts options) */
type BadgeValue = NonNullable<Post["badges"]>[number];
const BADGE_LABELS: Record<BadgeValue, string> = {
  featured: "Featured",
  new: "New",
  popular: "Popular",
  trending: "Trending",
  "editors-pick": "Editor's Pick",
};

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({ params }: PostPageProps) {
  const raw = await client.fetch<POST_BY_SLUG_QUERY_RESULT>(
    POST_BY_SLUG_QUERY,
    await params,
    options,
  );
  if (!raw) notFound();
  const post: Post = raw;
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(675).url()
    : null;

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const authorSlug = (
    post.author as { slug?: { current?: string } } | null | undefined
  )?.slug?.current;

  return (
    <main className="container mx-auto min-h-screen max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to posts
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden pt-0">
        {postImageUrl && (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={postImageUrl}
              alt={post.title || "Post image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/authors/${authorSlug}`}
                className="flex items-center gap-2 hover:underline"
              >
                {post.author?.name && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar size="default">
                      <AvatarImage
                        src={
                          post.author.avatar?.asset
                            ? (urlFor(post.author.avatar)
                                ?.width(60)
                                .height(60)
                                .url() ?? "")
                            : undefined
                        }
                        alt=""
                      />
                      <AvatarFallback>
                        <User className="size-3.5" aria-hidden />
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author.name}</span>
                  </span>
                )}
              </Link>
              {publishedDate && (
                <Badge
                  variant="outline"
                  className="gap-1.5 text-xs font-medium"
                >
                  <Calendar className="size-3" aria-hidden />
                  {publishedDate}
                </Badge>
              )}
            </div>

            {post.badges && post.badges.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-1.5"
                aria-label="Editorial"
              >
                <Award
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                {post.badges.map((badge: BadgeValue, i: number) => (
                  <Badge
                    key={`${badge}-${i}`}
                    variant="default"
                    className="text-xs font-medium py-0.5"
                  >
                    {BADGE_LABELS[badge] ?? badge.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            )}

            {((post.categories?.length ?? 0) > 0 ||
              (post.tags?.length ?? 0) > 0) && (
              <div className="flex flex-col gap-2">
                {post.categories && post.categories.length > 0 && (
                  <div
                    className="flex flex-wrap items-center gap-1.5"
                    aria-label="Categories"
                  >
                    <BookOpen
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    {post.categories.map(
                      (cat: NonNullable<Post["categories"]>[number]) => (
                        <Badge
                          key={cat.title ?? undefined}
                          variant="outline"
                          className="text-xs font-medium py-0.5"
                        >
                          {cat.title}
                        </Badge>
                      ),
                    )}
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div
                    className="flex flex-wrap items-center gap-1.5"
                    aria-label="Tags"
                  >
                    <Tag
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    {post.tags.map((tag: NonNullable<Post["tags"]>[number]) => (
                      <Badge
                        key={tag.title ?? undefined}
                        variant="secondary"
                        className="text-xs font-medium py-0.5"
                      >
                        {tag.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <CardTitle className="text-3xl md:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted">
            {Array.isArray(post.body) && <PortableText value={post.body} />}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
