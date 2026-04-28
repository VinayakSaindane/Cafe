import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  bookingSchema, 
  reviewSchema, 
  contactSchema,
  insertBlogPostSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Menu Category Routes
  app.get("/api/menu/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu categories" });
    }
  });

  // Menu Item Routes
  app.get("/api/menu/items", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === "string") {
        const items = await storage.getMenuItemsByCategory(category);
        res.json(items);
      } else {
        const items = await storage.getMenuItems();
        res.json(items);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items" });
    }
  });

  app.get("/api/menu/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const item = await storage.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu item" });
    }
  });

  app.get("/api/menu/featured", async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedMenuItems();
      res.json(featuredItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured items" });
    }
  });

  // Review Routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = reviewSchema.omit({ id: true }).safeParse(req.body);
      
      if (!reviewData.success) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: reviewData.error.flatten() 
        });
      }

      const newReview = await storage.createReview(reviewData.data);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Blog Post Routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const posts = await storage.getRecentBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent blog posts" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.omit({ id: true }).safeParse({
        ...req.body,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date()
      });

      if (!blogData.success) {
        return res.status(400).json({
          message: "Invalid blog post data",
          errors: blogData.error.flatten()
        });
      }

      const newPost = await storage.createBlogPost(blogData.data);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Error creating blog post" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Team/Employees Routes
  app.get("/api/team", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members" });
    }
  });

  // Booking Routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = bookingSchema.safeParse(req.body);
      
      if (!bookingData.success) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: bookingData.error.flatten() 
        });
      }

      const newBooking = await storage.createBooking(bookingData.data);
      res.status(201).json({ 
        message: "Booking successful", 
        booking: newBooking 
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing booking" });
    }
  });

  app.get("/api/availability", async (req, res) => {
    try {
      const availability = await storage.getTableAvailability();
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Error fetching table availability" });
    }
  });

  // Contact Form Route
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactSchema.safeParse(req.body);
      
      if (!contactData.success) {
        return res.status(400).json({ 
          message: "Invalid contact form data", 
          errors: contactData.error.flatten() 
        });
      }

      // In a real app, you would send this data via email or save to database
      res.status(200).json({ 
        message: "Message received successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing contact form" });
    }
  });

  // Cart Routes
  app.get("/api/cart", async (req, res) => {
    try {
      // In a real app, you would use a proper session ID
      const sessionId = req.headers["x-session-id"]?.toString() || "default-session";
      
      const cartItems = await storage.getCartItemsBySession(sessionId);
      
      // Fetch menu items for each cart item
      const itemsWithDetails = await Promise.all(cartItems.map(async (item) => {
        const menuItem = await storage.getMenuItemById(item.menuItemId);
        return {
          ...item,
          menuItem
        };
      }));

      res.json(itemsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { itemId, quantity = 1 } = req.body;
      
      // Validate input
      if (!itemId || typeof itemId !== "number") {
        return res.status(400).json({ message: "Valid item ID is required" });
      }
      
      // In a real app, you would use a proper session ID
      const sessionId = req.headers["x-session-id"]?.toString() || "default-session";
      
      // Check if item exists
      const menuItem = await storage.getMenuItemById(itemId);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      // Add to cart
      const cartItem = await storage.addItemToCart({
        sessionId,
        menuItemId: itemId,
        quantity,
        createdAt: new Date()
      });
      
      res.status(201).json({ 
        message: "Item added to cart", 
        item: {
          ...cartItem,
          menuItem
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      await storage.removeItemFromCart(id);
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      // In a real app, you would use a proper session ID
      const sessionId = req.headers["x-session-id"]?.toString() || "default-session";
      
      await storage.clearCart(sessionId);
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  // Pickup Order Routes
  app.post("/api/pickup-orders", async (req, res) => {
    try {
      const { customerName, customerPhone, pickupTime, items } = req.body;

      // Validate input
      if (!customerName || !customerPhone || !pickupTime || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Create the pickup order
      const order = await storage.createPickupOrder({
        customerName,
        customerPhone,
        pickupTime,
        status: "pending",
        createdAt: new Date()
      });

      // Add order items
      const orderItems = await Promise.all(items.map(async (item: { itemId: number, quantity: number }) => {
        const menuItem = await storage.getMenuItemById(item.itemId);
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.itemId} not found`);
        }

        return storage.addPickupOrderItem({
          orderId: order.id,
          menuItemId: item.itemId,
          quantity: item.quantity,
          price: menuItem.price
        });
      }));

      res.status(201).json({
        message: "Pickup order created successfully",
        order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating pickup order" });
    }
  });

  // Regular Order Routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { 
        customerName, 
        customerEmail, 
        customerPhone, 
        deliveryAddress, 
        isDelivery, 
        items,
        total
      } = req.body;

      // Validate input
      if (!customerName || !customerEmail || !customerPhone || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Create the order
      const order = await storage.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: deliveryAddress || null,
        isDelivery: !!isDelivery,
        status: "pending",
        total,
        createdAt: new Date()
      });

      // Add order items
      const orderItems = await Promise.all(items.map(async (item: { menuItemId: number, quantity: number }) => {
        const menuItem = await storage.getMenuItemById(item.menuItemId);
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.menuItemId} not found`);
        }

        return storage.addOrderItem({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price
        });
      }));

      const sessionId = req.headers["x-session-id"]?.toString() || "default-session";
      await storage.clearCart(sessionId);

      res.status(201).json({
        message: "Order created successfully",
        order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
