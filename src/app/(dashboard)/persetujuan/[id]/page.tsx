import { PageHeader } from "@/components/ui/PageHeader";
import { ApprovalDetailClient } from "@/components/approval/ApprovalDetailClient";
import { getApproval } from "@/services/approval.service";

export default async function ApprovalDetailPage({ params }: { params: Promise<{id:string}> }) {
  const {id}=await params;
  const approval=await getApproval(id);
  return <><PageHeader title={`Persetujuan ${approval.id}`} subtitle="Setujui, ubah, atau tolak dengan alasan yang tercatat."/><ApprovalDetailClient approval={approval}/></>;
}
