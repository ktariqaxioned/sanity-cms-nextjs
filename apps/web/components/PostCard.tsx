"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { POSTS_QUERY_RESULT } from "@/lib/sanity/sanity.types";
import { Award, BookOpen, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

/** CMS badge value → display label (matches postType.ts options) */
const BADGE_LABELS: Record<string, string> = {
  featured: "Featured",
  new: "New",
  popular: "Popular",
  trending: "Trending",
  "editors-pick": "Editor's Pick",
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

type PostCardProps = {
  post: POSTS_QUERY_RESULT[number];
};

export function PostCard({ post }: PostCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const postHref = `posts/${post.slug?.current ?? ""}`;
  const authorSlug = (
    post.author as { slug?: { current?: string } } | null | undefined
  )?.slug?.current;

  const router = useRouter();

  return (
    <li>
      <Card
        className="h-full pt-0 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => router.push(postHref)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(postHref);
          }
        }}
      >
        {post.image?.asset && (
          <CardContent className="p-0">
            <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
              <Image
                src={urlFor(post.image)?.url() || ""}
                alt={post.title || "Post image"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          {((post.categories?.length ?? 0) > 0 ||
            (post.tags?.length ?? 0) > 0) && (
            <div className="flex flex-col gap-2 mt-2">
              {post.categories && post.categories.length > 0 && (
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  aria-label="Categories"
                >
                  <BookOpen
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  {post.categories.map((cat) => (
                    <Badge
                      key={cat.title}
                      variant="outline"
                      className="text-xs font-medium gap-1 py-0.5"
                    >
                      {cat.title}
                    </Badge>
                  ))}
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
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag.title}
                      variant="secondary"
                      className="text-xs font-medium gap-1 py-0.5"
                    >
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          {post.badges && post.badges.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-1.5 mt-2"
              aria-label="Editorial"
            >
              <Award
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              {post.badges.map((badge, i) => (
                <Badge
                  key={`${badge}-${i}`}
                  variant="default"
                  className="text-xs font-medium py-0.5 capitalize"
                >
                  {BADGE_LABELS[badge] ?? badge.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          {post.author?.name && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {authorSlug ? (
                <Link
                  href={`/authors/${authorSlug}`}
                  className="flex items-center gap-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  {post.author.avatar?.asset ? (
                    <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Avatar className="size-6">
                        <AvatarImage
                          src={urlFor(post.author.avatar)?.url() ?? ""}
                        />
                        <AvatarFallback>
                          {post.author.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                  ) : (
                    <User
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                  <span>{post.author.name}</span>
                </Link>
              ) : (
                <>
                  {post.author.avatar?.asset ? (
                    <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Avatar className="size-6">
                        <AvatarImage
                          src={urlFor(post.author.avatar)?.url() ?? ""}
                        />
                        <AvatarFallback>
                          {post.author.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                  ) : (
                    <User
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                  <span>{post.author.name}</span>
                </>
              )}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{publishedDate}</p>
        </CardFooter>
      </Card>
    </li>
  );
}
