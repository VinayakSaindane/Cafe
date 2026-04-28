import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem } from "@shared/schema";

const fallbackMenuImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        await apiRequest("POST", "/api/cart", { itemId: item.id, quantity: 1 });
        onAddToCart(item);
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not add item to cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="h-64 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(event) => {
            event.currentTarget.src = fallbackMenuImage;
          }}
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 
            className="text-xl font-bold text-[#5C4033]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item.name}
          </h3>
          <span className="text-[#8B4513] font-medium">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-[#333333] mb-4">{item.description}</p>
        <Button
          className="w-full bg-[#5C4033] hover:bg-[#8B4513] text-white font-medium"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "Add to Order"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
