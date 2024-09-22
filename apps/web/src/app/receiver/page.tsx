"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react"


const Receiver = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        const socket = new WebSocket('ws://192.168.3.68:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket: WebSocket) {

        const pc = new RTCPeerConnection();
        pc.ontrack = async (event) => {
            if (!videoRef.current) { throw new Error("Video Element Missing") }
            videoRef.current.srcObject = new MediaStream([event.track]);
            await videoRef.current?.play();
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {
                await pc.setRemoteDescription(message.sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: answer
                }));
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            } else if (message.type === "close") {
                if (!videoRef.current) { throw new Error("Video Element Missing") }
                videoRef.current.srcObject = null;
            }
        }
    }

    return (
        <div>
            Receiver
            <Button onClick={() => videoRef.current?.play()}>Play</Button>
            <video ref={videoRef} autoPlay></video>
        </div>
    )
}

export default Receiver;
