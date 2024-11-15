interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  birthDay: string;
  gender: string;
  avatarLocation: string;
}

interface LastMessage {
  messageId: number;
  content: string;
  messageType: string;
  mediaLocation: string | null;
  status: number;
  created: string;
  contactName: string;
}

interface Contact {
  contactId: number;
  contactName: string;
  avatarLocation: string | null;
  email: string;
  lastActivity: string | null;
  lastMessageRes: LastMessage | null;
  conversationId?: number;
}

//friend
interface FriendProps {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  role: "ADMIN" | "USER" | "MODERATOR";
  birthDay: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  avatarLocation: string | null;
}

interface Conversation {
  conversationId: number;
  grouAttachConvResList: Contact[];
}

type Conversations = Conversation[];

// Message
interface Message {
  contactId: number;
  content: string;
  mediaLocation?: string;
  created: string;
  createdAt: string;
}

interface ContentMessageProps {
  messages: Message[];
  user: User | null;
  isFetching?: boolean;
  isTyping?: boolean;
  userInfo?: User | null;
  contactId?: number;
}
