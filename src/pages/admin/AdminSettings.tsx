
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminSettings = () => {
  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Platform Settings</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure platform-wide settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Platform settings content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
