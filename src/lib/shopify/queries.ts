const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    productType
    vendor
    tags
    availableForSale
    featuredImage { url altText width height }
    images(first: 20) { nodes { url altText width height } }
    priceRange { minVariantPrice { amount currencyCode } }
    options { name optionValues { name } }
    variants(first: 50) {
      nodes { id title sku availableForSale price { amount currencyCode } selectedOptions { name value } image { url } }
    }
  }
`;

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    discountAllocations { discountedAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes { key value }
        cost {
          amountPerQuantity { amount currencyCode }
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        discountAllocations { discountedAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions { name value }
            image { url }
            product { handle title productType tags }
          }
        }
      }
    }
  }
`;

export const SHOP_QUERY = /* GraphQL */ `
  query Shop { shop { name } }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: TITLE) { nodes { ...ProductFields } }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: TITLE) { nodes { id handle title description } }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) { id handle title description products(first: $first) { nodes { ...ProductFields } } }
  }
`;

/** Only the handles in a collection: the listing pages pick those products from the build's catalogue. */
export const COLLECTION_HANDLES_QUERY = /* GraphQL */ `
  query CollectionHandles($handle: String!, $first: Int!) {
    collection(handle: $handle) { handle title products(first: $first) { nodes { handle } } }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FIELDS}
  query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { field message } }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } }
  }
`;

/** A loose stone's availability, read in the browser on Step 3 (no cart is involved). */
export const STONE_AVAILABILITY_QUERY = /* GraphQL */ `
  query StoneAvailability($handle: String!) {
    product(handle: $handle) { handle availableForSale variants(first: 1) { nodes { id availableForSale } } }
  }
`;
