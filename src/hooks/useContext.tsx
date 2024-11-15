
import { RootState } from "@/store";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

type SocketContextProps = {
  isConnected: boolean;
  socketResponse: SocketResponse;
  sendData: (payload: Payload) => void;
  sendTypingEvent: (payload: TypingPayload) => void;
  sendStopTypingEvent: () => void;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  call: Call;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | undefined;
  name: any;
  setName: React.Dispatch<React.SetStateAction<any>>;
  callEnded: boolean;
  callUser: (currentStream?: MediaStream) => void;
  leaveCall: () => void;
  answerCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  selectedContact: any;
  setSelectedContact: any;
  isLoading?: boolean;
};

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" },
    { urls: "stun:stun01.sipphone.com" },
    { urls: "stun:stun.ekiga.net" },
    { urls: "stun:stun.fwdnet.net" },
    { urls: "stun:stun.ideasip.com" },
    { urls: "stun:stun.iptel.org" },
    { urls: "stun:stun.rixtelecom.se" },
    { urls: "stun:stun.schlund.de" },
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stunserver.org" },
    { urls: "stun:stun.softjoys.com" },
    { urls: "stun:stun.voiparound.com" },
    { urls: "stun:stun.voipbuster.com" },
    { urls: "stun:stun.voipstunt.com" },
    { urls: "stun:stun.voxgratia.org" },
    { urls: "stun:stun.xten.com" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },

    { urls: "stun:numb.viagenie.ca" },
    { urls: "stun:iphone-stun.strato-iphone.de:3478" },
    { urls: "stun:relay.webwormhole.io:3478" },
    { urls: "stun:stun-eu.3cx.com:3478" },
    { urls: "stun:stun-us.3cx.com:3478" },
    { urls: "stun:stun.1-voip.com:3478" },
    { urls: "stun:stun.12connect.com:3478" },
    { urls: "stun:stun.12voip.com:3478" },
    { urls: "stun:stun.1cbit.ru:3478" },
    { urls: "stun:stun.1und1.de:3478" },
    { urls: "stun:stun.3cx.com:3478" },
    { urls: "stun:stun.3deluxe.de:3478" },
    { urls: "stun:stun.3wayint.com:3478" },
    { urls: "stun:stun.5sn.com:3478" },
  ],
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user: User = useSelector((state: RootState) => state?.admin);

  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [socketResponse, setSocketResponse] = useState<SocketResponse>({
    contactId: "",
    content: "",
    messageType: "",
    mediaLocation: "",
    createdAt: "",
  });
  const [isConnected, setConnected] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [name, setName] = useState<{
    myUser: any;
    remoteUser: any;
  }>({ myUser: {}, remoteUser: {} });
  const [call, setCall] = useState<Call>({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy thông tin liên hệ cần chat, call
  const [selectedContact, setSelectedContact] = useState<{
    contactId: number;
    contactName: string;
    conversationId: number;
  }>({
    contactId: 0,
    contactName: "",
    conversationId: 0,
  });
  const { conversationId, contactId } = selectedContact;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sendData = useCallback(
    (payload: Payload) => {
      if (socket) {
        socket.emit("stop_typing", conversationId);
        socket.emit("send_message", {
          contactId: payload.contactId,
          content: payload.content,
          messageType: payload.messageType,
          mediaLocation: payload.mediaLocation,
        });
      } else {
        console.error("Socket is not initialized");
      }
    },
    [socket, conversationId],
  );

  const sendTypingEvent = useCallback(
    (payload: TypingPayload) => {
      if (socket) {
        socket.emit("typing", {
          contactId: payload.contactId,
          avatarLocation: payload.avatarLocation,
        });
      } else {
        console.error("Socket is not initialized");
      }
    },
    [socket],
  );

  const sendStopTypingEvent = useCallback(() => {
    if (socket) {
      console.log("Sending stop_typing event");
      setIsTyping(false);
      socket.emit("stop_typing", conversationId);
    } else {
      console.error("Socket is not initialized");
    }
  }, [socket, conversationId]);

  const endCallCleanup = useCallback(() => {
    if (myVideo.current?.srcObject) {
      (myVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (userVideo.current?.srcObject) {
      (userVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (connectionRef.current) {
      connectionRef.current.close();
      // connectionRef.current = null;
    }
  }, []);

  const leaveCall = useCallback(() => {
    setCallEnded(true);
    endCallCleanup();
    closeModal();
    if (socket) {
      socket.emit("leave");
    }
  }, [socket, endCallCleanup]);

  useEffect(() => {
    if (conversationId && contactId) {
      setIsLoading(true);
      const socketBaseUrl = "https://chat-call-app-api.onrender.com";
      const s = io(socketBaseUrl, {
        query: { conversationId, contactId },
      });

      setSocket(s);

      s.on("connect", () => {
        setConnected(true);
        setIsLoading(false);
      });

      s.on("connect_error", (error) => {
        console.error("SOCKET CONNECTION ERROR", error);
      });

      s.on("get_message", (res) => {
        setSocketResponse({ ...res, createdAt: new Date() });
      });

      s.on("typing", (data) => {
        if (data.contactId !== contactId) {
          setIsTyping(true);
        }
      });

      s.on("stop_typing", () => {
        setIsTyping(false);
      });

      s.on("ready", (data) => {
        setName({ ...name, remoteUser: data });
        setCallAccepted(false);
        openModal();
      });

      s.on("offer", (offer) => {
        setCall({ isReceivingCall: true, signal: offer });
        setCallEnded(false);
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          })
          .then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
              myVideo.current.srcObject = currentStream;
            }
          });
      });

      s.on("answer", (answer) => {
        setCallAccepted(true);

        if (connectionRef.current) {
          connectionRef.current
            .setRemoteDescription(new RTCSessionDescription(answer))
            .catch((error) => {
              console.error("Error setting remote description:", error);
            });
        } else {
          console.error("Peer connection is not available");
        }
      });

      s.on("candidate", (candidate) => {
        if (candidate && candidate.candidate) {
          if (connectionRef.current) {
            connectionRef.current
              .addIceCandidate(new RTCIceCandidate(candidate))
              .catch((error) => {
                console.error("Error adding ICE candidate:", error);
              });
          } else {
            console.error(
              "Peer connection or remote description is not available",
            );
          }
        } else {
          console.error("Invalid candidate data:", candidate);
        }
      });

      s.on("leave", () => {
        setCallEnded(true);
        endCallCleanup();
        closeModal();
      });

      return () => {
        s.disconnect();
      };
    }
  }, [conversationId, contactId]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new RTCPeerConnection(peerConnectionConfig);

    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("candidate", event.candidate);
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      } else {
        console.error("userVideo.current is not available");
      }
    };

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer
      .setRemoteDescription(new RTCSessionDescription(call.signal))
      .then(() => {
        return peer.createAnswer();
      })
      .then((answer) => {
        return peer.setLocalDescription(answer);
      })
      .then(() => {
        if (socket) {
          socket.emit("answer", peer.localDescription);
        }
      })
      .catch((error) => {
        console.error("Error handling answer call:", error);
      });

    connectionRef.current = peer;
  };

  const callUser = () => {
    openModal();
    setCallEnded(false);
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
          if (socket) {
            socket.emit("ready", user);
          }
        }
        const peer = new RTCPeerConnection(peerConnectionConfig);

        peer.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.emit("candidate", event.candidate);
          }
        };

        peer.ontrack = (event) => {
          if (userVideo.current) {
            userVideo.current.srcObject = event.streams[0];
          }
        };

        currentStream.getTracks().forEach((track) => {
          peer.addTrack(track, currentStream);
        });

        peer
          .createOffer()
          .then((offer) => {
            return peer.setLocalDescription(offer);
          })
          .then(() => {
            if (socket) {
              socket.emit("offer", peer.localDescription);
            }
          })
          .catch((error) => {
            console.error("Error handling call user:", error);
          });

        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        isLoading,
        isConnected,
        socketResponse,
        sendData,
        sendTypingEvent,
        sendStopTypingEvent,
        isTyping,
        setIsTyping,
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        callUser,
        leaveCall,
        answerCall,
        toggleAudio,
        toggleVideo,
        isAudioMuted,
        isVideoOff,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}

      {/* Modal call */}
      
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
