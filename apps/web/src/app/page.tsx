import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
export default function Home() {
  return (
    <div className="flex items-center justify-center gap-4 p-2 sm:p-4 w-full h-full select-none">
      <Card className="flex-grow max-w-sm w-full">
        <CardHeader>
          <CardTitle>SoloStream</CardTitle>
          <CardDescription>Single Streamer for your committer.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-2 p-2">
          <Button asChild className="flex-grow"><Link href="/sender">Sender</Link></Button>
          <Button asChild className="flex-grow"><Link href="/receiver">Receiver</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
