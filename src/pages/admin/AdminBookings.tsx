
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminBookings = () => {
  return (
    <AdminLayout activeTab="bookings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bookings & Payments</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions Overview</CardTitle>
            <CardDescription>Manage all bookings and payments on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bookings and payments management content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
