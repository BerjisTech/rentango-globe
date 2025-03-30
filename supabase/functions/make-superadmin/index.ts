
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user by email
    const { data: users, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", "bo.kouru@gmail.com")
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!users) {
      throw new Error("User not found");
    }

    const userId = users.id;

    // Check if the user already has the superadmin role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "superadmin")
      .maybeSingle();

    if (roleCheckError) {
      throw roleCheckError;
    }

    // Only insert if the role doesn't exist
    if (!existingRole) {
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "superadmin"
        });

      if (insertError) {
        throw insertError;
      }
    }

    // Make sure user also has admin and owner roles
    const roles = ["admin", "owner"];
    
    for (const role of roles) {
      // Check if the role already exists
      const { data: existingRole, error: roleCheckError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", role)
        .maybeSingle();

      if (roleCheckError) {
        throw roleCheckError;
      }

      // Only insert if the role doesn't exist
      if (!existingRole) {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            role: role
          });

        if (insertError) {
          throw insertError;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Superadmin role assigned successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
