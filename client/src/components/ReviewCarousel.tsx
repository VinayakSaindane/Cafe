import { useState, useRef, useEffect } from "react";
import { Review } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewCarouselProps {
  reviews: Review[];
}

const ReviewCarousel = ({ reviews }: ReviewCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.children[0].clientWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  // Handle scroll events to update the active dot
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        if (carouselRef.current.children.length === 0) return;
        const scrollLeft = carouselRef.current.scrollLeft;
        const slideWidth = carouselRef.current.children[0].clientWidth;
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-[#333333]">
        No reviews yet. Be the first to share your experience.
      </div>
    );
  }

  return (
    <div className="review-carousel relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto pb-6 snap-x scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review, index) => (
          <Card
            key={index}
            className="bg-[#F5F5DC]/20 min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-center mx-3"
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${
                        i < review.rating ? "" : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="ml-2 text-sm text-[#333333]">{review.rating.toFixed(1)}</span>
              </div>
              <p className="text-[#333333] mb-4 italic">"{review.content}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#5C4033]/20 flex items-center justify-center text-[#5C4033] font-bold mr-3">
                  {review.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-medium text-[#5C4033]">{review.author}</h4>
                  <p className="text-sm text-[#333333]">{review.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-[#5C4033]" : "bg-gray-300 hover:bg-[#5C4033]/70"
            }`}
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
