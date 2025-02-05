import { TransactionView } from "@/components/TransactionView";

export default function TransactionPage({ params }: { params: any }) {
  return (
    <div>
      <TransactionView hash={params.hash} />
    </div>
  );
}
