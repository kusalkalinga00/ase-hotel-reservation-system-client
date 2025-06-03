export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: IUser;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
