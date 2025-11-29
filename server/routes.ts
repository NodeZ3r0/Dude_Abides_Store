import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const { insertProductSchema, insertCartItemSchema } = await import("@shared/schema");
  const { z } = await import("zod");

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const validated = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validated);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.sessionID;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.sessionID;
      const validated = insertCartItemSchema.parse({
        ...req.body,
        sessionId,
      });
      const item = await storage.addToCart(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const item = await storage.updateCartItemQuantity(id, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(item);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.sessionID;
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Admin route to seed initial products
  app.post("/api/admin/seed", async (req, res) => {
    try {
      const sampleProducts = [
        {
          name: "The Dude Cardigan",
          description: "The classic knit sweater that ties the room together.",
          price: "89.99",
          category: "Apparel",
          image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
          vendor: "custom" as const,
          inStock: true,
        },
        {
          name: "Abide Bowling Pin Tee",
          description: "Strike! A comfortable tee for league night.",
          price: "29.99",
          category: "Apparel",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
          vendor: "printful" as const,
          inStock: true,
        }
      ];

      const created = await Promise.all(
        sampleProducts.map(p => storage.createProduct(p))
      );

      res.status(201).json({ message: "Products seeded", count: created.length });
    } catch (error) {
      console.error("Error seeding products:", error);
      res.status(500).json({ message: "Failed to seed products" });
    }
  });

  return httpServer;
}
