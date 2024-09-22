"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { VideoIcon } from "lucide-react";

const Receiver = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const mediaTracks = useRef<MediaStream | null>(null);
    const [active, setActive] = useState<boolean>(false);
    const [rejoin, setRejoin] = useState<boolean>(false);

    useEffect(() => {
        const socket = new WebSocket('ws://192.168.3.68:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        socketRef.current = socket;
        startReceiving();
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {
                if (rejoin) return;
                await pcRef.current?.setRemoteDescription(message.sdp);
                const answer = await pcRef.current?.createAnswer();
                await pcRef.current?.setLocalDescription(answer);
                socket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: answer
                }));
            } else if (message.type === 'iceCandidate') {
                if (rejoin) return;
                pcRef.current?.addIceCandidate(message.candidate);
            } else if (message.type === "close") {
                if (rejoin) return;
                if (!videoRef.current) { throw new Error("Video Element Missing") }
                videoRef.current.srcObject = null;
                console.log("Video Source set to null !!!");
                pcRef.current?.close();
                pcRef.current = null;
                setRejoin(true);
                setActive(false);
            }
        }
    }, []);

    function startReceiving() {
        setRejoin(false);
        const pc = new RTCPeerConnection();
        pc.ontrack = async (event) => {
            if (!videoRef.current) { throw new Error("Video Element Missing") }
            const stream = new MediaStream([event.track]);
            videoRef.current.srcObject = stream;
            mediaTracks.current = stream;
        }

        pcRef.current = pc;
    }

    const handleReJoin = () => {
        startReceiving();
    }

    const handlePC = () => {
        if (videoRef.current && mediaTracks.current) {
            videoRef.current.srcObject = mediaTracks.current;
        }
        videoRef.current?.play();
        setActive(true);
    }

    return (
        <div className="flex items-center justify-center gap-4 p-2 sm:p-4 w-full h-full select-none">
            <Card className="flex-grow max-w-xl w-full">
                <CardHeader>
                    <CardTitle>SoloStream Receiver</CardTitle>
                    <CardDescription>The one and only person watching the committer.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col items-center justify-center gap-2 p-2">
                    <div className="flex flex-row items-center gap-4 w-full px-2">
                        {rejoin ? <Button className="flex-grow" onClick={handleReJoin}>Rejoin Stream</Button>
                            : <Button className="flex-grow" onClick={handlePC}>Join Stream</Button>}
                        <Button className="flex-grow" disabled onClick={() => { }}>Leave Stream</Button>
                    </div>
                    <video className={cn("rounded-md", { "hidden": !active })} ref={videoRef} autoPlay></video>
                    <div className={cn("flex items-center justify-center w-full aspect-video rounded-md border", { "hidden": active })}>
                        <VideoIcon className="size-12" />
                    </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex flex-row gap-2 py-2">
                    <Button className="flex-grow" disabled onClick={() => { }}>Turn Off Video</Button>
                    <Button className="flex-grow" asChild>
                        <Link href={"/"}>Return to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Receiver;
