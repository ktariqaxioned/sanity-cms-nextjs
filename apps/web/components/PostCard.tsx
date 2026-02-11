import Link from "next/link";
import Image from "next/image";
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
import { Post } from "@/lib/sanity/query";
import { Award, BookOpen, Tag, User } from "lucide-react";

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
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  return (
    <li>
      <Link href={`/posts/${post.slug.current}`}>
        <Card className="transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer h-full pt-0">
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
                {post.author.avatar?.asset ? (
                  <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={urlFor(post.author.avatar)?.url() ?? ""}
                      alt=""
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <User
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                )}
                <span>{post.author.name}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">{publishedDate}</p>
          </CardFooter>
        </Card>
      </Link>
    </li>
  );
}
