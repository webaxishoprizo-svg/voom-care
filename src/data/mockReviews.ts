export interface Review {
  id: string;
  rating: number;
  review: string;
  user_id: string;
  created_at: string;
}

export const mockReviews: Review[] = [
  {
    id: "mock-1",
    rating: 5,
    review: "Very good product. My car is shining now. Value for money. Packaging was also very good.",
    user_id: "mock-user-1",
    created_at: "2024-03-15T10:00:00Z"
  },
  {
    id: "mock-2",
    rating: 5,
    review: "I tried many products but this one is best. The dash cleaner doesn't leave any oily feel. Good for daily use.",
    user_id: "mock-user-2",
    created_at: "2024-03-20T14:30:00Z"
  },
  {
    id: "mock-3",
    rating: 4,
    review: "Delivery was a bit late but product is awesome. Highly recommend for car lovers.",
    user_id: "mock-user-3",
    created_at: "2024-03-25T09:15:00Z"
  },
  {
    id: "mock-4",
    rating: 5,
    review: "Using for my Baleno, dashboard looks like new. Smells very fresh and premium. Best in this price range.",
    user_id: "mock-user-4",
    created_at: "2024-04-02T11:45:00Z"
  },
  {
    id: "mock-5",
    rating: 5,
    review: "Best car care kit at this price. Better than expensive brands I used before. Must buy item.",
    user_id: "mock-user-5",
    created_at: "2024-04-05T16:20:00Z"
  },
  {
    id: "mock-6",
    rating: 5,
    review: "Happy with the results. Tyre polish is very effective and shine stays for many days. Glad I found Voom.",
    user_id: "mock-user-6",
    created_at: "2024-04-10T08:00:00Z"
  },
  {
    id: "mock-7",
    rating: 5,
    review: "Good quality, simple to use. My husband is very happy with this gift for his new Creta.",
    user_id: "mock-user-7",
    created_at: "2024-04-15T13:10:00Z"
  },
  {
    id: "mock-8",
    rating: 5,
    review: "Awesome shine on my black Thar. No oily sticky feel. 10/10 from my side.",
    user_id: "mock-user-8",
    created_at: "2024-04-20T17:50:00Z"
  },
  {
    id: "mock-9",
    rating: 4,
    review: "Fast delivery and genuine product. Voom care is doing great job for Indian market. Keep it up.",
    user_id: "mock-user-9",
    created_at: "2024-04-25T10:30:00Z"
  },
  {
    id: "mock-10",
    rating: 5,
    review: "Cleaned my old Santro and it looks much better now. Paisa vasool item for every car owner.",
    user_id: "mock-user-10",
    created_at: "2024-05-01T12:00:00Z"
  },
  {
    id: "mock-11",
    rating: 5,
    review: "Must buy for all car enthusiasts. Small quantity also works well. I used it on my bike also, results are great.",
    user_id: "mock-user-11",
    created_at: "2024-05-03T15:40:00Z"
  },
  {
    id: "mock-12",
    rating: 5,
    review: "Good packaging and very useful kit. Everything included in one box. Very convenient for Sunday wash.",
    user_id: "mock-user-12",
    created_at: "2024-05-04T09:20:00Z"
  },
  {
    id: "mock-13",
    rating: 4,
    review: "Really impressed with the quality of microfibre cloth and polish. Will order again definitely when this finish.",
    user_id: "mock-user-13",
    created_at: "2024-05-05T14:10:00Z"
  },
  {
    id: "mock-14",
    rating: 5,
    review: "Finally found a good Indian brand for car care. Superb results on my Honda City. Full satisfaction.",
    user_id: "mock-user-14",
    created_at: "2024-05-06T11:30:00Z"
  },
  {
    id: "mock-15",
    rating: 5,
    review: "Using it every Sunday now. Best part of my weekend. Five stars for the quality and shine!",
    user_id: "mock-user-15",
    created_at: "2024-05-07T16:00:00Z"
  }
];

export const getMockReviewsForProduct = (productId: string): Review[] => {
  const productHash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return mockReviews
    .filter((_, i) => (i + productHash) % 1.5 < 1)
    .map(r => ({ ...r, product_id: productId }));
};
