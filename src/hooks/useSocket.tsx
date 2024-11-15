import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (conversationId: number, contactId: number) => {
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
      setIsTyping(false);
      socket.emit("stop_typing", conversationId);
    } else {
      console.error("Socket is not initialized");
    }
  }, [socket, conversationId]);

  useEffect(() => {
    if (conversationId && contactId) {
      const socketBaseUrl = "https://chat-call-app.onrender.com";
      // const socketBaseUrl = "http://localhost:8017";
      const s = io(socketBaseUrl, {
        query: { conversationId, contactId },
      });

      setSocket(s);

      s.on("connect", () => {
        setConnected(true);
      });

      s.on("connect_error", (error: any) => {
        console.error("SOCKET CONNECTION ERROR", error);
      });

      s.on("get_message", (res: SocketResponse) => {
        setSocketResponse({ ...res, createdAt: new Date() });
      });

      s.on("typing", (data: { contactId: number }) => {
        if (data.contactId !== contactId) {
          setIsTyping(true);
        }
      });

      s.on("stop_typing", () => {
        setIsTyping(false);
      });

      return () => {
        s.disconnect();
      };
    }
  }, [conversationId, contactId]);

  return {
    isConnected,
    socketResponse,
    sendData,
    sendTypingEvent,
    sendStopTypingEvent,
    isTyping,
    setIsTyping,
  };
};
