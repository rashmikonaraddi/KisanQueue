import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "@/lib/kisan/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Brand } from "@/components/kisan/Brand";
import { CENTRES, CROPS, DISCLAIMER } from "@/lib/kisan/demo-data";
import { LANGUAGES } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Farmer Registration \u2014 KisanQueue" },
      {
        name: "description",
        content: "Register in four short steps with your village, land area and crop details. No Aadhaar required in this prototype."
      },
      { property: "og:title", content: "Farmer Registration \u2014 KisanQueue" },
      { property: "og:description", content: "Four-step farmer onboarding for procurement slot booking." }
    ]
  }),
  component: RegisterPage
});
const STATES = ["Karnataka", "Tamil Nadu", "Maharashtra", "Telangana"];
const DISTRICTS = ["Mysuru", "Mandya", "Hassan", "Ballari", "Belagavi", "Kalaburagi"];
function RegisterPage() {
  const navigate = useNavigate();
  const { profile, setProfile, signIn } = useKisan();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...profile, name: "", phone: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  function next() {
    if (step === 1) {
      if (form.name.trim().length < 3) {
        toast.error("Please enter your full name");
        return;
      }
      if (!/^\d{10}$/.test(form.phone)) {
        toast.error("Enter a valid 10-digit mobile number");
        return;
      }
    }
    if (step === 2 && !form.village.trim()) {
      toast.error("Please enter your village");
      return;
    }
    if (step === 3 && (!form.farmerCode.trim() || form.landArea <= 0)) {
      toast.error("Enter a farmer ID and a land area greater than zero");
      return;
    }
    if (step === 4) {
      setProfile({ ...form });
      signIn("farmer");
      toast.success("Registration complete", { description: `Welcome to KisanQueue, ${form.name}!` });
      void navigate({ to: "/farmer/centres" });
      return;
    }
    setStep((s) => s + 1);
  }
  return <div className="field-pattern flex min-h-screen flex-col">
      <header className="border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Brand />
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link to="/login">Already registered?</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Farmer Registration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Step {step} of 4</p>
        <Progress value={step * 25} className="mt-3 h-2" />

        <div className="surface-card mt-6 space-y-4 p-5">
          {step === 1 && <>
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rphone">Mobile number</Label>
                <Input
    id="rphone"
    inputMode="numeric"
    maxLength={10}
    value={form.phone}
    onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
  />
              </div>
              <div className="space-y-1.5">
                <Label>Language preference</Label>
                <Select value={form.language} onValueChange={(v) => set("language", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => <SelectItem key={l.code} value={l.code}>
                        {l.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>}

          {step === 2 && <>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Select value={form.state} onValueChange={(v) => set("state", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>District</Label>
                <Select value={form.district} onValueChange={(v) => set("district", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="village">Village</Label>
                <Input id="village" value={form.village} onChange={(e) => set("village", e.target.value)} />
              </div>
            </>}

          {step === 3 && <>
              <div className="space-y-1.5">
                <Label htmlFor="fid">Farmer ID (sample identification number)</Label>
                <Input id="fid" value={form.farmerCode} onChange={(e) => set("farmerCode", e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  This prototype never asks for Aadhaar or bank details.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="land">Land area (acres)</Label>
                <Input
    id="land"
    type="number"
    min={0}
    step="0.1"
    value={form.landArea}
    onChange={(e) => set("landArea", Number(e.target.value))}
  />
              </div>
              <div className="space-y-1.5">
                <Label>Crop type</Label>
                <Select value={form.crop} onValueChange={(v) => set("crop", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS.map((c) => <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>}

          {step === 4 && <>
              <div className="space-y-1.5">
                <Label>Preferred procurement centre</Label>
                <Select
    value={form.preferredCentreId}
    onValueChange={(v) => set("preferredCentreId", v)}
  >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CENTRES.map((c) => <SelectItem key={c.id} value={c.id}>
                        {c.name} · {c.distanceKm} km
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="size-4 text-success" /> Ready to submit
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Name: {form.name || "\u2014"}</li>
                  <li>
                    Location: {form.village || "\u2014"}, {form.district}, {form.state}
                  </li>
                  <li>
                    Crop: {form.crop} · {form.landArea} acres
                  </li>
                </ul>
              </div>
            </>}

          <div className="flex gap-3 pt-2">
            {step > 1 && <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>}
            <Button className="flex-1" size="lg" onClick={next}>
              {step === 4 ? "Complete registration" : "Continue"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t px-4 py-4 text-center text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </footer>
    </div>;
}
export {
  Route
};
