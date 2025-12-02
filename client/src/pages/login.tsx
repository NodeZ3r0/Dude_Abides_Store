import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { Loader2, User } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Trigger storage event for header component to update
      window.dispatchEvent(new Event('storage'));
      navigate("/account");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2a201c] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-[#c45d36]" />
            </div>
            <h1 className="font-display text-4xl text-[#e8dac9] mb-2">
              Welcome Back
            </h1>
            <p className="text-white/60">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#2a201c] p-8 rounded-sm">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-sm text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white/70">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                placeholder="thedude@abides.com"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                placeholder="Enter your password"
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
              data-testid="btn-submit-login"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-[#c45d36] hover:text-white transition-colors">
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-white/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#c45d36] hover:text-white transition-colors" data-testid="link-register">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
