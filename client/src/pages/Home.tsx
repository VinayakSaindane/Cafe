import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import MenuItemCard from "@/components/MenuItemCard";
import ReviewCarousel from "@/components/ReviewCarousel";
import BlogPostCard from "@/components/BlogPostCard";
import { MenuItem, Review, BlogPost } from "@shared/schema";

const Home = () => {
  const { data: featuredItems = [], isLoading: isLoadingFeatured } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/featured"],
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { data: blogPosts = [], isLoading: isLoadingBlog } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/recent"],
  });

  return (
    <div className="pt-16">
      <HeroSection />

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Cafe interior with stylish decor"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 
                className="text-3xl md:text-4xl font-bold text-[#5C4033] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome to Brew & Bite
              </h2>
              <p className="text-[#333333] mb-6 leading-relaxed">
                Founded in 2015, Brew & Bite has grown into a beloved establishment where coffee lovers and food enthusiasts gather. Our mission is to provide an exceptional experience through artisanal food and beverages in a welcoming atmosphere.
              </p>
              <p className="text-[#333333] mb-8 leading-relaxed">
                Every cup of coffee is crafted with precision using ethically sourced beans, and our menu features locally sourced ingredients to support our community.
              </p>
              <Link href="/about">
                <a className="inline-flex items-center text-[#8B4513] font-medium hover:text-[#5C4033] transition-colors">
                  Learn more about our story
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
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-[#F5F5DC]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#5C4033] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Popular Menu Items
            </h2>
            <p className="text-[#333333] max-w-2xl mx-auto">
              Discover our most-loved offerings, perfected through passion and quality ingredients.
            </p>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/menu">
              <Button
                className="bg-[#8B4513] hover:bg-[#5C4033] text-white font-medium"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pick Go Section */}
      <section id="pick-go-preview" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 order-2 md:order-1">
              <h2 
                className="text-3xl md:text-4xl font-bold text-[#5C4033] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pick & Go Service
              </h2>
              <p className="text-[#333333] mb-6 leading-relaxed">
                Short on time? Our Pick & Go service allows you to order ahead and skip the wait. Simply place your order online, select your pickup time, and your freshly prepared items will be ready when you arrive.
              </p>
              <div className="bg-[#F5F5DC]/30 p-6 rounded-lg mb-6">
                <h3 
                  className="text-xl font-bold text-[#5C4033] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  How It Works
                </h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-[#5C4033] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Order online and select "Pick & Go"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#5C4033] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Choose your preferred pickup time (minimum 15 minutes advance notice)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#5C4033] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Receive confirmation and pickup instructions via email/text</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#5C4033] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                    <span>Arrive at the designated pickup counter and enjoy!</span>
                  </li>
                </ol>
              </div>
              <Link href="/pick-go">
                <Button
                  className="bg-[#5C4033] hover:bg-[#8B4513] text-white font-medium"
                  style={{ fontFamily: "var(--font-accent)" }}
                >
                  Start Pick & Go Order
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1559305616-3f99cd43e353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Customer picking up coffee order"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-[#F5F5DC]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#5C4033] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What Our Customers Say
            </h2>
            <p className="text-[#333333] max-w-2xl mx-auto">
              Read reviews from our valued guests who have experienced Brew & Bite.
            </p>
          </div>

          {isLoadingReviews ? (
            <div className="h-64 bg-white/50 rounded-lg animate-pulse"></div>
          ) : (
            <ReviewCarousel reviews={reviews} />
          )}

          <div className="mt-12 text-center">
            <Link href="/reviews">
              <Button
                className="bg-[#8B4513] hover:bg-[#5C4033] text-white font-medium"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                Leave a Review
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#5C4033] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              From Our Blog
            </h2>
            <p className="text-[#333333] max-w-2xl mx-auto">
              Explore our latest articles on coffee, food, and cafe culture.
            </p>
          </div>

          {isLoadingBlog ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button
                className="bg-[#8B4513] hover:bg-[#5C4033] text-white font-medium"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
