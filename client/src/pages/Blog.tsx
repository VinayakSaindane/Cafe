import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogPostCard from "@/components/BlogPostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  useEffect(() => {
    if (blogPosts) {
      if (searchTerm) {
        const filtered = blogPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(blogPosts);
      }
    }
  }, [searchTerm, blogPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Blog
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Explore our latest articles on coffee, food, and cafe culture.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="bg-[#5C4033] hover:bg-[#8B4513] text-white">
              Search
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[#333333]">No posts found for "{searchTerm}"</p>
            <Button 
              className="mt-4 bg-[#5C4033] hover:bg-[#8B4513] text-white"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </div>
        )}

        <div className="mt-16 bg-[#F5F5DC]/30 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 
            className="text-2xl font-bold text-[#5C4033] mb-4 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Subscribe to Our Newsletter
          </h2>
          <p className="text-[#333333] text-center mb-6">
            Stay updated with our latest blog posts, special offers, and events.
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
            />
            <Button className="bg-[#5C4033] hover:bg-[#8B4513] text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog;
