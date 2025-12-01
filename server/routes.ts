import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const SALEOR_API_URL = process.env.SALEOR_API_URL || 'https://dudeabides.wopr.systems/graphql/';
const DEFAULT_CHANNEL = process.env.SALEOR_CHANNEL || 'the-dude-abides-shop';

const PRODUCT_LIST_QUERY = `
  query ProductList($channel: String!, $first: Int) {
    products(channel: $channel, first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail {
            url
            alt
          }
          media {
            id
            url
            alt
            type
          }
          category {
            id
            name
            slug
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          variants {
            id
            name
            sku
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
            attributes {
              attribute {
                name
                slug
              }
              values {
                name
                slug
              }
            }
            media {
              id
              url
              alt
            }
          }
        }
      }
    }
  }
`;

const CATEGORIES_QUERY = `
  query Categories($first: Int) {
    categories(first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
          children(first: 10) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query Collections($channel: String!, $first: Int) {
    collections(channel: $channel, first: $first) {
      edges {
        node {
          id
          name
          slug
          backgroundImage {
            url
            alt
          }
        }
      }
    }
  }
`;

const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($channel: String!, $slug: String!) {
    collection(channel: $channel, slug: $slug) {
      id
      name
      products(first: 8) {
        edges {
          node {
            id
            name
            slug
            thumbnail {
              url
              alt
            }
            pricing {
              priceRange {
                start {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_DETAIL_QUERY = `
  query ProductDetail($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      seoTitle
      seoDescription
      thumbnail {
        url
        alt
      }
      media {
        id
        url
        alt
        type
      }
      category {
        id
        name
        slug
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
          stop {
            gross {
              amount
              currency
            }
          }
        }
      }
      variants {
        id
        name
        sku
        quantityAvailable
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            name
            slug
          }
          values {
            name
            slug
          }
        }
        media {
          id
          url
          alt
        }
      }
      attributes {
        attribute {
          name
          slug
        }
        values {
          name
          slug
        }
      }
    }
  }
`;

async function saleorRequest(query: string, variables: Record<string, any>) {
  const response = await fetch(SALEOR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Saleor API error: ${response.status} - ${text}`);
  }

  const json = await response.json();
  
  if (json.errors && json.errors.length > 0) {
    const errorMessages = json.errors.map((e: any) => e.message).join(', ');
    throw new Error(`Saleor GraphQL error: ${errorMessages}`);
  }

  return json.data;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const { insertProductSchema, insertCartItemSchema } = await import("@shared/schema");
  const { z } = await import("zod");

  // Saleor proxy routes - bypass CORS by making requests server-side
  app.get("/api/saleor/products", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const first = parseInt(req.query.first as string) || 12;
      
      console.log(`[Saleor Proxy] Fetching products - channel: ${channel}, first: ${first}`);
      
      const data = await saleorRequest(PRODUCT_LIST_QUERY, { channel, first });
      const products = data.products?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched ${products.length} products`);
      res.json(products);
    } catch (error: any) {
      console.error("[Saleor Proxy] Products error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saleor/categories", async (req, res) => {
    try {
      const first = parseInt(req.query.first as string) || 20;
      
      console.log(`[Saleor Proxy] Fetching categories - first: ${first}`);
      
      const data = await saleorRequest(CATEGORIES_QUERY, { first });
      const categories = data.categories?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched ${categories.length} categories`);
      res.json(categories);
    } catch (error: any) {
      console.error("[Saleor Proxy] Categories error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saleor/collections", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const first = parseInt(req.query.first as string) || 10;
      
      console.log(`[Saleor Proxy] Fetching collections - channel: ${channel}, first: ${first}`);
      
      const data = await saleorRequest(COLLECTIONS_QUERY, { channel, first });
      const collections = data.collections?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched ${collections.length} collections`);
      res.json(collections);
    } catch (error: any) {
      console.error("[Saleor Proxy] Collections error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saleor/featured", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const slug = (req.query.slug as string) || 'featured';
      
      console.log(`[Saleor Proxy] Fetching featured products - channel: ${channel}, collection: ${slug}`);
      
      const data = await saleorRequest(FEATURED_PRODUCTS_QUERY, { channel, slug });
      const products = data.collection?.products?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched ${products.length} featured products`);
      res.json(products);
    } catch (error: any) {
      console.error("[Saleor Proxy] Featured products error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Single product detail with variants and all images
  app.get("/api/saleor/product/:slug", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const slug = req.params.slug;
      
      console.log(`[Saleor Proxy] Fetching product detail - slug: ${slug}, channel: ${channel}`);
      
      const data = await saleorRequest(PRODUCT_DETAIL_QUERY, { slug, channel });
      
      if (!data.product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log(`[Saleor Proxy] Fetched product: ${data.product.name} with ${data.product.variants?.length || 0} variants`);
      res.json(data.product);
    } catch (error: any) {
      console.error("[Saleor Proxy] Product detail error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

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
