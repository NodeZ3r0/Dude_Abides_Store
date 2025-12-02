import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

const SALEOR_API_URL = process.env.SALEOR_API_URL || 'https://dudeabides.wopr.systems/graphql/';
const SALEOR_MEDIA_URL = process.env.SALEOR_MEDIA_URL || 'https://dudeabides.wopr.systems';
const DEFAULT_CHANNEL = process.env.SALEOR_CHANNEL || 'the-dude-abides-shop';

// Rewrite Saleor media URLs from internal Docker URLs to public URLs
function rewriteMediaUrls(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    // Rewrite localhost:8000 URLs to the public Saleor URL
    return obj.replace(/http:\/\/localhost:8000/g, SALEOR_MEDIA_URL)
              .replace(/http:\/\/saleor-api-dude:8000/g, SALEOR_MEDIA_URL);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => rewriteMediaUrls(item));
  }
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = rewriteMediaUrls(obj[key]);
    }
    return result;
  }
  return obj;
}

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

const PRODUCTS_BY_CATEGORY_QUERY = `
  query ProductsByCategory($channel: String!, $categorySlug: String!, $first: Int) {
    products(channel: $channel, first: $first, filter: { categories: [$categorySlug] }) {
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
            }
          }
        }
      }
    }
  }
`;

