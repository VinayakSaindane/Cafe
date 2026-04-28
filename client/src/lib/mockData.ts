import { MenuCategory, MenuItem, Review, BlogPost, Employee, TableAvailability } from "@shared/schema";

export const mockCategories: MenuCategory[] = [
  { id: "coffee", name: "Coffee", description: "Our signature coffees", displayOrder: 1 },
  { id: "tea", name: "Tea", description: "Fine selection of teas", displayOrder: 2 },
  { id: "breakfast", name: "Breakfast", description: "Morning favorites", displayOrder: 3 },
  { id: "lunch", name: "Lunch", description: "Midday delights", displayOrder: 4 },
  { id: "desserts", name: "Desserts", description: "Sweet treats", displayOrder: 5 }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Signature Latte",
    description: "Our signature espresso blend with velvety steamed milk and a touch of caramel.",
    price: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "coffee"
  },
  {
    id: 2,
    name: "Avocado Toast",
    description: "Sourdough toast topped with smashed avocado, poached egg, and chili flakes.",
    price: 8.75,
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "breakfast"
  },
  {
    id: 3,
    name: "Artisan Sandwich",
    description: "Freshly baked ciabatta with roasted turkey, aged cheese, and housemade aioli.",
    price: 9.50,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "lunch"
  },
  {
    id: 4,
    name: "Mocha Cloud",
    description: "Rich espresso with dark chocolate, steamed milk, whipped cream, and cocoa dust.",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1579888071069-c107a6f79d82?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "coffee"
  },
  {
    id: 5,
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and milk foam for a perfectly balanced coffee experience.",
    price: 4.50,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "coffee"
  },
  {
    id: 6,
    name: "Chai Latte",
    description: "Black tea infused with cinnamon, cardamom and cloves, combined with steamed milk.",
    price: 4.75,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "tea"
  },
  {
    id: 7,
    name: "Iced Matcha",
    description: "Ceremonial matcha shaken with milk, vanilla, and ice for a smooth green tea finish.",
    price: 5.15,
    imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "tea"
  },
  {
    id: 8,
    name: "Breakfast Croissant",
    description: "Buttery croissant layered with egg, cheddar, tomato jam, and peppery greens.",
    price: 7.95,
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "breakfast"
  },
  {
    id: 9,
    name: "Berry Yogurt Bowl",
    description: "Greek yogurt with seasonal berries, honey almond granola, chia, and mint.",
    price: 7.50,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "breakfast"
  },
  {
    id: 10,
    name: "Pesto Chicken Panini",
    description: "Grilled sourdough with chicken, basil pesto, mozzarella, roasted peppers, and arugula.",
    price: 10.75,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "lunch"
  },
  {
    id: 11,
    name: "Garden Grain Bowl",
    description: "Quinoa, roasted vegetables, chickpeas, greens, feta, and lemon herb dressing.",
    price: 11.25,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "lunch"
  },
  {
    id: 12,
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    price: 6.95,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "desserts"
  },
  {
    id: 13,
    name: "Chocolate Hazelnut Tart",
    description: "Crisp cocoa shell filled with silky hazelnut ganache and toasted nuts.",
    price: 6.75,
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: true,
    categoryId: "desserts"
  },
  {
    id: 14,
    name: "Lemon Blueberry Cake",
    description: "Tender lemon sponge with blueberry compote and a light cream cheese frosting.",
    price: 6.25,
    imageUrl: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=500&h=350&q=80",
    isFeatured: false,
    categoryId: "desserts"
  }
];

export const mockReviews: Review[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    title: "Regular Customer",
    rating: 5,
    content: "The coffee here is absolutely incredible! I've tried many cafes in the city, but Brew & Bite has the perfect balance of flavor and atmosphere. Their avocado toast is also a must-try!",
    createdAt: new Date()
  },
  {
    id: 2,
    author: "Michael Peterson",
    title: "Business Professional",
    rating: 5,
    content: "The Pick & Go service has been a game-changer for my morning routine. I can order on my way to work and have my coffee and breakfast ready when I arrive. Efficient and always delicious!",
    createdAt: new Date()
  },
  {
    id: 3,
    author: "Amanda Lee",
    title: "Event Planner",
    rating: 5,
    content: "I recently hosted a small gathering at Brew & Bite and was thoroughly impressed with their service. The staff went above and beyond to accommodate our group, and everyone loved the food and drinks.",
    createdAt: new Date()
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Coffee Roasting: From Bean to Cup",
    author: "Emma Baker",
    excerpt: "Discover the intricate process of coffee roasting and how it affects the flavor profile of your favorite morning brew.",
    content: "Coffee roasting is a transformative process that turns green coffee beans into the aromatic brown beans we all know and love...",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&h=300&q=80",
    publishedAt: new Date(2023, 5, 15)
  },
  {
    id: 2,
    title: "Seasonal Ingredients: Our Summer Menu Inspiration",
    author: "Chef Lucas",
    excerpt: "Learn about the local, seasonal ingredients that inspired our new summer menu.",
    content: "At Brew & Bite, we believe that the best food starts with the best ingredients...",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&h=300&q=80",
    publishedAt: new Date(2023, 4, 28)
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "David Wilson",
    position: "Head Barista",
    bio: "David has been crafting exceptional coffee for over 10 years.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    position: "Executive Chef",
    bio: "With experience in renowned restaurants across the country, Maria brings creativity and expertise.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export const mockAvailability: TableAvailability[] = [
  { id: 1, timeSlot: "Breakfast (9AM-11AM)", today: "Limited", tomorrow: "Available", dayAfter: "Available" },
  { id: 2, timeSlot: "Lunch (12PM-2PM)", today: "Fully Booked", tomorrow: "Limited", dayAfter: "Available" },
  { id: 3, timeSlot: "Afternoon (3PM-5PM)", today: "Available", tomorrow: "Available", dayAfter: "Available" },
  { id: 4, timeSlot: "Evening (6PM-8PM)", today: "Limited", tomorrow: "Limited", dayAfter: "Available" }
];
