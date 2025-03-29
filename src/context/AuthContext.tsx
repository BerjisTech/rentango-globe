
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = "user" | "staff" | "owner" | "admin" | "superadmin";
export type StaffType = "real_estate_agent" | "driver" | "manager" | "finance" | "customer_service" | "maintenance";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
}

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isStaff: boolean;
  isOwner: boolean;
  signUp: (email: string, password: string, metadata: { first_name: string; last_name: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is administrator
  const isAdmin = roles.includes("admin");
  const isSuperAdmin = roles.includes("superadmin");
  const isStaff = roles.includes("staff");
  const isOwner = roles.includes("owner");

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) {
        throw rolesError;
      }

      if (rolesData) {
        setRoles(rolesData.map(r => r.role as UserRole));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  // Initialize auth state
  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === "SIGNED_OUT") {
          setProfile(null);
          setRoles([]);
        }

        if (event === "SIGNED_IN" && currentSession?.user) {
          // Defer this to avoid Supabase auth deadlock
          setTimeout(() => {
            refreshProfile();
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        refreshProfile();
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (
    email: string, 
    password: string, 
    metadata: { first_name: string; last_name: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Signup successful! Please check your email for verification.");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "An error occurred during signup");
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully signed in!");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Invalid login credentials");
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigate("/login");
      toast.success("You have been signed out");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "An error occurred during sign out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        roles,
        isLoading,
        isAdmin,
        isSuperAdmin,
        isStaff,
        isOwner,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
