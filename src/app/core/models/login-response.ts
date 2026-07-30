export interface LoginResponse {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;
  body: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    firstName: string;
    lastName: string;
  };
}