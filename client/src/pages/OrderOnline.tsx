import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tab } from "@headlessui/react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, MenuCategory } from "@shared/schema";
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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

// Define the cart item type
interface CartItemWithDetails {
  id: number;
  menuItemId: number;
  quantity: number;
  menuItem: MenuItem;
}

// Customer information form schema
const orderFormSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(7, "Please enter a valid phone number"),
  deliveryAddress: z.string().optional(),
  deliveryMethod: z.enum(["pickup", "delivery"]),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const OrderOnline = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItemWithDetails[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  // Set up form for checkout
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      deliveryMethod: "pickup",
    },
  });

  // Get menu categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  // Get menu items
  const { data: menuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items", selectedCategory],
    queryFn: async () => {
      const endpoint = selectedCategory 
        ? `/api/menu/items?category=${selectedCategory}` 
        : "/api/menu/items";
      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json();
    },
  });

  // Get cart items
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery<CartItemWithDetails[]>({
    queryKey: ["/api/cart"],
    onSuccess: (data) => {
      setCart(data);
    }
  });

  // Mutations for cart operations
  const addToCartMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      return apiRequest("POST", "/api/cart", { itemId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Submit order mutation
  const submitOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setOrderComplete(true);
    },
  });

  // Handle adding item to cart
  const handleAddToCart = async (itemId: number) => {
    try {
      await addToCartMutation.mutateAsync({ itemId, quantity: 1 });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart.",
        variant: "destructive",
      });
    }
  };

  // Handle removing item from cart
  const handleRemoveFromCart = async (id: number) => {
    try {
      await removeFromCartMutation.mutateAsync(id);
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove item from cart.",
        variant: "destructive",
      });
    }
  };

  // Handle quantity adjustment
  const handleQuantityChange = async (item: CartItemWithDetails, change: number) => {
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      await handleRemoveFromCart(item.id);
      return;
    }
    
    // Remove and re-add with new quantity (since we don't have a PATCH endpoint)
    try {
      await removeFromCartMutation.mutateAsync(item.id);
      await addToCartMutation.mutateAsync({ itemId: item.menuItemId, quantity: newQuantity });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update item quantity.",
        variant: "destructive",
      });
    }
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.menuItem.price * item.quantity);
    }, 0);
  };
  
  // Submit order
  const onSubmit = async (data: OrderFormValues) => {
    try {
      const isDelivery = data.deliveryMethod === "delivery";
      
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryAddress: isDelivery ? data.deliveryAddress : null,
        isDelivery,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity
        })),
        total: calculateTotal()
      };
      
      await submitOrderMutation.mutateAsync(orderData);
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset order flow
  const handleStartNewOrder = () => {
    setOrderComplete(false);
    form.reset();
    setIsCheckingOut(false);
  };

  // Handle checkout button
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Order Online
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Order your favorite items for pickup or delivery. Our freshly prepared food and beverages are just a few clicks away.
          </p>
        </div>

        {/* Order Complete Dialog */}
        <Dialog 
          open={orderComplete} 
          onOpenChange={setOrderComplete}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center mb-2 text-[#5C4033]">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                Order Successful!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p>Thank you for your order. We've received your order and will begin preparing it right away.</p>
              <p>You will receive a confirmation email with your order details.</p>
            </div>
            <DialogFooter className="sm:justify-center mt-4">
              <Button
                className="bg-[#5C4033] hover:bg-[#8B4513] text-white"
                onClick={handleStartNewOrder}
              >
                Start New Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Checkout Dialog */}
        <Dialog 
          open={isCheckingOut} 
          onOpenChange={(open) => {
            setIsCheckingOut(open);
            if (!open) form.reset();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#5C4033]">Complete Your Order</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
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
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label htmlFor="pickup">Pickup (Ready in 20-30 minutes)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="delivery" id="delivery" />
                            <Label htmlFor="delivery">Delivery (45-60 minutes)</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("deliveryMethod") === "delivery" && (
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your full address" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Order Summary:</h4>
                  <div className="space-y-1 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCheckingOut(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#5C4033] hover:bg-[#8B4513] text-white"
                    disabled={submitOrderMutation.isPending}
                  >
                    {submitOrderMutation.isPending ? "Processing..." : "Complete Order"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="featured">Featured Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="pt-6">
                {isLoadingCategories ? (
                  <div className="h-12 bg-gray-100 animate-pulse rounded-lg mb-6"></div>
                ) : (
                  <Tab.Group onChange={(index) => setSelectedCategory(index === 0 ? null : categories[index - 1]?.id)}>
                    <Tab.List className="flex space-x-1 rounded-xl bg-[#F5F5DC]/20 p-1 overflow-x-auto">
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "whitespace-nowrap rounded-lg py-2.5 px-3 text-sm font-medium leading-5",
                            "ring-white/60 ring-offset-2 ring-offset-[#8B4513] focus:outline-none focus:ring-2",
                            selected
                              ? "bg-white shadow text-[#5C4033]"
                              : "text-[#5C4033]/60 hover:bg-white/[0.12] hover:text-[#5C4033]"
                          )
                        }
                      >
                        All Items
                      </Tab>
                      {categories.map((category) => (
                        <Tab
                          key={category.id}
                          className={({ selected }) =>
                            classNames(
                              "whitespace-nowrap rounded-lg py-2.5 px-3 text-sm font-medium leading-5",
                              "ring-white/60 ring-offset-2 ring-offset-[#8B4513] focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white shadow text-[#5C4033]"
                                : "text-[#5C4033]/60 hover:bg-white/[0.12] hover:text-[#5C4033]"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                    
                    <Tab.Panels className="mt-4">
                      <Tab.Panel>
                        {isLoadingItems ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, index) => (
                              <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menuItems.map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4 flex items-center">
                                  <div className="w-20 h-20 rounded overflow-hidden mr-4 flex-shrink-0">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <h3 
                                      className="font-bold text-[#5C4033]"
                                      style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                      {item.name}
                                    </h3>
                                    <p className="text-sm text-[#333333] line-clamp-2 mb-2">
                                      {item.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-[#8B4513]">
                                        ${item.price.toFixed(2)}
                                      </span>
                                      <Button 
                                        size="sm" 
                                        className="bg-[#5C4033] hover:bg-[#8B4513] text-white"
                                        onClick={() => handleAddToCart(item.id)}
                                        disabled={addToCartMutation.isPending}
                                      >
                                        Add to Cart
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Tab.Panel>
                      
                      {categories.map((category) => (
                        <Tab.Panel key={category.id}>
                          {isLoadingItems ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[...Array(4)].map((_, index) => (
                                <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {menuItems
                                .filter((item) => item.categoryId === category.id)
                                .map((item) => (
                                  <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-4 flex items-center">
                                      <div className="w-20 h-20 rounded overflow-hidden mr-4 flex-shrink-0">
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-grow">
                                        <h3 
                                          className="font-bold text-[#5C4033]"
                                          style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                          {item.name}
                                        </h3>
                                        <p className="text-sm text-[#333333] line-clamp-2 mb-2">
                                          {item.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-[#8B4513]">
                                            ${item.price.toFixed(2)}
                                          </span>
                                          <Button 
                                            size="sm" 
                                            className="bg-[#5C4033] hover:bg-[#8B4513] text-white"
                                            onClick={() => handleAddToCart(item.id)}
                                            disabled={addToCartMutation.isPending}
                                          >
                                            Add to Cart
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          )}
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>
                )}
              </TabsContent>
              
              <TabsContent value="featured" className="pt-6">
                {isLoadingItems ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {menuItems
                      .filter(item => item.isFeatured)
                      .map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                          <div className="h-60 overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                              onClick={() => handleAddToCart(item.id)}
                              disabled={addToCartMutation.isPending}
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Shopping Cart */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-xl font-bold text-[#5C4033] flex items-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Your Cart
                  </h2>
                  {cart.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-[#5C4033] border-[#5C4033] hover:bg-[#5C4033]/10"
                      onClick={() => clearCartMutation.mutate()}
                      disabled={clearCartMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {isLoadingCart ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
                    ))}
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-2">Add items from the menu to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-[#5C4033]">{item.menuItem.name}</h4>
                            <p className="text-sm text-gray-500">${item.menuItem.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-3">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="mx-2 w-4 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div>
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-[#5C4033] hover:bg-[#8B4513] text-white"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 bg-[#F5F5DC]/30 rounded-lg p-6">
              <h3 
                className="text-lg font-bold text-[#5C4033] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ordering Information
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#5C4033]">Delivery Areas</h4>
                  <p className="text-sm text-[#333333]">We deliver within a 5-mile radius of our location. Delivery fee varies based on distance.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#5C4033]">Pickup Times</h4>
                  <p className="text-sm text-[#333333]">Orders are typically ready for pickup in 20-30 minutes.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#5C4033]">Special Requests</h4>
                  <p className="text-sm text-[#333333]">For dietary restrictions or special requests, please call us directly at (555) 123-4567.</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-[#333333]">Need a larger order or catering?</p>
                <Link href="/contact">
                  <a className="text-sm text-[#8B4513] font-medium hover:text-[#5C4033]">Contact us for catering options →</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOnline;
