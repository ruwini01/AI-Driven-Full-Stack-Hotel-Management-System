import { motion } from "framer-motion";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { 
  User, 
  Calendar, 
  Settings, 
  LogOut,
  Mail,
  Phone,
  Edit,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingHistory from "@/components/BookingHistory";
import { useGetBookingStatsQuery } from "@/lib/bookingApi";

const MyAccount = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch booking statistics - only if user is loaded
  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useGetBookingStatsQuery(user?.id, {
    skip: !user?.id
  });

  const statCards = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: stats?.data?.totalBookings || 0,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: TrendingUp,
      label: "Upcoming Trips",
      value: stats?.data?.upcomingBookings || 0,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: stats?.data?.completedBookings || 0,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${stats?.data?.totalSpent?.toLocaleString() || 0}`,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleEditProfile = () => {
    if (window.Clerk) {
      window.Clerk.openUserProfile();
    }
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  // Loading state
  if (!isLoaded || statsLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass-card p-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to view your account
            </p>
            <Button onClick={() => handleNavigate('/sign-in')} size="lg">
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Profile */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card max-w-5xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || "User"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Welcome back, <span className="gradient-text">{user.firstName || "Traveler"}</span>!
                </h1>
                <p className="text-muted-foreground mb-4">
                  Manage your bookings and account settings
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {user.primaryEmailAddress && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {user.primaryEmailAddress.emailAddress}
                    </div>
                  )}
                  {user.primaryPhoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {user.primaryPhoneNumber.phoneNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleEditProfile}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card hover-lift text-center"
              >
                <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <User className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="glass-card">
                <h2 className="text-2xl font-display font-bold mb-6">Account Overview</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.fullName || "Not set"}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {user.primaryEmailAddress?.emailAddress || "Not set"}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Account Status</p>
                        <p className="font-medium text-success">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <BookingHistory userId={user.id} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="glass-card">
                <h2 className="text-2xl font-display font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Profile Settings</p>
                          <p className="text-sm text-muted-foreground">Update your profile information</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleEditProfile}
                        >
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Security</p>
                          <p className="text-sm text-muted-foreground">Manage password and 2FA</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleEditProfile}
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className="text-sm text-muted-foreground">Control your data and privacy</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyAccount;