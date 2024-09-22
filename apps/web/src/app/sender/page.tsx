"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react"

const Sender = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [pc, setPC] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://192.168.3.68:8080');
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
    }

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (stream) => {
            if (!videoRef.current) { throw new Error("Video Element Missing") }
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track);
            });
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
        if(socket){
            console.log("socket")
        socket.send(JSON.stringify({
            type: 'close'
        }));}
        // socket?.close();
    }

    return (
        <div>
            Sender
            <Button onClick={initiateConn}>Start Stream</Button>
            <Button onClick={closeConnection}>Stop Stream</Button>
            <video ref={videoRef} autoPlay></video>
        </div>
    )
}

export default Sender;
