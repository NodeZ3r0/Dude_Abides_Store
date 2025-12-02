import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function Account() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/60">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email;

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2a201c] rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-[#c45d36]" />
              </div>
              <div>
                <h1 className="font-display text-3xl text-[#e8dac9]" data-testid="text-user-name">
                  {displayName}
                </h1>
                <p className="text-white/60">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white/50 hover:text-[#c45d36]"
              data-testid="btn-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="bg-[#2a201c] border-0 p-1">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-[#c45d36] data-[state=active]:text-white text-white/60"
                data-testid="tab-orders"
              >
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="addresses"
                className="data-[state=active]:bg-[#c45d36] data-[state=active]:text-white text-white/60"
                data-testid="tab-addresses"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-[#c45d36] data-[state=active]:text-white text-white/60"
                data-testid="tab-settings"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <div className="bg-[#2a201c] rounded-sm p-8 text-center">
                <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-[#e8dac9] text-xl mb-2">No Orders Yet</h3>
                <p className="text-white/60 mb-6">
                  When you make a purchase, your order history will appear here.
                </p>
                <Link href="/products">
                  <Button className="bg-[#c45d36] hover:bg-[#a04d2e] text-white" data-testid="btn-shop-now">
                    Start Shopping
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-[#e8dac9]">Saved Addresses</h2>
                <Button variant="outline" className="border-[#c45d36] text-[#c45d36] hover:bg-[#c45d36] hover:text-white">
                  Add New Address
                </Button>
              </div>
              <div className="bg-[#2a201c] rounded-sm p-8 text-center">
                <MapPin className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-[#e8dac9] text-xl mb-2">No Addresses Saved</h3>
                <p className="text-white/60">
                  Add a shipping address for faster checkout.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="bg-[#2a201c] rounded-sm p-6">
                <h2 className="font-display text-xl text-[#e8dac9] mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <p className="text-[#e8dac9]">Email Address</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                    <Button variant="ghost" className="text-[#c45d36]">
                      Change
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <p className="text-[#e8dac9]">Password</p>
                      <p className="text-white/60 text-sm">Last changed: Never</p>
                    </div>
                    <Button variant="ghost" className="text-[#c45d36]">
                      Change
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <p className="text-[#e8dac9]">Newsletter</p>
                      <p className="text-white/60 text-sm">Receive updates about new products</p>
                    </div>
                    <Button variant="ghost" className="text-[#c45d36]">
                      Manage
                    </Button>
                  </div>

                  <div className="pt-4">
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
