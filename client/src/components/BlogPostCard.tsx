import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@shared/schema";

const fallbackBlogImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = fallbackBlogImage;
          }}
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-[#333333]/70 mb-3">
          <span className="mr-3">
            <i className="far fa-calendar-alt mr-1"></i>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>
            <i className="far fa-user mr-1"></i> by {post.author}
          </span>
        </div>
        <h3 
          className="text-xl font-bold text-[#5C4033] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h3>
        <p className="text-[#333333] mb-4 line-clamp-3">{post.excerpt}</p>
        <Link href={`/blog/${post.id}`}>
          <a className="inline-flex items-center text-[#8B4513] font-medium hover:text-[#5C4033] transition-colors">
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
