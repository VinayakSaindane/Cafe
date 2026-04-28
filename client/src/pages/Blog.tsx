import { useMutation, useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogPostCard from "@/components/BlogPostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(2, "Author is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(30, "Blog content must be at least 30 characters"),
  imageUrl: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const defaultBlogImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();
  
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      author: "",
      excerpt: "",
      content: "",
      imageUrl: "",
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      return apiRequest("POST", "/api/blog", {
        ...data,
        imageUrl: data.imageUrl?.trim() || defaultBlogImage,
        publishedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/recent"] });
      toast({
        title: "Blog Published",
        description: "Your blog post has been added to the site.",
      });
    },
    onError: () => {
      toast({
        title: "Blog Not Published",
        description: "Please check the blog details and try again.",
        variant: "destructive",
      });
    },
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

        <div className="max-w-3xl mx-auto mb-14">
          <Card>
            <CardContent className="p-8">
              <h2 
                className="text-2xl font-bold text-[#5C4033] mb-6 text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Add a Blog Post
              </h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createBlogMutation.mutate(data))} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="A Fresh Brew Story" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Cafe Team" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Excerpt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A short preview shown on the blog card..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write the full blog post here..." rows={7} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center pt-2">
                    <Button
                      type="submit"
                      className="bg-[#5C4033] hover:bg-[#8B4513] text-white px-6"
                      disabled={createBlogMutation.isPending}
                    >
                      {createBlogMutation.isPending ? "Publishing..." : "Publish Blog"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
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
