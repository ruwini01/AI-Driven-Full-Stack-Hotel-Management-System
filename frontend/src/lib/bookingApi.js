import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
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
  tagTypes: ['Bookings', 'BookingStats'],
  endpoints: (builder) => ({
    // Get user bookings
    getUserBookings: builder.query({
      query: ({ userId, status = 'ALL', page = 1, limit = 10, sortBy = 'createdAt' }) => ({
        url: `/bookings/user/${userId}`,
        params: { status, page, limit, sortBy },
      }),
      providesTags: (result) =>
        result?.data?.bookings
          ? [
              ...result.data.bookings.map(({ _id }) => ({ type: 'Bookings', id: _id })),
              { type: 'Bookings', id: 'LIST' },
            ]
          : [{ type: 'Bookings', id: 'LIST' }],
    }),

    // Get single booking
    getBookingById: builder.query({
      query: ({ bookingId, userId }) => ({
        url: `/bookings/${bookingId}`,
        params: { userId },
      }),
      providesTags: (result, error, { bookingId }) => [{ type: 'Bookings', id: bookingId }],
    }),

    // Get booking statistics
    getBookingStats: builder.query({
      query: (userId) => `/bookings/user/${userId}/stats`,
      providesTags: [{ type: 'BookingStats', id: 'STATS' }],
    }),

    // Cancel booking
    cancelBooking: builder.mutation({
      query: ({ bookingId, userId }) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Bookings', id: bookingId },
        { type: 'Bookings', id: 'LIST' },
        { type: 'BookingStats', id: 'STATS' },
      ],
    }),

    // Add new booking
    addBooking: builder.mutation({
      query: (bookingData) => ({
        url: `/bookings/add`,
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }, { type: 'BookingStats', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingStatsQuery,
  useCancelBookingMutation,
  useAddBookingMutation,
} = bookingApi;
