import { PortableText } from "next-sanity";
import { createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY, type Post } from "@/lib/sanity/query";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar } from "lucide-react";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<Post>(
    POST_BY_SLUG_QUERY,
    await params,
    options,
  );
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
          <div className="flex flex-col gap-2 flex-wrap">
            {publishedDate && (
              <Badge variant="outline" className="gap-1.5">
                <Calendar className="size-3" />
                {publishedDate}
              </Badge>
            )}

            {post.badges && post.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.badges.map((badge, i) => (
                  <Badge
                    key={`${badge}-${i}`}
                    variant="default"
                    className="gap-1.5"
                  >
                    {badge}
                  </Badge>
                ))}
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