const CATEGORY_BY_SLUG_QUERY = `
  query CategoryBySlug($slug: String!, $channel: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      backgroundImage {
        url
        alt
      }
      products(channel: $channel, first: 50) {
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

const COLLECTION_BY_SLUG_QUERY = `
  query CollectionBySlug($channel: String!, $slug: String!) {
    collection(channel: $channel, slug: $slug) {
      id
      name
      slug
      description
      backgroundImage {
        url
        alt
      }
      products(first: 50) {
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
      res.json(rewriteMediaUrls(products));
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
      res.json(rewriteMediaUrls(categories));
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
      res.json(rewriteMediaUrls(collections));
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
      res.json(rewriteMediaUrls(products));
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
      res.json(rewriteMediaUrls(data.product));
    } catch (error: any) {
      console.error("[Saleor Proxy] Product detail error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Category with products by slug
  app.get("/api/saleor/category/:slug", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const slug = req.params.slug;
      
      console.log(`[Saleor Proxy] Fetching category with products - slug: ${slug}, channel: ${channel}`);
      
      const data = await saleorRequest(CATEGORY_BY_SLUG_QUERY, { slug, channel });
      
      if (!data.category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      const products = data.category.products?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched category: ${data.category.name} with ${products.length} products`);
      res.json(rewriteMediaUrls({
        ...data.category,
        products
      }));
    } catch (error: any) {
      console.error("[Saleor Proxy] Category error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Collection with products by slug
  app.get("/api/saleor/collection/:slug", async (req, res) => {
    try {
      const channel = (req.query.channel as string) || DEFAULT_CHANNEL;
      const slug = req.params.slug;
      
      console.log(`[Saleor Proxy] Fetching collection with products - slug: ${slug}, channel: ${channel}`);
      
      const data = await saleorRequest(COLLECTION_BY_SLUG_QUERY, { channel, slug });
      
      if (!data.collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }
      
      const products = data.collection.products?.edges?.map((edge: any) => edge.node) || [];
      
      console.log(`[Saleor Proxy] Fetched collection: ${data.collection.name} with ${products.length} products`);
      res.json(rewriteMediaUrls({
        ...data.collection,
        products
      }));
    } catch (error: any) {
      console.error("[Saleor Proxy] Collection error:", error.message);
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

  // Auth routes using Saleor customer API
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password, newsletter } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const ACCOUNT_REGISTER_MUTATION = `
        mutation AccountRegister($input: AccountRegisterInput!) {
          accountRegister(input: $input) {
            user {
              id
              email
              firstName
              lastName
            }
            errors {
              field
              message
              code
            }
          }
        }
      `;

      const registerResponse = await fetch(SALEOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ACCOUNT_REGISTER_MUTATION,
          variables: {
            input: {
              email,
              password,
              firstName: firstName || '',
              lastName: lastName || '',
              channel: SALEOR_CHANNEL,
              redirectUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/account`,
            }
          }
        })
      });

      const registerData = await registerResponse.json();
      
      if (registerData.errors || registerData.data?.accountRegister?.errors?.length > 0) {
        const errors = registerData.errors || registerData.data?.accountRegister?.errors;
        const errorMessage = errors[0]?.message || 'Registration failed';
        console.error("Saleor registration error:", errors);
        return res.status(400).json({ error: errorMessage });
      }

      const saleorUser = registerData.data?.accountRegister?.user;
      if (!saleorUser) {
        return res.status(400).json({ error: "Registration failed - please check your email to confirm your account" });
      }

      // Now login the user to get a token
      const TOKEN_CREATE_MUTATION = `
        mutation TokenCreate($email: String!, $password: String!) {
          tokenCreate(email: $email, password: $password) {
            token
            refreshToken
            user {
              id
              email
              firstName
              lastName
            }
            errors {
              field
              message
              code
            }
          }
        }
      `;

      const tokenResponse = await fetch(SALEOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: TOKEN_CREATE_MUTATION,
          variables: { email, password }
        })
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.errors || tokenData.data?.tokenCreate?.errors?.length > 0) {
        // User registered but might need email confirmation
        return res.json({ 
          user: {
            id: saleorUser.id,
            email: saleorUser.email,
            firstName: saleorUser.firstName,
            lastName: saleorUser.lastName,
          },
          token: null,
          message: "Account created. Please check your email to confirm your account before logging in."
        });
      }

      const user = tokenData.data?.tokenCreate?.user;
      const token = tokenData.data?.tokenCreate?.token;

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token 
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const TOKEN_CREATE_MUTATION = `
        mutation TokenCreate($email: String!, $password: String!) {
          tokenCreate(email: $email, password: $password) {
            token
            refreshToken
            user {
              id
              email
              firstName
              lastName
            }
            errors {
              field
              message
              code
            }
          }
        }
      `;

      const response = await fetch(SALEOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: TOKEN_CREATE_MUTATION,
          variables: { email, password }
        })
      });

      const data = await response.json();
      
      if (data.errors || data.data?.tokenCreate?.errors?.length > 0) {
        const errors = data.errors || data.data?.tokenCreate?.errors;
        const errorMessage = errors[0]?.message || 'Invalid email or password';
        return res.status(401).json({ error: errorMessage });
      }

      const user = data.data?.tokenCreate?.user;
      const token = data.data?.tokenCreate?.token;

      if (!user || !token) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });

  // Stripe routes
  app.get("/api/stripe/config", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Failed to get Stripe configuration" });
    }
  });

  // Helper function to validate cart items against Saleor prices
  async function validateCartPrices(items: any[]): Promise<{ valid: boolean; amount: number; error?: string }> {
    try {
      const variantIds = items.map(item => item.variantId).filter(Boolean);
      
      if (variantIds.length === 0) {
        return { valid: false, amount: 0, error: "No valid variant IDs in cart" };
      }

      const VARIANT_PRICING_QUERY = `
        query GetVariantPricing($ids: [ID!]!, $channel: String!) {
          productVariants(ids: $ids, first: 100, channel: $channel) {
            edges {
              node {
                id
                name
                pricing {
                  price {
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
      `;

      const response = await fetch(SALEOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: VARIANT_PRICING_QUERY,
          variables: { 
            ids: variantIds,
            channel: SALEOR_CHANNEL 
          }
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error("Saleor pricing query error:", data.errors);
        return { valid: false, amount: 0, error: "Failed to validate prices" };
      }

      const variantPrices: Record<string, number> = {};
      data.data?.productVariants?.edges?.forEach((edge: any) => {
        const variant = edge.node;
        const price = variant.pricing?.price?.gross?.amount || 0;
        variantPrices[variant.id] = price;
      });

      let totalAmount = 0;
      for (const item of items) {
        const serverPrice = variantPrices[item.variantId];
        if (serverPrice === undefined) {
          console.warn(`Variant ${item.variantId} not found in Saleor`);
          // For items not in Saleor (like legacy products), use the client price
          // In production, you might want to reject these
          totalAmount += item.price * item.quantity;
        } else {
          // Use the authoritative server-side price
          totalAmount += serverPrice * item.quantity;
        }
      }

      return { valid: true, amount: totalAmount };
    } catch (error: any) {
      console.error("Error validating cart prices:", error);
      return { valid: false, amount: 0, error: "Price validation failed" };
    }
  }

  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
      const { items, email, shipping } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart items are required" });
      }

      // Validate prices server-side against Saleor
      const priceValidation = await validateCartPrices(items);
      if (!priceValidation.valid) {
        console.error("Price validation failed:", priceValidation.error);
        // Fallback to client prices if Saleor validation fails (for dev/staging)
        // In production, you might want to reject the request
      }

      const stripe = await getUncachableStripeClient();
      
      // Use server-validated amount or fallback to client-provided (for legacy items)
      const amount = priceValidation.valid ? priceValidation.amount * 100 : 
        items.reduce((sum: number, item: any) => sum + (item.price * item.quantity * 100), 0);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email: email || '',
          channel: SALEOR_CHANNEL,
          items: JSON.stringify(items.map((i: any) => ({
            id: i.variantId,
            name: i.productName,
            qty: i.quantity,
            price: i.price
          }))),
        },
        ...(shipping && {
          shipping: {
            name: shipping.name,
            address: {
              line1: shipping.address.line1,
              line2: shipping.address.line2 || '',
              city: shipping.address.city,
              state: shipping.address.state,
              postal_code: shipping.address.postal_code,
              country: shipping.address.country || 'US',
            },
          },
        }),
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        validatedAmount: amount / 100, // Return the server-validated amount
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message || "Failed to create payment intent" });
    }
  });

  app.post("/api/stripe/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }

      const stripe = await getUncachableStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
      });
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: error.message || "Failed to confirm payment" });
    }
  });

  return httpServer;
}
