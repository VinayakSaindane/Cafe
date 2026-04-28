import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tab } from "@headlessui/react";
import { Link } from "wouter";
import { MenuItem, MenuCategory } from "@shared/schema";
import MenuItemCard from "@/components/MenuItemCard";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: menuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: [selectedCategory ? `/api/menu/items?category=${selectedCategory}` : "/api/menu/items"],
  });

  const handleAddToCart = async (item: MenuItem) => {
    // Cart functionality will use the existing API requests
    await queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Menu
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            We take pride in our carefully crafted menu, featuring fresh, locally sourced ingredients and house-made specialties.
          </p>
        </div>

        {isLoadingCategories ? (
          <div className="max-w-3xl mx-auto mb-8 h-12 bg-gray-100 rounded animate-pulse"></div>
        ) : (
          <Tab.Group onChange={(index) => setSelectedCategory(index === 0 ? null : categories[index - 1]?.id || null)}>
            <Tab.List className="flex space-x-1 rounded-xl bg-[#F5F5DC]/20 p-1 max-w-3xl mx-auto mb-8">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
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
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
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
            <Tab.Panels>
              <Tab.Panel>
                {isLoadingItems ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                    ))}
                  </div>
                )}
              </Tab.Panel>
              {categories.map((category) => (
                <Tab.Panel key={category.id}>
                  {isLoadingItems ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {menuItems
                        .filter((item) => item.categoryId === category.id)
                        .map((item) => (
                          <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        )}

        <div className="mt-16 text-center">
          <h2 
            className="text-2xl font-bold text-[#5C4033] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to Order?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/order-online">
              <Button 
                className="bg-[#5C4033] hover:bg-[#8B4513] text-white px-8"
                size="lg"
              >
                Order for Pickup
              </Button>
            </Link>
            <Link href="/order-online">
              <Button 
                className="bg-[#8B4513] hover:bg-[#5C4033] text-white px-8"
                size="lg"
              >
                Order for Delivery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
