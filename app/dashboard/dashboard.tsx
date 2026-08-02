import ECGWidget from "@/components/DataWidgets/ECGwidget";
import { MonitorProvider } from "@/providers/MonitorProvider";

export default function DashboardPage() {
  return (
    <MonitorProvider>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <ECGWidget />
        </div>
      </div>
    </MonitorProvider>
  );
}