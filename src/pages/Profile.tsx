import { useUser } from "@clerk/clerk-react";
import {
  Activity,
  Calendar,
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApiService, UserProfileResponse } from "../lib/api";
import { TrendingDown } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useUser();
  const apiService = useApiService();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Intentional bad code for testing AI Reviewer
  const [dataState, setDataState] = useState<any>(null);

  const badAsyncFunction = async (x: any) => {
    const res = await fetch(`https://api.example.com/data/${x}`);
    const data = await res.json();
    setDataState(data);
  };

  useEffect(() => {
    loadProfile();
    badAsyncFunction("test-id");
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await apiService.getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Your account information and usage statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {profile?.full_name || user?.fullName || "User"}
              </h2>
              <p className="text-gray-600 mb-4">
                {profile?.email || user?.primaryEmailAddress?.emailAddress}
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      {profile?.email ||
                        user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.createdAt
                        ? formatDate(user.createdAt.toString())
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Usage Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile?.total_sessions || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile?.active_sessions || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Documents
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile?.total_documents || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Chat Messages
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile?.total_documents
                        ? Math.floor(profile.total_documents * 2.5)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Personal Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Name:</span>
                <span className="text-sm text-gray-900">
                  {profile?.first_name || user?.firstName || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Name:</span>
                <span className="text-sm text-gray-900">
                  {profile?.last_name || user?.lastName || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Full Name:</span>
                <span className="text-sm text-gray-900">
                  {profile?.full_name || user?.fullName || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Account Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User ID:</span>
                <span className="text-sm text-gray-900 font-mono">
                  {profile?.user_id || user?.id || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Verified:</span>
                <span className="text-sm text-gray-900">
                  {user?.emailAddresses?.[0]?.verification?.status ===
                    "verified"
                    ? "Yes"
                    : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Status:</span>
                <span className="text-sm text-green-600 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tips for Better Usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Optimize Your Sessions
              </h4>
              <p className="text-sm text-gray-600">
                Create separate sessions for different topics to get more
                relevant answers.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Upload Quality Documents
              </h4>
              <p className="text-sm text-gray-600">
                Use clear, well-formatted PDFs for better AI understanding and
                responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
