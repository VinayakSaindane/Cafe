import { 
  users, 
  User, 
  InsertUser, 
  MenuItem, 
  MenuCategory, 
  InsertMenuItem, 
  InsertMenuCategory,
  Review,
  InsertReview,
  BlogPost,
  InsertBlogPost,
  Employee,
  InsertEmployee,
  Booking,
  InsertBooking,
  TableAvailability, 
  InsertTableAvailability,
  PickupOrder,
  InsertPickupOrder,
  PickupOrderItem,
  InsertPickupOrderItem,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  CartItem,
  InsertCartItem
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu category methods
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuCategoryById(id: string): Promise<MenuCategory | undefined>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;

  // Menu item methods
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  getFeaturedMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  // Review methods
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getRecentBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Employee methods
  getEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getTableAvailability(): Promise<TableAvailability[]>;

  // Cart methods
  getCartItemsBySession(sessionId: string): Promise<CartItem[]>;
  addItemToCart(item: InsertCartItem): Promise<CartItem>;
  removeItemFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Pickup order methods
  createPickupOrder(order: InsertPickupOrder): Promise<PickupOrder>;
  addPickupOrderItem(item: InsertPickupOrderItem): Promise<PickupOrderItem>;

  // Regular order methods
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuCategories: Map<string, MenuCategory>;
  private menuItems: Map<number, MenuItem>;
  private reviews: Map<number, Review>;
  private blogPosts: Map<number, BlogPost>;
  private employees: Map<number, Employee>;
  private bookings: Map<number, Booking>;
  private tableAvailability: Map<number, TableAvailability>;
  private cartItems: Map<number, CartItem>;
  private pickupOrders: Map<number, PickupOrder>;
  private pickupOrderItems: Map<number, PickupOrderItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;

  // ID counters
  private userIdCounter: number;
  private menuItemIdCounter: number;
  private reviewIdCounter: number;
  private blogPostIdCounter: number;
  private employeeIdCounter: number;
  private bookingIdCounter: number;
  private availabilityIdCounter: number;
  private cartItemIdCounter: number;
  private pickupOrderIdCounter: number;
  private pickupOrderItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.menuCategories = new Map();
    this.menuItems = new Map();
    this.reviews = new Map();
    this.blogPosts = new Map();
    this.employees = new Map();
    this.bookings = new Map();
    this.tableAvailability = new Map();
    this.cartItems = new Map();
    this.pickupOrders = new Map();
    this.pickupOrderItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    this.userIdCounter = 1;
    this.menuItemIdCounter = 1;
    this.reviewIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.employeeIdCounter = 1;
    this.bookingIdCounter = 1;
    this.availabilityIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.pickupOrderIdCounter = 1;
    this.pickupOrderItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Menu Categories
    const categories = [
      { id: "coffee", name: "Coffee", description: "Our signature coffees", displayOrder: 1 },
      { id: "tea", name: "Tea", description: "Fine selection of teas", displayOrder: 2 },
      { id: "breakfast", name: "Breakfast", description: "Morning favorites", displayOrder: 3 },
      { id: "lunch", name: "Lunch", description: "Midday delights", displayOrder: 4 },
      { id: "desserts", name: "Desserts", description: "Sweet treats", displayOrder: 5 }
    ];

    categories.forEach(cat => {
      this.menuCategories.set(cat.id, cat as MenuCategory);
    });

    // Menu Items
    const items = [
      {
        id: this.menuItemIdCounter++,
        name: "Signature Latte",
        description: "Our signature espresso blend with velvety steamed milk and a touch of caramel.",
        price: 4.95,
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "coffee"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Avocado Toast",
        description: "Sourdough toast topped with smashed avocado, poached egg, and chili flakes.",
        price: 8.75,
        imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "breakfast"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Artisan Sandwich",
        description: "Freshly baked ciabatta with roasted turkey, aged cheese, and housemade aioli.",
        price: 9.50,
        imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "lunch"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Mocha Cloud",
        description: "Rich espresso with dark chocolate, steamed milk, whipped cream, and cocoa dust.",
        price: 5.25,
        imageUrl: "https://images.unsplash.com/photo-1579888071069-c107a6f79d82?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "coffee"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and milk foam for a perfectly balanced coffee experience.",
        price: 4.50,
        imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "coffee"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Chai Latte",
        description: "Black tea infused with cinnamon, cardamom and cloves, combined with steamed milk.",
        price: 4.75,
        imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "tea"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Iced Matcha",
        description: "Ceremonial matcha shaken with milk, vanilla, and ice for a smooth green tea finish.",
        price: 5.15,
        imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "tea"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Breakfast Croissant",
        description: "Buttery croissant layered with egg, cheddar, tomato jam, and peppery greens.",
        price: 7.95,
        imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "breakfast"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Berry Yogurt Bowl",
        description: "Greek yogurt with seasonal berries, honey almond granola, chia, and mint.",
        price: 7.50,
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "breakfast"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Pesto Chicken Panini",
        description: "Grilled sourdough with chicken, basil pesto, mozzarella, roasted peppers, and arugula.",
        price: 10.75,
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "lunch"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Garden Grain Bowl",
        description: "Quinoa, roasted vegetables, chickpeas, greens, feta, and lemon herb dressing.",
        price: 11.25,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "lunch"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Tiramisu",
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
        price: 6.95,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "desserts"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Chocolate Hazelnut Tart",
        description: "Crisp cocoa shell filled with silky hazelnut ganache and toasted nuts.",
        price: 6.75,
        imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: true,
        categoryId: "desserts"
      },
      {
        id: this.menuItemIdCounter++,
        name: "Lemon Blueberry Cake",
        description: "Tender lemon sponge with blueberry compote and a light cream cheese frosting.",
        price: 6.25,
        imageUrl: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        isFeatured: false,
        categoryId: "desserts"
      }
    ];

    items.forEach(item => {
      this.menuItems.set(item.id, item as MenuItem);
    });

    // Reviews
    const reviews = [
      {
        id: this.reviewIdCounter++,
        author: "Sarah Johnson",
        title: "Regular Customer",
        rating: 5,
        content: "The coffee here is absolutely incredible! I've tried many cafes in the city, but Brew & Bite has the perfect balance of flavor and atmosphere. Their avocado toast is also a must-try!",
        createdAt: new Date()
      },
      {
        id: this.reviewIdCounter++,
        author: "Michael Peterson",
        title: "Business Professional",
        rating: 4.5,
        content: "The Pick & Go service has been a game-changer for my morning routine. I can order on my way to work and have my coffee and breakfast ready when I arrive. Efficient and always delicious!",
        createdAt: new Date()
      },
      {
        id: this.reviewIdCounter++,
        author: "Amanda Lee",
        title: "Event Planner",
        rating: 5,
        content: "I recently hosted a small gathering at Brew & Bite and was thoroughly impressed with their service. The staff went above and beyond to accommodate our group, and everyone loved the food and drinks.",
        createdAt: new Date()
      },
      {
        id: this.reviewIdCounter++,
        author: "David Martinez",
        title: "Freelancer",
        rating: 4,
        content: "Great atmosphere for working remotely. The wifi is reliable, and they don't mind if you stay for a few hours. Their specialty teas are exceptional, and the pastries are always fresh.",
        createdAt: new Date()
      },
      {
        id: this.reviewIdCounter++,
        author: "Priya Shah",
        title: "Weekend Visitor",
        rating: 5,
        content: "The staff made great recommendations and the chocolate hazelnut tart was outstanding. It felt relaxed, clean, and easy to enjoy with friends.",
        createdAt: new Date()
      },
      {
        id: this.reviewIdCounter++,
        author: "Noah Williams",
        title: "Pickup Customer",
        rating: 5,
        content: "Ordering ahead worked smoothly. My latte and panini were ready on time, packed neatly, and still tasted fresh when I got back to the office.",
        createdAt: new Date()
      }
    ];

    reviews.forEach(review => {
      this.reviews.set(review.id, review as Review);
    });

    // Blog Posts
    const blogPosts = [
      {
        id: this.blogPostIdCounter++,
        title: "The Art of Coffee Roasting: From Bean to Cup",
        author: "Emma Baker",
        excerpt: "Discover the intricate process of coffee roasting and how it affects the flavor profile of your favorite morning brew.",
        content: "Coffee roasting is a transformative process that turns green coffee beans into the aromatic brown beans we all know and love. The process involves applying heat to green coffee beans, causing them to change in taste, chemical composition, and physical appearance. The degree to which coffee beans are roasted affects the flavor of the brewed cup, making roasting an essential step in crafting the perfect coffee experience.\n\nAt Brew & Bite, our master roaster carefully monitors each batch, ensuring that every bean reaches its optimal roasting level. We believe that the roasting process is where the magic happens - it's where the bean's true character is revealed.\n\nDifferent roasting levels produce different flavor profiles:\n\n- Light roasts retain more of the bean's original flavor characteristics, often featuring bright acidity and complex fruit or floral notes.\n- Medium roasts balance acidity with body, often showcasing a more rounded flavor profile with notes of chocolate, nuts, and caramel.\n- Dark roasts develop bold, smoky flavors with less acidity and more body.\n\nNext time you visit us, ask our baristas about the roast level of our current offerings. They'll be happy to guide you through our selection and help you find the perfect cup to match your preferences.",
        imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        publishedAt: new Date(2023, 5, 15) // June 15, 2023
      },
      {
        id: this.blogPostIdCounter++,
        title: "Seasonal Ingredients: Our Summer Menu Inspiration",
        author: "Chef Lucas",
        excerpt: "Learn about the local, seasonal ingredients that inspired our new summer menu.",
        content: "At Brew & Bite, we believe that the best food starts with the best ingredients. That's why we're excited to share the inspiration behind our new summer menu - a celebration of the season's bounty.\n\nThis summer, we've partnered with local farmers to bring you the freshest produce available. From sun-ripened tomatoes to fragrant basil, our kitchen is filled with the vibrant colors and aromas of summer.\n\nOur new Summer Berry Salad features a mix of locally grown strawberries, blueberries, and blackberries atop a bed of crisp mixed greens. Topped with crumbled goat cheese and honey-roasted walnuts, then drizzled with our house-made raspberry vinaigrette, it's a refreshing dish perfect for warm days.\n\nThe Summer Harvest Sandwich showcases heirloom tomatoes, fresh mozzarella, and basil pesto on our artisan sourdough bread. It's a simple yet satisfying option that lets the quality of each ingredient shine through.\n\nFor those with a sweet tooth, don't miss our Peach Lavender Scone. Made with juicy peaches from a nearby orchard and a hint of lavender, these scones pair perfectly with our cold brew coffee.\n\nWe invite you to join us in savoring the flavors of summer. Our seasonal menu will be available through August, so be sure to stop by and taste the difference that fresh, local ingredients make.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        publishedAt: new Date(2023, 4, 28) // May 28, 2023
      },
      {
        id: this.blogPostIdCounter++,
        title: "Coffee Shop Culture: The New Remote Office",
        author: "Sarah Thompson",
        excerpt: "Explore the growing trend of remote work and how cafes like ours are adapting.",
        content: "The way we work has changed dramatically in recent years, with more people than ever embracing remote work. As a result, coffee shops have evolved from simple beverage stops to bustling hubs of productivity and creativity.\n\nAt Brew & Bite, we've embraced this shift by creating an environment that caters to both social gatherings and focused work sessions. Our comfortable seating, reliable high-speed WiFi, and ample power outlets make it easy to settle in for a productive day away from the traditional office.\n\nBut what makes a coffee shop an ideal workspace? Beyond the practical amenities, there's something special about the ambient buzz of a café – the gentle hum of conversations, the rhythmic sounds of the espresso machine, and the comforting aroma of freshly brewed coffee. Many remote workers find that this environment strikes the perfect balance between isolation and overstimulation, creating an atmosphere conducive to focus and creativity.\n\nWe've also introduced features specifically designed for our working guests:\n\n- Extended table times during weekday business hours\n- A dedicated quiet zone in our upstairs area\n- Meeting room rentals for collaborative sessions\n- Special weekday worker promotions, like our \"Productivity Package\" that includes unlimited coffee refills\n\nWhether you're a freelancer looking for a change of scenery, a remote employee seeking escape from the home office, or an entrepreneur in need of an inspiring space to develop your next big idea, we've got you covered.\n\nNext time you need a productive workspace, grab your laptop and join our community of remote workers. We're more than happy to be your office away from office.",
        imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        publishedAt: new Date(2023, 4, 10) // May 10, 2023
      },
      {
        id: this.blogPostIdCounter++,
        title: "How We Build a Better Breakfast Menu",
        author: "Brew & Bite Kitchen",
        excerpt: "A look at the small choices behind our breakfast favorites, from bread texture to balanced toppings.",
        content: "A cafe breakfast should be satisfying without slowing down the rest of your day. When we develop breakfast dishes, we focus on contrast: crisp toast with soft egg, creamy yogurt with toasted granola, bright herbs against richer cheese, and coffee pairings that make each plate feel complete.\n\nOur team tests each item for dine-in and pickup so the food holds up well whether you stay with us or take it on the go. That means using sturdy sourdough for avocado toast, keeping sauces bright but not watery, and choosing toppings that travel cleanly.\n\nThe goal is simple: food that feels thoughtfully made, easy to order, and worth coming back for on a regular morning.",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        publishedAt: new Date(2024, 1, 8)
      },
      {
        id: this.blogPostIdCounter++,
        title: "What Makes a Great Pickup Order",
        author: "Brew & Bite Team",
        excerpt: "Fresh food, clear timing, and reliable packaging are the quiet details that make online ordering work.",
        content: "Pickup ordering works best when every step is predictable. Guests should know what is available, how long preparation will take, and what to expect when they arrive. Behind the counter, we batch drinks carefully, label orders clearly, and keep hot and cold items separated.\n\nWe also choose menu items that stay delicious after a short walk or drive. Paninis are pressed to keep their structure, bowls are packed with dressing on the side when needed, and pastries are boxed so they arrive looking as good as they taste.\n\nIt is not complicated, but it takes attention. That is the standard we aim for every time an online order comes through.",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        publishedAt: new Date(2024, 0, 18)
      }
    ];

    blogPosts.forEach(post => {
      this.blogPosts.set(post.id, post as BlogPost);
    });

    // Employees/Team
    const employees = [
      {
        id: this.employeeIdCounter++,
        name: "David Wilson",
        position: "Head Barista",
        bio: "David has been crafting exceptional coffee for over 10 years. His passion for the perfect extraction is matched only by his friendly demeanor.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      },
      {
        id: this.employeeIdCounter++,
        name: "Maria Rodriguez",
        position: "Executive Chef",
        bio: "With experience in renowned restaurants across the country, Maria brings creativity and expertise to our food menu.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      },
      {
        id: this.employeeIdCounter++,
        name: "James Chen",
        position: "Co-Founder",
        bio: "James founded Brew & Bite with a vision to create a community space where quality coffee and food bring people together.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      },
      {
        id: this.employeeIdCounter++,
        name: "Sophie Williams",
        position: "Pastry Chef",
        bio: "Sophie's delicate pastries and desserts add the perfect sweet touch to our menu. Each creation is a work of art.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      },
      {
        id: this.employeeIdCounter++,
        name: "Marcus Johnson",
        position: "Customer Experience Manager",
        bio: "Marcus ensures that every visit to Brew & Bite exceeds expectations. His attention to detail makes all the difference.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      },
      {
        id: this.employeeIdCounter++,
        name: "Lily Patel",
        position: "Tea Specialist",
        bio: "Lily's extensive knowledge of tea varieties and brewing techniques has elevated our tea program to new heights.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
      }
    ];

    employees.forEach(employee => {
      this.employees.set(employee.id, employee as Employee);
    });

    // Table Availability
    const availability = [
      {
        id: this.availabilityIdCounter++,
        timeSlot: "Breakfast (9AM-11AM)",
        today: "Limited",
        tomorrow: "Available",
        dayAfter: "Available"
      },
      {
        id: this.availabilityIdCounter++,
        timeSlot: "Lunch (12PM-2PM)",
        today: "Fully Booked",
        tomorrow: "Limited",
        dayAfter: "Available"
      },
      {
        id: this.availabilityIdCounter++,
        timeSlot: "Afternoon (3PM-5PM)",
        today: "Available",
        tomorrow: "Available",
        dayAfter: "Available"
      },
      {
        id: this.availabilityIdCounter++,
        timeSlot: "Evening (6PM-8PM)",
        today: "Limited",
        tomorrow: "Limited",
        dayAfter: "Available"
      }
    ];

    availability.forEach(slot => {
      this.tableAvailability.set(slot.id, slot as TableAvailability);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Menu category methods
  async getMenuCategories(): Promise<MenuCategory[]> {
    return Array.from(this.menuCategories.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getMenuCategoryById(id: string): Promise<MenuCategory | undefined> {
    return this.menuCategories.get(id);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const newCategory = { ...category } as MenuCategory;
    this.menuCategories.set(category.id, newCategory);
    return newCategory;
  }

  // Menu item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.categoryId === categoryId);
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.isFeatured);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemIdCounter++;
    const newItem: MenuItem = { ...item, id, isFeatured: item.isFeatured ?? false };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { ...review, id, createdAt: review.createdAt ?? new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const newPost: BlogPost = { ...post, id, publishedAt: post.publishedAt ?? new Date() };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = this.employeeIdCounter++;
    const newEmployee: Employee = { ...employee, id };
    this.employees.set(id, newEmployee);
    return newEmployee;
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const newBooking: Booking = { ...booking, id, notes: booking.notes ?? null, createdAt: booking.createdAt ?? new Date() };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getTableAvailability(): Promise<TableAvailability[]> {
    return Array.from(this.tableAvailability.values());
  }

  // Cart methods
  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
  }

  async addItemToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const newItem: CartItem = { ...item, id, quantity: item.quantity ?? 1, createdAt: item.createdAt ?? new Date() };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async removeItemFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const cartItems = await this.getCartItemsBySession(sessionId);
    cartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
  }

  // Pickup order methods
  async createPickupOrder(order: InsertPickupOrder): Promise<PickupOrder> {
    const id = this.pickupOrderIdCounter++;
    const newOrder: PickupOrder = { ...order, id, status: order.status ?? "pending", createdAt: order.createdAt ?? new Date() };
    this.pickupOrders.set(id, newOrder);
    return newOrder;
  }

  async addPickupOrderItem(item: InsertPickupOrderItem): Promise<PickupOrderItem> {
    const id = this.pickupOrderItemIdCounter++;
    const newItem: PickupOrderItem = { ...item, id, quantity: item.quantity ?? 1 };
    this.pickupOrderItems.set(id, newItem);
    return newItem;
  }

  // Regular order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = {
      ...order,
      id,
      status: order.status ?? "pending",
      deliveryAddress: order.deliveryAddress ?? null,
      isDelivery: order.isDelivery ?? false,
      createdAt: order.createdAt ?? new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newItem: OrderItem = { ...item, id, quantity: item.quantity ?? 1 };
    this.orderItems.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();
