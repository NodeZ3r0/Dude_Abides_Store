import { GraphQLClient } from 'graphql-request';

const SALEOR_API_URL = import.meta.env.VITE_SALEOR_API_URL || 'https://dudeabides.wopr.systems/graphql/';
const SALEOR_CHANNEL = import.meta.env.VITE_SALEOR_CHANNEL || 'default-channel';

export const saleorClient = new GraphQLClient(SALEOR_API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getChannel = () => SALEOR_CHANNEL;

export const PRODUCT_LIST_QUERY = `
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

export const PRODUCT_BY_SLUG_QUERY = `
  query ProductBySlug($channel: String!, $slug: String!) {
    product(channel: $channel, slug: $slug) {
      id
      name
      slug
      description
      thumbnail {
        url
        alt
      }
      media {
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
      }
    }
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
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

export const CATEGORIES_QUERY = `
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

export const COLLECTIONS_QUERY = `
  query Collections($first: Int) {
    collections(first: $first) {
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

export interface SaleorProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: {
    url: string;
    alt?: string;
  };
  pricing?: {
    priceRange?: {
      start?: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
}

export interface SaleorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  children?: {
    edges: { node: { id: string; name: string; slug: string } }[];
  };
}

export interface SaleorCollection {
  id: string;
  name: string;
  slug: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
}

export async function fetchProducts(channel: string = SALEOR_CHANNEL, first: number = 12): Promise<SaleorProduct[]> {
  try {
    const data = await saleorClient.request<{ products: { edges: { node: SaleorProduct }[] } }>(
      PRODUCT_LIST_QUERY,
      { channel, first }
    );
    return data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Failed to fetch products from Saleor:', error);
    return [];
  }
}

export async function fetchFeaturedProducts(channel: string = SALEOR_CHANNEL, collectionSlug: string = 'featured'): Promise<SaleorProduct[]> {
  try {
    const data = await saleorClient.request<{ collection: { products: { edges: { node: SaleorProduct }[] } } }>(
      FEATURED_PRODUCTS_QUERY,
      { channel, slug: collectionSlug }
    );
    return data.collection?.products?.edges?.map(edge => edge.node) || [];
  } catch (error) {
    console.error('Failed to fetch featured products from Saleor:', error);
    return [];
  }
}

export async function fetchCategories(first: number = 20): Promise<SaleorCategory[]> {
  try {
    const data = await saleorClient.request<{ categories: { edges: { node: SaleorCategory }[] } }>(
      CATEGORIES_QUERY,
      { first }
    );
    return data.categories.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Failed to fetch categories from Saleor:', error);
    return [];
  }
}

export async function fetchCollections(first: number = 10): Promise<SaleorCollection[]> {
  try {
    const data = await saleorClient.request<{ collections: { edges: { node: SaleorCollection }[] } }>(
      COLLECTIONS_QUERY,
      { first }
    );
    return data.collections.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Failed to fetch collections from Saleor:', error);
    return [];
  }
}
