import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CENTRES, CROPS } from "@/lib/kisan/demo-data";
import { LANGUAGES, useI18n } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/farmer/profile")({
  component: ProfilePage
});
function ProfilePage() {
  const { profile, setProfile } = useKisan();
  const { setLang } = useI18n();
  const [form, setForm] = useState(profile);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Farmer Profile</h2>
        <p className="text-sm text-muted-foreground">
          Sample identification only — this prototype never stores Aadhaar or bank details.
        </p>
      </header>

      <form
    className="surface-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5"
    onSubmit={(e) => {
      e.preventDefault();
      setProfile(form);
      setLang(form.language);
      toast.success("Profile updated");
    }}
  >
        <div className="space-y-1.5">
          <Label htmlFor="pname">Full name</Label>
          <Input id="pname" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pphone">Mobile number</Label>
          <Input
    id="pphone"
    inputMode="numeric"
    maxLength={10}
    value={form.phone}
    onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
  />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pcode">Farmer ID</Label>
          <Input id="pcode" value={form.farmerCode} onChange={(e) => set("farmerCode", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pland">Land area (acres)</Label>
          <Input
    id="pland"
    type="number"
    step="0.1"
    min={0}
    value={form.landArea}
    onChange={(e) => set("landArea", Number(e.target.value))}
  />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pstate">State</Label>
          <Input id="pstate" value={form.state} onChange={(e) => set("state", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pdist">District</Label>
          <Input id="pdist" value={form.district} onChange={(e) => set("district", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pvil">Village</Label>
          <Input id="pvil" value={form.village} onChange={(e) => set("village", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Primary crop</Label>
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
        <div className="space-y-1.5">
          <Label>Language</Label>
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
        <div className="space-y-1.5">
          <Label>Preferred centre</Label>
          <Select value={form.preferredCentreId} onValueChange={(v) => set("preferredCentreId", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CENTRES.map((c) => <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="lg" className="sm:col-span-2">
          Save profile
        </Button>
      </form>
    </div>;
}
export {
  Route
};
