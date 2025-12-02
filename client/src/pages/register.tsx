import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { Loader2, UserPlus } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          newsletter: formData.newsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Trigger storage event for header component to update
      window.dispatchEvent(new Event('storage'));
      
      // If user needs email confirmation, show message instead of navigating
      if (data.message) {
        setError(data.message);
        return;
      }
      
      navigate("/account");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2a201c] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-[#c45d36]" />
            </div>
            <h1 className="font-display text-4xl text-[#e8dac9] mb-2">
              Join The Dude
            </h1>
            <p className="text-white/60">
              Create an account to track orders and save favorites
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-[#2a201c] p-8 rounded-sm">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-sm text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white/70">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(d => ({ ...d, firstName: e.target.value }))}
                  required
                  className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                  placeholder="Jeffrey"
                  data-testid="input-firstName"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(d => ({ ...d, lastName: e.target.value }))}
                  required
                  className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                  placeholder="Lebowski"
                  data-testid="input-lastName"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white/70">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
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
                value={formData.password}
                onChange={(e) => setFormData(d => ({ ...d, password: e.target.value }))}
                required
                className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                placeholder="At least 8 characters"
                data-testid="input-password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(d => ({ ...d, confirmPassword: e.target.value }))}
                required
                className="bg-[#1a120f] border-white/10 text-[#e8dac9] mt-1"
                placeholder="Confirm your password"
                data-testid="input-confirmPassword"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData(d => ({ ...d, acceptTerms: !!checked }))}
                  className="border-white/20 data-[state=checked]:bg-[#c45d36] data-[state=checked]:border-[#c45d36]"
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-sm text-white/60 leading-tight cursor-pointer">
                  I accept the <Link href="/terms" className="text-[#c45d36] hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="text-[#c45d36] hover:text-white">Privacy Policy</Link>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => setFormData(d => ({ ...d, newsletter: !!checked }))}
                  className="border-white/20 data-[state=checked]:bg-[#c45d36] data-[state=checked]:border-[#c45d36]"
                  data-testid="checkbox-newsletter"
                />
                <Label htmlFor="newsletter" className="text-sm text-white/60 leading-tight cursor-pointer">
                  Send me updates about new products and sales (optional)
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
              data-testid="btn-register"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-[#c45d36] hover:text-white transition-colors" data-testid="link-login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
