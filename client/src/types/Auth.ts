export interface Auth {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: { _id: string };
}
