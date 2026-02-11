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
      <Link href={`/${post.slug.current}`}>
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
            {post.badges && post.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {post.badges.map((badge, i) => (
                  <Badge key={`${badge}-${i}`} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardFooter>
            <p className="text-sm text-muted-foreground">{publishedDate}</p>
          </CardFooter>
        </Card>
      </Link>
    </li>
  );
}
