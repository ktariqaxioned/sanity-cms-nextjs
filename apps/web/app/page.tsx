import { client } from "@/lib/sanity/client";
import { PostCard } from "@/components/PostCard";
import { POSTS_QUERY, type PostListItem } from "@/lib/sanity/query";

const options = { next: { revalidate: 30 } };
export default async function Home() {
  const posts = await client.fetch<PostListItem[]>(POSTS_QUERY, {}, options);
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
