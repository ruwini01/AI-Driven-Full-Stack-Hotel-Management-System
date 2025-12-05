import { useGetUserBookingsQuery } from "@/lib/bookingApi";

const AdminBookings = () => {
  const adminId = "ADMIN_ID";
  const { data } = useGetUserBookingsQuery({ userId: adminId });

  return (
    <div className="p-10">
      <h1>Bookings ({data?.data?.bookings?.length})</h1>

      <ul>
        {data?.data?.bookings?.map((b) => (
          <li key={b._id}>
            {b.hotelName} – {b.status} – {b.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBookings;
