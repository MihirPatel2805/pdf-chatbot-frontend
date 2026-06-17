import { useAuth } from "@clerk/clerk-react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Base URL - you can set this in your environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// Types for API responses
export interface UploadResponse {
  message: string;
  session_id: string;
  index_name: string;
  files_processed: number;
  status: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  session_id: string;
  confidence?: number;
  processing_time?: number;
}

export interface UserSession {
  session_id: string;
  user_id: string;
  index_name: string;
  created_at: string;
  last_accessed?: string;
  document_count: number;
  is_active: boolean;
  name?: string;
  description?: string;
}

export interface UserSessionsListResponse {
  sessions: UserSession[];
  total_count: number;
  user_id: string;
}

export interface UserProfileResponse {
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  total_sessions: number;
  active_sessions: number;
  total_documents: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
}

// Create axios instance
const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to get auth token:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error("Unauthorized access - token may be expired");
      } else if (error.response?.status === 403) {
        // Handle forbidden access
        console.error("Forbidden access - insufficient permissions");
      } else if (error.response?.status >= 500) {
        // Handle server errors
        console.error("Server error:", error.response?.data);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// API service class
export class ApiService {
  private client: AxiosInstance;

  constructor(getToken: () => Promise<string | null>) {
    this.client = createApiClient(getToken);
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get("/health");
    return response.data;
  }

  // User profile
  async getUserProfile(): Promise<UserProfileResponse> {
    const response = await this.client.get("/user/profile");
    return response.data;
  }

  // Session management
  async createSession(
    name?: string,
    description?: string
  ): Promise<UserSession> {
    const response = await this.client.post("/user/sessions", {
      name,
      description,
    });
    return response.data;
  }

  async getUserSessions(): Promise<UserSessionsListResponse> {
    const response = await this.client.get("/user/sessions");
    return response.data;
  }

  async getUserSession(sessionId: string): Promise<UserSession> {
    const response = await this.client.get(`/user/sessions/${sessionId}`);
    return response.data;
  }

  async deleteUserSession(sessionId: string): Promise<{ message: string }> {
    const response = await this.client.delete(`/user/sessions/${sessionId}`);
    return response.data;
  }

  // File upload
  async uploadPDFs(
    files: File[],
    name: string,
    description: string,
    sessionId?: string
  ): Promise<UploadResponse> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("name", name);
    formData.append("description", description);

    if (sessionId) {
      formData.append("session_id", sessionId);
    }

    const response = await this.client.post("/user/upload-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Chat
  async sendChatMessage(
    question: string,
    sessionId: string,
    maxTokens?: number
  ): Promise<ChatResponse> {
    const response = await this.client.post("/user/chat", {
      question,
      session_id: sessionId,
      max_tokens: maxTokens,
    });

    return response.data;
  }

  // Legacy endpoints (for backward compatibility)
  async createLegacySession(): Promise<{
    session_id: string;
    index_name: string;
    message: string;
  }> {
    const response = await this.client.post("/create-session");
    return response.data;
  }

  async uploadPDFsLegacy(
    files: File[],
    name: string,
    description: string,
    sessionId?: string
  ): Promise<UploadResponse> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("name", name);
    formData.append("description", description);

    if (sessionId) {
      formData.append("session_id", sessionId);
    }

    const response = await this.client.post("/upload-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async sendLegacyChatMessage(
    question: string,
    sessionId: string,
    indexName?: string,
    maxTokens?: number
  ): Promise<ChatResponse> {
    const response = await this.client.post("/chat", {
      question,
      session_id: sessionId,
      index_name: indexName,
      max_tokens: maxTokens,
    });

    return response.data;
  }
}

// Hook to create API service instance
export const useApiService = () => {
  const { getToken } = useAuth();
  return new ApiService(getToken);
};
