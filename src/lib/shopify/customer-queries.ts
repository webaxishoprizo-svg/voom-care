import { customerQuery } from "./customer-account";

export interface CustomerProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailAddress?: { emailAddress: string };
  phoneNumber?: { phoneNumber: string };
  defaultAddress?: CustomerAddress | null;
  addresses: { nodes: CustomerAddress[] };
}

export interface CustomerAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zoneCode?: string;
  territoryCode?: string;
  zip?: string;
  phoneNumber?: string;
  formatted?: string[];
}

export interface CustomerOrder {
  id: string;
  number: number;
  name: string;
  processedAt: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      image?: { url: string; altText?: string | null } | null;
      variantTitle?: string;
      price?: { amount: string; currencyCode: string } | null;
      productId?: string | null;
      product?: { handle: string } | null;
    }>;
  };
  shippingAddress?: CustomerAddress | null;
  fulfillments?: {
    nodes: Array<{
      status?: string;
      trackingInformation?: Array<{ number?: string; url?: string; company?: string }>;
    }>;
  };
}

const PROFILE_QUERY = /* GraphQL */ `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        territoryCode
        zip
        phoneNumber
        formatted
      }
      addresses(first: 10) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          zoneCode
          territoryCode
          zip
          phoneNumber
          formatted
        }
      }
    }
  }
`;

const ORDERS_QUERY = /* GraphQL */ `
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          number
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 25) {
            nodes {
              title
              quantity
              variantTitle
              image { url altText }
              price { amount currencyCode }
              productId
            }
          }
          shippingAddress { formatted }
          fulfillments(first: 5) {
            nodes {
              status
              trackingInformation { number url company }
            }
          }
        }
      }
    }
  }
`;

export async function fetchCustomerProfile() {
  const data = await customerQuery<{ customer: CustomerProfile }>(PROFILE_QUERY);
  return data.customer;
}

export async function fetchCustomerOrders(first = 25) {
  const data = await customerQuery<{ customer: { orders: { nodes: CustomerOrder[] } } }>(
    ORDERS_QUERY,
    { first },
  );
  return data.customer.orders.nodes;
}