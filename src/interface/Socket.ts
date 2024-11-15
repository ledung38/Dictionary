interface SocketResponse {
  contactId: string;
  content: string;
  messageType: string;
  mediaLocation: string;
  createdAt: Date | string;
}

interface SocketResponseSocket {
  to: User | undefined;
  from: User | undefined;
  content: string;
  messageType: string;
  mediaLocation: string;
  createdAt: Date | string;
}

interface Payload {
  contactId: string;
  content: string;
  messageType: string;
  mediaLocation?: string;
}

interface PayloadSocKet {
  to: User;
  from: User;
  content: string;
  messageType: string;
  mediaLocation?: string;
  conversationId?: string | number;
}

interface TypingPayload {
  contactId: number;
  avatarLocation: string;
}

interface TypingPayloadSocket {
  to: User;
  from: User;
}

interface Call {
  isReceivingCall?: boolean;
  signal?: any;
}

interface ContextProviderProps {
  children: any;
}

interface SocketContextProps {
  call: Call;
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  stream: MediaStream | undefined;
  name: any;
  setName: any;
  callEnded: boolean;
  callUser: () => void;
  leaveCall: () => void;
  answerCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  startVideo: () => void;
}
