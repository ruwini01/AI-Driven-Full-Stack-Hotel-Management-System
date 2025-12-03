import { motion } from "framer-motion";
import { Award, Globe, Shield, Heart, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're here to make every stay memorable.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Safe and secure bookings with transparent pricing and verified hotels.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to thousands of luxury hotels in the most beautiful destinations worldwide.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "AI-powered search and recommendations to find your perfect match.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Hotels Worldwide" },
    { value: "500K+", label: "Happy Travelers" },
    { value: "150+", label: "Countries" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        {/* Hero */}
        <section className="py-20 animated-gradient">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                About <span className="gradient-accent-text">LuxStay</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Redefining luxury hotel booking with AI-powered personalization
                and unmatched service excellence
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-12 text-center">
                <Award className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At LuxStay, we believe that finding the perfect hotel should be effortless and exciting. 
                  Our mission is to leverage cutting-edge AI technology to match travelers with their ideal 
                  accommodations, making every journey memorable from the moment they start planning. We're 
                  committed to providing transparent pricing, verified reviews, and exceptional customer 
                  service at every step.
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Our <span className="gradient-text">Values</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full hover-lift">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Meet Our <span className="gradient-text">Team</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Passionate professionals dedicated to transforming your travel experience
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <p className="text-lg text-muted-foreground">
                  Our diverse team of travel enthusiasts, technology experts, and hospitality 
                  professionals work tirelessly to bring you the best hotel booking experience. 
                  With years of combined experience in the travel industry, we understand what 
                  makes a stay truly special.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
