
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, MapPin, Car, House, Calendar } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              RentAngo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/properties?type=short-term" className="flex items-center gap-1 text-gray-700 hover:text-primary">
              <Calendar className="w-4 h-4" />
              <span>Short Term</span>
            </Link>
            <Link to="/properties?type=long-term" className="flex items-center gap-1 text-gray-700 hover:text-primary">
              <House className="w-4 h-4" />
              <span>Long Term</span>
            </Link>
            <Link to="/properties?type=for-sale" className="flex items-center gap-1 text-gray-700 hover:text-primary">
              <House className="w-4 h-4" />
              <span>For Sale</span>
            </Link>
            <Link to="/transportation" className="flex items-center gap-1 text-gray-700 hover:text-primary">
              <Car className="w-4 h-4" />
              <span>Transportation</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/owner-dashboard">
              <Button variant="outline">List Property</Button>
            </Link>
            <Link to="/login">
              <Button>
                <User className="w-4 h-4 mr-2" />
                <span>Login</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="flex flex-col space-y-4 py-2">
              <Link to="/properties?type=short-term" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                <Calendar className="w-4 h-4" />
                <span>Short Term</span>
              </Link>
              <Link to="/properties?type=long-term" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                <House className="w-4 h-4" />
                <span>Long Term</span>
              </Link>
              <Link to="/properties?type=for-sale" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                <House className="w-4 h-4" />
                <span>For Sale</span>
              </Link>
              <Link to="/transportation" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                <Car className="w-4 h-4" />
                <span>Transportation</span>
              </Link>
              <Link to="/owner-dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                List Property
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded">
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
