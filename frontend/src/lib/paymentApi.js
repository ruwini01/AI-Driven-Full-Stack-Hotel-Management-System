import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        if (window.Clerk) {
          const token = await window.Clerk.session?.getToken();
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    // Create checkout session (for embedded checkout)
    createCheckoutSession: builder.mutation({
      query: (bookingId) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        body: { bookingId },
      }),
    }),

    // Get session status
    getSessionStatus: builder.query({
      query: (sessionId) => ({
        url: '/payments/session-status',
        params: { session_id: sessionId },
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetSessionStatusQuery,
  useLazyGetSessionStatusQuery,
} = paymentApi;
