import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import AISearch from "./pages/AISearch";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import MyAccount from "./pages/MyAccount";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import Payment from "./pages/Payment";
import ProtectLayout from "./components/layouts/protect.layout";
import AdminProtectLayout from "./components/layouts/admin-protect.layout";
import CreateHotelPage from "./pages/admin/create-hotel.page";
import RootProtectLayout from "./components/layouts/root-layout.page";
import RootLayout from "./components/layouts/root-layout";
import AdminBookings from "./pages/admin/booking";
import EditHotel from "./pages/admin/edit-hotel";


const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error("Missing Clerk publishable key");
}

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>

                {/* HOME redirect depending on role */}
                <Route index element={
                  <RootProtectLayout>
                    <Index />
                  </RootProtectLayout>
                }
                />

                <Route path="/hotels" element={<Hotels />} />

                <Route element={<ProtectLayout />}>
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/my-account" element={<MyAccount />} />
                </Route>

                <Route element={<AdminProtectLayout />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/create-hotel" element={<CreateHotelPage />} />
                  <Route path="/admin/bookings" element={<AdminBookings />}/>
                  <Route path="/admin/edit-hotel/:id" element={<EditHotel />} />
                </Route>

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/ai-search" element={<AISearch />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="*" element={<NotFound />} />
              </Route>


            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </ClerkProvider >
);

export default App;