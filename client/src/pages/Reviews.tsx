import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Review, reviewSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ReviewCarousel from "@/components/ReviewCarousel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const formSchema = reviewSchema.omit({ id: true });
type FormValues = z.infer<typeof formSchema>;

const Reviews = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      title: "",
      rating: 5,
      content: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/reviews", data);
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your feedback with us.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Customer Reviews
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            We value your feedback. Read what others are saying about us or share your own experience.
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse my-12"></div>
        ) : (
          <div className="my-12">
            <ReviewCarousel reviews={reviews} />
          </div>
        )}

        <div className="max-w-2xl mx-auto my-16">
          <Card>
            <CardContent className="p-8">
              <h2 
                className="text-2xl font-bold text-[#5C4033] mb-6 text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Share Your Experience
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Title / Occupation</FormLabel>
                        <FormControl>
                          <Input placeholder="Regular Customer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                type="button"
                                variant="ghost"
                                className="p-1"
                                onClick={() => field.onChange(star)}
                              >
                                <i 
                                  className={`fas fa-star text-xl ${
                                    star <= field.value ? "text-amber-400" : "text-gray-300"
                                  }`}
                                ></i>
                              </Button>
                            ))}
                            <span className="ml-2 text-[#333333]">
                              {field.value} of 5 stars
                            </span>
                          </div>
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
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your experience with us..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-center pt-2">
                    <Button
                      type="submit"
                      className="bg-[#5C4033] hover:bg-[#8B4513] text-white px-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto bg-[#F5F5DC]/20 p-8 rounded-lg">
          <h2 
            className="text-2xl font-bold text-[#5C4033] mb-6 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We're Also On
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <a 
              href="https://yelp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <i className="fab fa-yelp text-4xl text-[#d32323] mb-3"></i>
              <h3 className="font-bold text-[#5C4033]">Yelp</h3>
              <p className="text-sm text-[#333333]">4.8 stars (120+ reviews)</p>
            </a>
            
            <a 
              href="https://google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <i className="fab fa-google text-4xl text-[#4285F4] mb-3"></i>
              <h3 className="font-bold text-[#5C4033]">Google</h3>
              <p className="text-sm text-[#333333]">4.7 stars (200+ reviews)</p>
            </a>
            
            <a 
              href="https://tripadvisor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <i className="fab fa-tripadvisor text-4xl text-[#00af87] mb-3"></i>
              <h3 className="font-bold text-[#5C4033]">TripAdvisor</h3>
              <p className="text-sm text-[#333333]">4.6 stars (85+ reviews)</p>
            </a>
            
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <i className="fab fa-facebook text-4xl text-[#3b5998] mb-3"></i>
              <h3 className="font-bold text-[#5C4033]">Facebook</h3>
              <p className="text-sm text-[#333333]">4.9 stars (150+ reviews)</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
