import { shopifyCustomerQuery } from "./client";

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CustomerOrder {
  name: string;
  processedAt: string;
  totalPrice: {
    amount: string;
  };
  financialStatus: string;
  fulfillmentStatus: string;
}

const GET_CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      firstName
      lastName
      email
    }
  }
`;

const GET_ORDERS_QUERY = `
  query GetOrders($first: Int) {
    customer {
      orders(first: $first) {
        edges {
          node {
            name
            processedAt
            totalPrice {
              amount
            }
            financialStatus
            fulfillmentStatus
          }
        }
      }
    }
  }
`;


export async function fetchCustomerProfile(accessToken: string): Promise<CustomerProfile> {
  const data = await shopifyCustomerQuery<{ customer: CustomerProfile }>(
    GET_CUSTOMER_QUERY,
    {},
    accessToken
  );
  if (!data.customer) {
    throw new Error("Customer not found.");
  }
  return data.customer;
}

export async function fetchCustomerOrders(accessToken: string, first = 10): Promise<CustomerOrder[]> {
  const data = await shopifyCustomerQuery<{
    customer: { orders: { edges: Array<{ node: CustomerOrder }> } };
  }>(GET_ORDERS_QUERY, { first }, accessToken);
  
  if (!data.customer?.orders?.edges) {
    return [];
  }
  
  return data.customer.orders.edges.map((edge) => edge.node);
}
