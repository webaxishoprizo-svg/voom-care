import { shopifyQuery } from "./client";

type Nullable<T> = T | null;

interface ShopifyMoneyNode {
  amount: string;
  currencyCode: string;
}

interface ShopifyAddressNode {
  address1: Nullable<string>;
  address2: Nullable<string>;
  city: Nullable<string>;
  province: Nullable<string>;
  zip: Nullable<string>;
  country: Nullable<string>;
  phone: Nullable<string>;
}

interface ShopifyOrderNode {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: Nullable<string>;
  fulfillmentStatus: Nullable<string>;
  statusUrl: string;
  totalPriceV2: ShopifyMoneyNode;
}

interface ShopifyCustomerNode {
  id: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  displayName: string;
  email: string;
  phone: Nullable<string>;
  defaultAddress: Nullable<ShopifyAddressNode>;
  orders: {
    edges: Array<{ node: ShopifyOrderNode }>;
  };
}

interface ShopifyCustomerTokenPayload {
  customerAccessToken: Nullable<{
    accessToken: string;
    expiresAt: string;
  }>;
  customerUserErrors: Array<{ code?: string; field?: string[]; message: string }>;
}

interface ShopifyCustomerPayload {
  customer: Nullable<ShopifyCustomerNode>;
  customerUserErrors: Array<{ code?: string; field?: string[]; message: string }>;
}

interface ShopifyCustomerQueryResponse {
  customer: Nullable<ShopifyCustomerNode>;
}

interface ShopifyCustomerTokenResponse {
  customerAccessTokenCreate: ShopifyCustomerTokenPayload;
}

interface ShopifyCustomerCreateResponse {
  customerCreate: ShopifyCustomerPayload;
}

interface ShopifyCustomerUpdateResponse {
  customerUpdate: ShopifyCustomerPayload;
}

interface ShopifyCustomerTokenDeleteResponse {
  customerAccessTokenDelete: {
    deletedAccessToken: Nullable<string>;
    deletedCustomerAccessTokenId: Nullable<string>;
    userErrors: Array<{ message: string }>;
  };
}

export interface ShopifyCustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  statusUrl: string;
  totalPrice: number;
  currencyCode: string;
}

export interface ShopifyCustomerProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName: string;
  email: string;
  phone?: string | null;
  defaultAddress?: {
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    province?: string | null;
    zip?: string | null;
    country?: string | null;
    phone?: string | null;
  } | null;
  orders: ShopifyCustomerOrder[];
}

const CUSTOMER_FIELDS = `
  id
  firstName
  lastName
  displayName
  email
  phone
  defaultAddress {
    address1
    address2
    city
    province
    zip
    country
    phone
  }
  orders(first: 20, reverse: true) {
    edges {
      node {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        statusUrl
        totalPriceV2 {
          amount
          currencyCode
        }
      }
    }
  }
`;

const GET_CUSTOMER_QUERY = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const CUSTOMER_LOGIN_MUTATION = `
  mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ${CUSTOMER_FIELDS}
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ${CUSTOMER_FIELDS}
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_TOKEN_DELETE_MUTATION = `
  mutation CustomerLogout($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        message
      }
    }
  }
`;

function parseMoney(value: ShopifyMoneyNode) {
  const amount = Number(value.amount);
  return Number.isFinite(amount) ? amount : 0;
}

function ensureCustomerErrors(errors: Array<{ message: string }>) {
  const messages = errors.map((error) => error.message).filter(Boolean);

  if (messages.length) {
    throw new Error(messages.join("\n"));
  }
}

function mapCustomerProfile(customer: ShopifyCustomerNode): ShopifyCustomerProfile {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    displayName: customer.displayName,
    email: customer.email,
    phone: customer.phone,
    defaultAddress: customer.defaultAddress,
    orders: customer.orders.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      orderNumber: node.orderNumber,
      processedAt: node.processedAt,
      financialStatus: node.financialStatus,
      fulfillmentStatus: node.fulfillmentStatus,
      statusUrl: node.statusUrl,
      totalPrice: parseMoney(node.totalPriceV2),
      currencyCode: node.totalPriceV2.currencyCode,
    })),
  };
}

export async function fetchShopifyCustomer(customerAccessToken: string) {
  const data = await shopifyQuery<ShopifyCustomerQueryResponse>(GET_CUSTOMER_QUERY, {
    customerAccessToken,
  });

  if (!data.customer) {
    throw new Error("Customer account could not be loaded.");
  }

  return mapCustomerProfile(data.customer);
}

export async function loginShopifyCustomer(email: string, password: string) {
  const data = await shopifyQuery<ShopifyCustomerTokenResponse>(CUSTOMER_LOGIN_MUTATION, {
    input: { email, password },
  });

  ensureCustomerErrors(data.customerAccessTokenCreate.customerUserErrors);

  if (!data.customerAccessTokenCreate.customerAccessToken?.accessToken) {
    throw new Error("Shopify login did not return an access token.");
  }

  return data.customerAccessTokenCreate.customerAccessToken;
}

export async function registerShopifyCustomer(input: {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}) {
  const data = await shopifyQuery<ShopifyCustomerCreateResponse>(CUSTOMER_CREATE_MUTATION, {
    input,
  });

  ensureCustomerErrors(data.customerCreate.customerUserErrors);

  if (!data.customerCreate.customer) {
    throw new Error("Shopify customer registration did not return a customer.");
  }

  return mapCustomerProfile(data.customerCreate.customer);
}

export async function updateShopifyCustomer(
  customerAccessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  },
) {
  const data = await shopifyQuery<ShopifyCustomerUpdateResponse>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken,
    customer,
  });

  ensureCustomerErrors(data.customerUpdate.customerUserErrors);

  if (!data.customerUpdate.customer) {
    throw new Error("Shopify customer update did not return a customer.");
  }

  return mapCustomerProfile(data.customerUpdate.customer);
}

export async function logoutShopifyCustomer(customerAccessToken: string) {
  const data = await shopifyQuery<ShopifyCustomerTokenDeleteResponse>(
    CUSTOMER_TOKEN_DELETE_MUTATION,
    {
      customerAccessToken,
    },
  );

  ensureCustomerErrors(data.customerAccessTokenDelete.userErrors);
}
