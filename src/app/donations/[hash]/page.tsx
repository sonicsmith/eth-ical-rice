import { DonationView } from "@/components/DonationView";

export default function TransactionPage({ params }: { params: any }) {
  return (
    <div>
      <DonationView hash={params.hash} />
    </div>
  );
}
