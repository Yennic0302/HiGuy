import { UserData } from "./auth";

interface CreatingMessage {
  from: string;
  to: string;
  message: string;
}

interface MessageFromBackEnd {
  id: number;
  sender: UserData;
  senderId: string;
  reciever: UserData;
  recieverId: string;
  type: string;
  message: string;
  messageStatus: string;
  createAt: Date;
}
