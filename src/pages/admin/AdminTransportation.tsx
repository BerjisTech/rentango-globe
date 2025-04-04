
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminTransportation = () => {
  return (
    <AdminLayout activeTab="transportation">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transportation Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Vehicles Overview</CardTitle>
            <CardDescription>Manage all vehicles listed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Transportation management content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransportation;
