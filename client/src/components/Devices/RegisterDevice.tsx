import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import { uploadToIPFS } from "@/services/ipfs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegisterDevice() {
  const { account } = useWeb3();
  const { deviceNFT } = useContracts();
  const [form, setForm] = useState({
    deviceType: "0",
    deviceDID: "",
    name: "",
    description: "",
    image: null as File | null,
    location: "",
    manufacturer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceNFT || !account) {
      setError("Wallet not connected");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let imageHash = "";
      if (form.image) {
        imageHash = await uploadToIPFS(form.image);
      }
      const metadata = {
        name: form.name,
        description: form.description,
        image: imageHash ? `ipfs://${imageHash}` : "",
        attributes: [
          { trait_type: "Location", value: form.location },
          { trait_type: "Manufacturer", value: form.manufacturer },
        ],
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataHash = await uploadToIPFS(metadataBlob);
      const metadataURI = `ipfs://${metadataHash}`;

      const tx = await deviceNFT.registerDevice(
        account,
        parseInt(form.deviceType, 10),
        form.deviceDID,
        metadataURI
      );
      await tx.wait();
      alert("Device registered successfully!");
      setForm({
        deviceType: "0",
        deviceDID: "",
        name: "",
        description: "",
        image: null,
        location: "",
        manufacturer: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Register New Device</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Device Type</Label>
            <Select
              value={form.deviceType}
              onValueChange={(v) => setForm({ ...form, deviceType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sensor</SelectItem>
                <SelectItem value="1">Gateway</SelectItem>
                <SelectItem value="2">Satellite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deviceDID">Device DID</Label>
            <Input
              id="deviceDID"
              name="deviceDID"
              value={form.deviceDID}
              onChange={handleChange}
              placeholder="did:creditmesh:1234"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Nairobi, Kenya"
            />
          </div>
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
            />
          </div>
          {error && <ErrorAlert message={error} />}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register Device"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
