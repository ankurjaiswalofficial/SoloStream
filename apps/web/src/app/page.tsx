"use client";
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
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "WELCOME TO SOLOSTREM HOMEPAGE :)",
      description: "Become a SENDER or become a RECEIVER and Start",
      variant: "success"
    })
  }, [toast])

  return (
    <div className="flex items-center justify-center gap-4 p-2 sm:p-4 w-full h-full select-none">
      <Card className="flex-grow max-w-sm w-full">
        <CardHeader>
          <CardTitle>SoloStream</CardTitle>
          <CardDescription>Single Streamer for your committer.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="flex-grow"><Link href="/sender">Sender</Link></Button>
          <Button asChild className="flex-grow"><Link href="/receiver">Receiver</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
