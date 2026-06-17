import { useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  MessageSquare,
  Plus,
  TrendingUp,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useApiService, UserProfileResponse, UserSession } from "../lib/api";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const apiService = useApiService();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sessionsResponse, profileResponse] = await Promise.all([
        apiService.getUserSessions(),
        apiService.getUserProfile(),
      ]);

      setSessions(sessionsResponse.sessions.slice(0, 5)); // Show only recent 5 sessions
      setProfile(profileResponse);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const newSession = await apiService.createSession(
        `Session ${new Date().toLocaleDateString()}`,
        "New chat session"
      );
      toast.success("New session created!");
      navigate(`/chat/${newSession.session_id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to chat with your documents? Let's get started.
            </p>
          </div>
          <button
            onClick={handleCreateSession}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.total_sessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.active_sessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.total_documents}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/chat"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Start New Chat</h3>
              <p className="text-sm text-gray-600">Begin a new conversation</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            to="/sessions"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Upload Documents</h3>
              <p className="text-sm text-gray-600">Add PDFs to your sessions</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Sessions
          </h2>
          <Link
            to="/sessions"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first session to start chatting with documents
            </p>
            <button
              onClick={handleCreateSession}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Session
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link
                key={session.session_id}
                to={`/chat/${session.session_id}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <MessageSquare className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {session.name ||
                        `Session ${session.session_id.slice(0, 8)}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {session.document_count} documents • Created{" "}
                      {formatDate(session.created_at)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Getting Started
        </h2>
        <p className="text-gray-600 mb-4">
          New to PDF Chatbot? Here's how to get started:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Create a new session or select an existing one</li>
          <li>Upload your PDF documents using the upload feature</li>
          <li>Start asking questions about your documents</li>
          <li>Get intelligent answers powered by AI</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
