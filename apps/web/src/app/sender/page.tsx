"use client";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";


const Sender = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [pc, setPC] = useState<RTCPeerConnection | null>(null);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'sender'
            }));
        }
    }, []);

    const initiateConn = async () => {

        if (!socket) {
            alert("Socket not found");
            return;
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                await pc.setRemoteDescription(message.sdp);
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        }

        const pc = new RTCPeerConnection();
        setPC(pc);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        }

        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }));
        }

        getCameraStreamAndSend(pc);
        setActive(true);
    }

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (stream) => {
            if (!videoRef.current) { throw new Error("Video Element Missing") }
            videoRef.current.srcObject = stream;
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track);
            });
            await videoRef.current.play();
        });
    }

    const closeConnection = () => {
        pc?.close();
        if (!videoRef.current) { throw new Error("Video Element Missing") }
        const stream = videoRef.current.srcObject as MediaStream;
        videoRef.current.srcObject = null;
        stream?.getTracks().forEach(track => {
            track.stop()
        });
        if (socket) {
            console.log("socket")
            socket.send(JSON.stringify({
                type: 'close'
            }));
        }
        setActive(false);
        // socket?.close();
    }

    return (
        <div className="flex items-center justify-center gap-4 p-2 sm:p-4 w-full h-full select-none">
            <Card className="flex-grow max-w-xl w-full">
                <CardHeader>
                    <CardTitle>SoloStream Sender</CardTitle>
                    <CardDescription>The one and only person having the designation of the leader.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col items-center justify-center gap-2 p-2">
                    <div className="flex flex-row items-center gap-4 w-full px-2">
                        <Button className="flex-grow" onClick={initiateConn}>Start Stream</Button>
                        <Button className="flex-grow" onClick={closeConnection}>Stop Stream</Button>
                    </div>
                    <video className={cn("rounded-md", { "hidden": !active })} ref={videoRef} muted autoPlay></video>
                    <div className={cn("flex items-center justify-center w-full aspect-video rounded-md border", { "hidden": active })}>
                        <VideoIcon className="size-12" />
                    </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex flex-row gap-2 py-2">
                    <Button className="flex-grow" disabled onClick={closeConnection}>Turn Off Video</Button>
                    <Button className="flex-grow" asChild>
                        <Link href={"/"}>Return to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Sender;
