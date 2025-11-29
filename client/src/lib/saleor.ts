import { GraphQLClient } from 'graphql-request';

const SALEOR_API_URL = import.meta.env.VITE_SALEOR_API_URL || 'https://dudeabides.wopr.systems/graphql/';

export const saleorClient = new GraphQLClient(SALEOR_API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export async function fetchProducts(channel: string = 'default-channel', first: number = 12): Promise<SaleorProduct[]> {
  const data = await saleorClient.request<{ products: { edges: { node: SaleorProduct }[] } }>(
    PRODUCT_LIST_QUERY,
    { channel, first }
  );
  return data.products.edges.map(edge => edge.node);
}

export async function fetchFeaturedProducts(channel: string = 'default-channel'): Promise<SaleorProduct[]> {
  const data = await saleorClient.request<{ collection: { products: { edges: { node: SaleorProduct }[] } } }>(
    FEATURED_PRODUCTS_QUERY,
    { channel, slug: 'featured-products' }
  );
  return data.collection?.products?.edges?.map(edge => edge.node) || [];
}
