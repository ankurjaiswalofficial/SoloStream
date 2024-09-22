import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-4">
      <Button asChild variant={"secondary"}><Link href="/sender">Sender</Link></Button>
      <Button asChild variant={"secondary"}><Link href="/receiver">Receiver</Link></Button>
    </div>
  );
}
