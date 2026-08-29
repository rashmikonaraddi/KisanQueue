import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, ShieldCheck, User, Wheat } from "@/lib/kisan/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brand } from "@/components/kisan/Brand";
import { DISCLAIMER } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in \u2014 KisanQueue" },
      {
        name: "description",
        content: "Sign in as a farmer, procurement centre operator or government administrator."
      },
      { property: "og:title", content: "Sign in \u2014 KisanQueue" },
      { property: "og:description", content: "Demo accounts available for hackathon judges." }
    ]
  }),
  component: LoginPage
});
function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useKisan();
  const [phone, setPhone] = useState("9999999999");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState("operator");
  const [pass, setPass] = useState("demo123");
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("demo123");
  function farmerLogin(e) {
    e.preventDefault();
    if (!otpSent) {
      if (!/^\d{10}$/.test(phone)) {
        toast.error("Enter a valid 10-digit mobile number");
        return;
      }
      setOtpSent(true);
      toast.success("OTP sent", { description: "Use demo OTP 123456" });
      return;
    }
    if (otp !== "123456") {
      toast.error("Incorrect OTP", { description: "Demo OTP is 123456" });
      return;
    }
    signIn("farmer");
    toast.success("Welcome back, Ravi 👋");
    void navigate({ to: "/farmer/centres" });
  }

  function quickFarmerLogin() {
    signIn("farmer");
    toast.success("Signed in as Ravi Kumar 👋");
    void navigate({ to: "/farmer/centres" });
  }
  function staffLogin(role, u, p) {
    const ok = p === "demo123" && (role === "operator" ? u === "operator" : u === "admin");
    if (!ok) {
      toast.error("Invalid credentials", { description: "Use the demo credentials shown below." });
      return;
    }
    signIn(role);
    void navigate({ to: role === "operator" ? "/operator" : "/admin" });
  }
  return <div className="field-pattern flex min-h-screen flex-col">
      <header className="border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Brand />
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
        <h1 className="font-display text-2xl font-bold">Sign in to KisanQueue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your role. All three demo accounts are pre-filled for judges.
        </p>

        <Tabs defaultValue="farmer" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="farmer" className="gap-1.5">
              <Wheat className="size-4" /> Farmer
            </TabsTrigger>
            <TabsTrigger value="operator" className="gap-1.5">
              <Building2 className="size-4" /> Operator
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-1.5">
              <ShieldCheck className="size-4" /> Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmer">
            <form onSubmit={farmerLogin} className="surface-card space-y-4 p-5">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile number</Label>
                <Input
    id="phone"
    inputMode="numeric"
    maxLength={10}
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
    placeholder="10-digit mobile number"
  />
              </div>
              {otpSent && <div className="space-y-1.5">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
    id="otp"
    inputMode="numeric"
    maxLength={6}
    value={otp}
    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
    placeholder="6-digit OTP"
  />
                </div>}
              <Button type="submit" size="lg" className="w-full">
                {otpSent ? "Verify & continue" : "Send OTP"}
              </Button>
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={quickFarmerLogin}>
                ⚡ 1-Click Demo Login (Ravi Kumar)
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                New farmer?{" "}
                <Link to="/register" className="font-semibold text-primary">
                  Register here
                </Link>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="operator">
            <form
    className="surface-card space-y-4 p-5"
    onSubmit={(e) => {
      e.preventDefault();
      staffLogin("operator", user, pass);
    }}
  >
              <div className="space-y-1.5">
                <Label htmlFor="opuser">Username</Label>
                <Input id="opuser" value={user} onChange={(e) => setUser(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="oppass">Password</Label>
                <Input
    id="oppass"
    type="password"
    value={pass}
    onChange={(e) => setPass(e.target.value)}
  />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Open operator dashboard
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form
    className="surface-card space-y-4 p-5"
    onSubmit={(e) => {
      e.preventDefault();
      staffLogin("admin", adminUser, adminPass);
    }}
  >
              <div className="space-y-1.5">
                <Label htmlFor="aduser">Username</Label>
                <Input id="aduser" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adpass">Password</Label>
                <Input
    id="adpass"
    type="password"
    value={adminPass}
    onChange={(e) => setAdminPass(e.target.value)}
  />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Open government dashboard
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <section className="surface-card mt-6 p-4">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <User className="size-4 text-primary" /> Demo Credentials
          </h2>
          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-3">
              <dt className="font-semibold">Farmer</dt>
              <dd className="mt-1 text-muted-foreground">Phone 9999999999</dd>
              <dd className="text-muted-foreground">OTP 123456</dd>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <dt className="font-semibold">Operator</dt>
              <dd className="mt-1 text-muted-foreground">operator</dd>
              <dd className="text-muted-foreground">demo123</dd>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <dt className="font-semibold">Admin</dt>
              <dd className="mt-1 text-muted-foreground">admin</dd>
              <dd className="text-muted-foreground">demo123</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-center text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </footer>
    </div>;
}
export {
  Route
};
