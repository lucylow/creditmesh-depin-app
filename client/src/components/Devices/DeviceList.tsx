import { useDevices } from "@/hooks/useDevices";
import { DeviceCard } from "@/components/Devices/DeviceCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorAlert } from "@/components/common/ErrorAlert";

export function DeviceList() {
  const { devices, loading, error } = useDevices();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground rounded-lg border border-dashed">
        No devices registered. Register your first device to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
