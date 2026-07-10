export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;
  body: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isActive: number;
    createdAt: string;
    modifiedAt: string | null;
    createdBy: string | null;
    modifiedBy: string | null;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  roles?: string[];
}