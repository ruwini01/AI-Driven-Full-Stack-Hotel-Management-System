import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      detail: "hello@luxstay.com",
      link: "mailto:hello@luxstay.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "123 Luxury Avenue, NY 10001",
      link: "#",
    },
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
              <MessageSquare className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Get in <span className="gradient-accent-text">Touch</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center hover-lift h-full">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-muted-foreground">{info.detail}</p>
                  </Card>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-8">
                  <h2 className="text-3xl font-display font-bold mb-6 text-center">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block">First Name</Label>
                        <Input placeholder="John" required />
                      </div>
                      <div>
                        <Label className="mb-2 block">Last Name</Label>
                        <Input placeholder="Doe" required />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Email</Label>
                      <Input type="email" placeholder="john@example.com" required />
                    </div>

                    <div>
                      <Label className="mb-2 block">Phone Number</Label>
                      <Input type="tel" placeholder="+1 (555) 123-4567" />
                    </div>

                    <div>
                      <Label className="mb-2 block">Subject</Label>
                      <Input placeholder="How can we help you?" required />
                    </div>

                    <div>
                      <Label className="mb-2 block">Message</Label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary-light gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "How do I make a booking?",
                  a: "Simply search for hotels, select your preferred option, choose your dates, and complete the secure payment process.",
                },
                {
                  q: "Can I cancel my reservation?",
                  a: "Yes, cancellation policies vary by hotel. Check the specific hotel's cancellation terms before booking.",
                },
                {
                  q: "Is my payment information secure?",
                  a: "Absolutely. We use industry-standard encryption and secure payment gateways to protect your information.",
                },
                {
                  q: "How does AI search work?",
                  a: "Our AI analyzes your natural language queries and matches them with the best hotels based on your preferences, budget, and requirements.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
