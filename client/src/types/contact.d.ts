interface Contact {
  id: number;
  fromId: string;
  contactId: string;
  contact: ContactInfo;
  friends: boolean;
}

interface ContactInfo {
  id: string;
  username: string;
  name: string;
  lastName: string;
  profilePicture: string;
  about: string;
  birthDay: string;
  email: string;
  createAt?: Date;
  gender?: string;
  id?: string;
  isNewUser?: boolean;
  isProfilePrivate?: string;
  message?: string;
  messageId?: number;
  messageStatus?: string;
  recieverId?: string;
  senderId?: string;
  totalUnreadMessages?: number;
  type?: string;
  typeSingUp?: string;
  updatedAt?: Date;
}
