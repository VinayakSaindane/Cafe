import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { BlogPost as BlogPostType } from "@shared/schema";
import { Button } from "@/components/ui/button";

const fallbackImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=500&q=80";

const BlogPost = () => {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id;

  const { data: post, isLoading, isError } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${postId}`],
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto h-[520px] bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-[#5C4033] mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button className="bg-[#5C4033] hover:bg-[#8B4513] text-white">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <a className="inline-flex items-center text-[#8B4513] font-medium hover:text-[#5C4033] transition-colors mb-8">
              Back to Blog
            </a>
          </Link>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[260px] md:h-[420px] object-cover rounded-lg shadow-lg mb-8"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />
          <div className="text-sm text-[#333333]/70 mb-4">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            by {post.author}
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>
          <p className="text-xl text-[#333333] mb-8 leading-relaxed">{post.excerpt}</p>
          <div className="prose max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-lg text-[#333333] leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
