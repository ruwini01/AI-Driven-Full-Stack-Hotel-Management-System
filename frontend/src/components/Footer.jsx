import { Link } from "react-router-dom";
import { Hotel, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
    ],
    Support: [
      { name: "Help Center", path: "#" },
      { name: "Safety Information", path: "#" },
      { name: "Cancellation Options", path: "#" },
      { name: "Our COVID-19 Response", path: "#" },
    ],
    Explore: [
      { name: "All Hotels", path: "/hotels" },
      { name: "AI Search", path: "/ai-search" },
      { name: "My Bookings", path: "/my-account" },
      { name: "Admin Dashboard", path: "/admin" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Hotel className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">
                LuxStay
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover your perfect stay with AI-powered hotel recommendations. 
              Luxury accommodation at your fingertips.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@luxstay.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Luxury Avenue, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LuxStay. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;