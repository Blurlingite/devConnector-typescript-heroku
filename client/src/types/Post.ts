import { User } from "./User";

export interface Post {
  user: User;
  text: string;
  name: string;
  avatar: string;
  likes: [
    {
      user: User;
    }
  ];
  comments: [
    {
      user: User;
      text: string;
      name: string;
      avatar: string;
      date: Date;
    }
  ];
  date: Date;
}
