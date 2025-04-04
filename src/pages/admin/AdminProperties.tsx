
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminProperties = () => {
  return (
    <AdminLayout activeTab="properties">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Properties Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Properties Overview</CardTitle>
            <CardDescription>Manage all properties listed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Properties management content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
