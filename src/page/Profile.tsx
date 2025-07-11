import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Edit3,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  Eye,
  EyeOff,
  Calendar,
  Activity,
  Crown,
} from "lucide-react";
import Nav from "@/components/Nav";
import type { GETUserData } from "@/api/APItypes";
import { useGetUserInfo } from "@/api/auth";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User data (mock data based on the schema)
  const [userData, setUserData] = useState<GETUserData | undefined>();

  const { data } = useGetUserInfo();

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (data && data.data.length === 1) {
      setUserData(data.data[0]);
      setProfileForm({
        email: data.data[0].email,
        username: data.data[0].email,
      });
    }
  }, [data]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [alerts, setAlerts] = useState({
    profile: null,
    password: null,
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleProfileUpdate = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));

    // Simulate API call
    setTimeout(() => {
      //   setAlerts((prev) => ({
      //     ...prev,
      //     profile: { type: "success", message: "Profile updated successfully!" },
      //   }));

      setLoading((prev) => ({ ...prev, profile: false }));

      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlerts((prev) => ({ ...prev, profile: null }));
      }, 3000);
    }, 1000);
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      //   setAlerts((prev) => ({
      //     ...prev,
      //     password: { type: "error", message: "New passwords do not match!" },
      //   }));
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      //   setAlerts((prev) => ({
      //     ...prev,
      //     password: {
      //       type: "error",
      //       message: "Password must be at least 8 characters long!",
      //     },
      //   }));
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));

    // Simulate API call
    setTimeout(() => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      //   setAlerts((prev) => ({
      //     ...prev,
      //     password: {
      //       type: "success",
      //       message: "Password updated successfully!",
      //     },
      //   }));

      setLoading((prev) => ({ ...prev, password: false }));

      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlerts((prev) => ({ ...prev, password: null }));
      }, 3000);
    }, 1000);
  };

  const getAccountTypeBadge = (type: string) => {
    const configs = {
      free: { color: "bg-gray-100 text-gray-800", icon: User },
      premium: { color: "bg-purple-100 text-purple-800", icon: Crown },
      enterprise: { color: "bg-gold-100 text-gold-800", icon: Crown },
    };

    const config = configs.free;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} capitalize`}>
        <Icon className="w-3 h-3 mr-1" />
        {type}
      </Badge>
    );
  };

  if (!userData) {
    return <div>wtf</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <Nav />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <User className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
              <p className="text-indigo-100 mb-3">{userData.email}</p>
              <div className="flex items-center space-x-4">
                {getAccountTypeBadge(userData.account_type)}
                <div className="flex items-center text-indigo-100">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    Member since {formatDate(userData.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </Button>
                  <Button
                    variant={activeTab === "password" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("password")}
                  >
                    <Lock className="w-4 h-4 mr-3" />
                    Password & Security
                  </Button>
                  <Button
                    variant={activeTab === "usage" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("usage")}
                  >
                    <Activity className="w-4 h-4 mr-3" />
                    API Usage
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-indigo-600" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {alerts.profile && (
                    <Alert
                      className={`mb-6 ${
                        alerts.profile === "success"
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      {alerts.profile === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <AlertDescription
                        className={
                          alerts.profile === "success"
                            ? "text-green-800"
                            : "text-red-800"
                        }
                      >
                        {alerts.profile}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                      </label>
                      <Input
                        value={userData.uuid}
                        disabled
                        className="bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="flex items-center h-10">
                        {getAccountTypeBadge(userData.account_type)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <Input
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleProfileUpdate}
                      disabled={loading.profile}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {loading.profile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "password" && (
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {alerts.password && (
                    <Alert
                      className={`mb-6 ${
                        alerts.password === "success"
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      {alerts.password === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <AlertDescription
                        className={
                          alerts.password === "success"
                            ? "text-green-800"
                            : "text-red-800"
                        }
                      >
                        {/* {alerts.password.message} */}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={loading.password}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                    >
                      {loading.password ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "usage" && (
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    API Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">
                          GET Requests
                        </span>
                        <Activity className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {userData.get_api_calls.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">
                          POST Requests
                        </span>
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {userData.post_api_calls.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-800">
                          EDIT Requests
                        </span>
                        <Activity className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {userData.edit_api_calls.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-indigo-800">
                        Total API Calls <strong>Left</strong>:{" "}
                        {(
                          userData.get_api_calls +
                          userData.post_api_calls +
                          userData.edit_api_calls
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
