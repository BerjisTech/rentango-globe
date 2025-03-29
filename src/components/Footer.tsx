
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <MapPin className="w-6 h-6" />
              <span>RentAngo</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your all-in-one platform for property rentals and transportation in Kenya.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/properties?type=short-term" className="text-gray-400 hover:text-white">Short Term Rentals</Link></li>
              <li><Link to="/properties?type=long-term" className="text-gray-400 hover:text-white">Long Term Rentals</Link></li>
              <li><Link to="/properties?type=for-sale" className="text-gray-400 hover:text-white">Properties For Sale</Link></li>
              <li><Link to="/transportation" className="text-gray-400 hover:text-white">Transportation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Property Owners</h3>
            <ul className="space-y-2">
              <li><Link to="/owner-dashboard" className="text-gray-400 hover:text-white">Owner Dashboard</Link></li>
              <li><Link to="/list-property" className="text-gray-400 hover:text-white">List Your Property</Link></li>
              <li><Link to="/list-vehicle" className="text-gray-400 hover:text-white">List Your Vehicle</Link></li>
              <li><Link to="/owner-faq" className="text-gray-400 hover:text-white">Owner FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact-us" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RentAngo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
