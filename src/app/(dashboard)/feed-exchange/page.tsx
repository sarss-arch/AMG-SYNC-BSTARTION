import { PageHeader } from "@/components/ui/PageHeader";
import { FeedExchangeClient } from "@/components/feed/FeedExchangeClient";

export default function FeedExchangePage() {
  return (
    <>
      <PageHeader
        title="Feed Exchange"
        subtitle="Marketplace internal untuk supplier bidding, ranking berbasis best value, dan purchase recommendation."
      />
      <FeedExchangeClient />
    </>
  );
}
