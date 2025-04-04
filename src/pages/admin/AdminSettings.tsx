import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Save, RefreshCw, Shield, Globe, Mail, Settings as SettingsIcon, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { PlatformSettings, Settings } from "@/types/admin";

// Define form schema for general settings
const generalSettingsSchema = z.object({
  site_name: z.string().min(3, { message: "Site name must be at least 3 characters" }),
  site_description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  contact_email: z.string().email({ message: "Please enter a valid email address" }),
  support_phone: z.string().min(7, { message: "Please enter a valid phone number" })
});

// Define form schema for security settings
const securitySettingsSchema = z.object({
  allow_signups: z.boolean(),
  require_email_verification: z.boolean(),
  failed_login_attempts: z.coerce.number().int().min(1).max(10),
  password_expiry_days: z.coerce.number().int().min(0).max(365)
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "advanced">("general");
  const queryClient = useQueryClient();
  
  // General settings form
  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_name: "HomeNZoom",
      site_description: "Book your ideal vacation home or vehicle with ease",
      contact_email: "support@homenzoom.com",
      support_phone: "+1-888-555-1234"
    }
  });

  // Security settings form
  const securityForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      allow_signups: true,
      require_email_verification: true,
      failed_login_attempts: 5,
      password_expiry_days: 90
    }
  });

  // Fetch settings from Supabase
  const { data: platformSettings, isLoading: isLoadingSettings, refetch } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("platform_settings")
          .select("*")
          .single();
        
        if (error) {
          // If no settings exist yet, we'll create default ones later
          if (error.code === "PGRST116") {
            return null;
          }
          
          toast({
            title: "Error fetching settings",
            description: error.message,
            variant: "destructive"
          });
          return null;
        }
        
        return data as PlatformSettings;
      } catch (error: any) {
        toast({
          title: "Error fetching settings",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        return null;
      }
    }
  });

  // Update forms when settings are loaded
  useEffect(() => {
    if (platformSettings) {
      generalForm.reset({
        site_name: platformSettings.site_name,
        site_description: platformSettings.site_description || "",
        contact_email: platformSettings.contact_email || "",
        support_phone: platformSettings.support_phone || ""
      });
    }
  }, [platformSettings, generalForm]);

  // Create mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<PlatformSettings>) => {
      try {
        // If settings already exist, update them
        if (platformSettings?.id) {
          const { error } = await supabase
            .from("platform_settings")
            .update(updatedSettings)
            .eq("id", platformSettings.id);
          
          if (error) throw error;
          return;
        }
        
        // If no settings exist yet, create them
        const { error } = await supabase
          .from("platform_settings")
          .insert([updatedSettings as any]);
        
        if (error) throw error;
      } catch (error: any) {
        throw new Error(error.message || "Failed to update settings");
      }
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSaveGeneralSettings = (data: GeneralSettingsFormValues) => {
    updateSettingsMutation.mutate(data);
  };

  const onSaveSecuritySettings = (data: SecuritySettingsFormValues) => {
    // In a real app, these would be saved to a separate table or endpoint
    toast({
      title: "Security settings updated",
      description: "Your security changes have been saved successfully."
    });
  };

  // Handle cache clearing
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      // Simulate cache clearing - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Cache cleared",
        description: "Application cache has been successfully cleared."
      });
    }
  });

  const handleClearCache = () => {
    clearCacheMutation.mutate();
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Platform Settings</h1>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "general" ? "default" : "outline"}
            onClick={() => setActiveTab("general")}
            className="flex items-center"
          >
            <Globe className="h-4 w-4 mr-2" />
            General
          </Button>
          <Button
            variant={activeTab === "security" ? "default" : "outline"}
            onClick={() => setActiveTab("security")}
            className="flex items-center"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
          <Button
            variant={activeTab === "advanced" ? "default" : "outline"}
            onClick={() => setActiveTab("advanced")}
            className="flex items-center"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Advanced
          </Button>
        </div>
        
        {isLoadingSettings ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* General Settings Tab */}
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic platform information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...generalForm}>
                    <form onSubmit={generalForm.handleSubmit(onSaveGeneralSettings)} className="space-y-4">
                      <FormField
                        control={generalForm.control}
                        name="site_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your platform as it appears to users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="site_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Description</FormLabel>
                            <FormControl>
                              <Textarea rows={3} {...field} />
                            </FormControl>
                            <FormDescription>
                              Brief description used for SEO and marketing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormDescription>
                                Public contact email for customer inquiries
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={generalForm.control}
                          name="support_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormDescription>
                                Customer support phone number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={updateSettingsMutation.isPending} className="flex items-center">
                          {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {/* Security Settings Tab */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage authentication and security policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSaveSecuritySettings)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={securityForm.control}
                            name="allow_signups"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Allow New Signups</FormLabel>
                                  <FormDescription>
                                    Enable or disable new user registrations
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="require_email_verification"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Email Verification</FormLabel>
                                  <FormDescription>
                                    Require email verification before account use
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={securityForm.control}
                            name="failed_login_attempts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Failed Login Attempts</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" max="10" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Number of failed attempts before temporary lockout (1-10)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="password_expiry_days"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password Expiry (days)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" max="365" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Days until password expires (0 for never)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={updateSettingsMutation.isPending} className="flex items-center">
                          {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Save className="mr-2 h-4 w-4" />
                          Save Security Settings
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {/* Advanced Settings Tab */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Maintenance</CardTitle>
                    <CardDescription>Perform administrative maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium">Application Cache</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear the application cache to refresh system data
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handleClearCache}
                          disabled={clearCacheMutation.isPending}
                        >
                          {clearCacheMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Clearing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Clear Cache
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium">Email Service</h4>
                          <p className="text-sm text-muted-foreground">
                            Configure the platform email delivery service
                          </p>
                        </div>
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Configure SMTP
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-amber-900">Database Backup</h4>
                          <p className="text-sm text-amber-700">
                            Create a backup of all platform data
                          </p>
                        </div>
                        <Button variant="outline" className="border-amber-400 hover:bg-amber-100">
                          Generate Backup
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardHeader className="text-red-800">
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription className="text-red-700">
                      Actions here can cause irreversible changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-red-200 p-4 bg-red-50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-red-800">Reset Platform</h4>
                          <p className="text-sm text-red-700">
                            Reset the platform to default settings. This will not delete user data.
                          </p>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-800 hover:bg-red-100">
                          Reset Settings
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-red-300 p-4 bg-red-50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-red-800">Maintenance Mode</h4>
                          <p className="text-sm text-red-700">
                            Put the platform in maintenance mode. Users will see a maintenance page.
                          </p>
                        </div>
                        <Button variant="destructive">
                          Enable Maintenance Mode
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
