export interface Topic {
  classRoomContent: string;
  name: string;
  id: number;
  content: string;
  imageLocation: string;
  videoLocation: string;
  classroom: any;
  creator: User;
}

export interface User {
  id: number;
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

export interface Vocabulary {
  content: string;
  imageLocation: string;
  videoLocation: string;
  topicId: number;
  type?: string;
  file?: string;
}
