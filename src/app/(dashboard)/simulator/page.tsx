import { PageHeader } from "@/components/ui/PageHeader";
import { SimulatorClient } from "@/components/simulator/SimulatorClient";

export default function SimulatorPage(){
  return <><PageHeader title="Simulator Skenario" subtitle="Bandingkan dampak keputusan sebelum diajukan ke approver."/><SimulatorClient/></>;
}
