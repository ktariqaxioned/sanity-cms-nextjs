import { client } from "@/lib/sanity/client";
import { PostCard } from "@/components/PostCard";
import { POSTS_QUERY, type PostListItem } from "@/lib/sanity/query";
import { draftMode } from "next/headers";

export default async function Home() {
  const { isEnabled } = await draftMode();
  const posts = await client.fetch<PostListItem[]>(
    POSTS_QUERY,
    {},
    {
      perspective: isEnabled ? "previewDrafts" : "published",
      next: {
        revalidate: isEnabled ? 0 : 30,
      },
    },
  );
  return (
    <main className="container mx-auto min-h-screen  p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: PostListItem) => (
          <PostCard key={post._id} post={post} />
        ))}
      </ul>
    </main>
  );
}
