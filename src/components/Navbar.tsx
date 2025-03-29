
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, MapPin, Car, House, Calendar, LogOut, UserCog } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, roles, signOut, isAdmin, isSuperAdmin, isStaff, isOwner } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-md py-2" 
        : "bg-white py-4"
    )}>
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
            <Link to="/properties?type=short-term" className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Short Term</span>
            </Link>
            <Link to="/properties?type=long-term" className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
              <House className="w-4 h-4" />
              <span>Long Term</span>
            </Link>
            <Link to="/properties?type=for-sale" className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
              <House className="w-4 h-4" />
              <span>For Sale</span>
            </Link>
            <Link to="/transportation" className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
              <Car className="w-4 h-4" />
              <span>Transportation</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(isAdmin || isSuperAdmin || isOwner) && (
                  <Link to="/admin-dashboard">
                    <Button variant="outline" className="rounded-full">Admin Dashboard</Button>
                  </Link>
                )}
                
                {isStaff && (
                  <Link to="/staff-dashboard">
                    <Button variant="outline" className="rounded-full">Staff Dashboard</Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border-0 shadow-lg" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {roles.map(role => (
                              <span key={role} className="tag text-xs py-0.5 px-2">
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/owner-dashboard" className="flex items-center">
                        <House className="mr-2 h-4 w-4" />
                        <span>List Property</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile" className="flex items-center">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/owner-dashboard">
                  <Button variant="outline" className="rounded-full">List Property</Button>
                </Link>
                <Link to="/login">
                  <Button className="rounded-full">
                    <User className="w-4 h-4 mr-2" />
                    <span>Login</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 animate-scale-in glass-card rounded-xl overflow-hidden">
            <div className="flex flex-col space-y-2 p-4">
              <Link to="/properties?type=short-term" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                <Calendar className="w-4 h-4" />
                <span>Short Term</span>
              </Link>
              <Link to="/properties?type=long-term" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                <House className="w-4 h-4" />
                <span>Long Term</span>
              </Link>
              <Link to="/properties?type=for-sale" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                <House className="w-4 h-4" />
                <span>For Sale</span>
              </Link>
              <Link to="/transportation" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                <Car className="w-4 h-4" />
                <span>Transportation</span>
              </Link>
              
              {user ? (
                <>
                  {(isAdmin || isSuperAdmin || isOwner) && (
                    <Link to="/admin-dashboard" className="px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {isStaff && (
                    <Link to="/staff-dashboard" className="px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                      Staff Dashboard
                    </Link>
                  )}

                  <Link to="/owner-dashboard" className="px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                    List Property
                  </Link>
                  
                  <Link to="/profile" className="px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                    Profile
                  </Link>
                  
                  <button 
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }} 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/owner-dashboard" className="px-4 py-2 text-gray-700 hover:bg-primary/5 rounded-lg transition-colors" onClick={toggleMenu}>
                    List Property
                  </Link>
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg" onClick={toggleMenu}>
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
