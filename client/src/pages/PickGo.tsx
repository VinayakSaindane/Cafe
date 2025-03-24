import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MenuItem, MenuCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const pickupTimeSchema = z.object({
  time: z.string().min(1, "Please select a pickup time"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type PickupFormValues = z.infer<typeof pickupTimeSchema>;

const PickGo = () => {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: menuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
  });

  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupTimeSchema),
    defaultValues: {
      time: "",
      name: "",
      phone: "",
    },
  });

  const handleAddToSelection = (item: MenuItem) => {
    setSelectedItems([...selectedItems, item]);
    setCart({
      ...cart,
      [item.id]: (cart[item.id] || 0) + 1,
    });
  };

  const handleRemoveFromSelection = (itemId: number) => {
    const itemIndex = selectedItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(itemIndex, 1);
      setSelectedItems(newSelectedItems);
      
      const newCart = { ...cart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      setCart(newCart);
    }
  };

  const onSubmit = async (data: PickupFormValues) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add at least one item to your order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderItems = Object.entries(cart).map(([itemId, quantity]) => ({
        itemId: parseInt(itemId),
        quantity,
      }));

      await apiRequest("POST", "/api/pickup-orders", { 
        pickupTime: data.time,
        customerName: data.name,
        customerPhone: data.phone,
        items: orderItems
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order will be ready for pickup at ${data.time}. We'll send a confirmation to your phone.`,
      });

      // Reset form and cart
      form.reset();
      setSelectedItems([]);
      setCart({});
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pick & Go
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Order ahead and skip the wait. Your freshly prepared items will be ready when you arrive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue={categories[0]?.id || "all"} className="w-full">
              <TabsList className="w-full overflow-x-auto flex-wrap">
                <TabsTrigger value="all">All Items</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isLoadingItems ? (
                    [...Array(6)].map((_, index) => (
                      <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))
                  ) : (
                    menuItems.map((item) => (
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
                                onClick={() => handleAddToSelection(item)}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoadingItems ? (
                      [...Array(4)].map((_, index) => (
                        <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                      ))
                    ) : (
                      menuItems
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
                                    onClick={() => handleAddToSelection(item)}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 
                  className="text-xl font-bold text-[#5C4033] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your Order
                </h2>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Your order is empty.</p>
                    <p className="text-sm mt-2">Add items from the menu to get started.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {Object.entries(cart).map(([itemId, quantity]) => {
                        const item = menuItems.find((i) => i.id === parseInt(itemId));
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-[#F5F5DC] rounded-full flex items-center justify-center text-sm mr-2">
                                {quantity}
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-4">${(item.price * quantity).toFixed(2)}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-6 w-6 rounded-full p-0 border-[#5C4033]"
                                onClick={() => handleRemoveFromSelection(parseInt(itemId))}
                              >
                                <span className="sr-only">Remove</span>
                                <span aria-hidden="true">-</span>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pickup time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => {
                                const hour = new Date();
                                hour.setTime(hour.getTime() + (i + 1) * 30 * 60000);
                                const timeStr = hour.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                });
                                return (
                                  <SelectItem key={i} value={timeStr}>
                                    {timeStr}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
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
                      name="phone"
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

                    <Button 
                      type="submit" 
                      className="w-full bg-[#5C4033] hover:bg-[#8B4513] text-white"
                      disabled={selectedItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-6 bg-[#F5F5DC]/30 rounded-lg p-6">
              <h3 
                className="text-lg font-bold text-[#5C4033] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pick & Go Instructions
              </h3>
              <ol className="space-y-2 text-[#333333]">
                <li className="flex items-start">
                  <span className="bg-[#5C4033] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">1</span>
                  <span>Select your items and enter your details</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#5C4033] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">2</span>
                  <span>Choose a pickup time (at least 15 min from now)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#5C4033] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">3</span>
                  <span>Receive confirmation via text message</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#5C4033] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">4</span>
                  <span>Pick up your order at the designated counter</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickGo;
