import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Copy,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Globe,
} from "lucide-react";
import Nav from "@/components/Nav";
import { useUserContext } from "@/context/userContext";

export default function Home() {
  const [password, setPassword] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [, setIsPasswordCorrect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { apiData } = useUserContext();

  let publicKey = "Loading...";

  if (apiData && apiData.public_key) {
    publicKey = apiData.public_key;
  }

  const secretKey =
    "sk_live_51H7xJcK2VzQRHzpLfNrI9mZxKzEwY2VzQRHzpLfNrI9mZxKzEwY2VzQ";
  const correctPassword = "admin123";

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsPasswordCorrect(true);
      setShowSecretKey(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const copyToClipboard = (text: string, keyType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyType);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <Nav />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-800">
                Secure API Management
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Manage Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                API Keys
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Securely store and manage your API credentials with
              enterprise-grade security. Access your public keys instantly and
              protect your secrets with password authentication.
            </p>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Public Key Card */}
          <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center text-green-800">
                <Globe className="w-5 h-5 mr-2" />
                Public Key
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                  Safe to Share
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Client-side usage allowed</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No sensitive operations</span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <code className="text-sm text-green-800 font-mono break-all">
                      {publicKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(publicKey, "public")}
                      className="ml-2 flex-shrink-0 border-green-200 hover:bg-green-100"
                    >
                      {copiedKey === "public" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secret Key Card */}
          <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
              <CardTitle className="flex items-center text-red-800">
                <Shield className="w-5 h-5 mr-2" />
                Secret Key
                <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-200">
                  Confidential
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!showSecretKey ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Server-side only</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Full API access</span>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Enter your password to view the secret key
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 border-red-200 focus:border-red-400"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {passwordError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {passwordError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handlePasswordSubmit}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock Secret Key
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Successfully authenticated</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <code className="text-sm text-red-800 font-mono break-all">
                      {secretKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(secretKey, "secret")}
                      className="ml-2 flex-shrink-0 border-red-200 hover:bg-red-100"
                    >
                      {copiedKey === "secret" ? (
                        <CheckCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSecretKey(false);
                      setIsPasswordCorrect(false);
                      setPassword("");
                    }}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Hide Secret Key
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Alert className="border-indigo-200 bg-indigo-50">
            <Shield className="w-4 h-4 text-indigo-600" />
            <AlertDescription className="text-indigo-800">
              <strong>Security Best Practices:</strong> Never share your secret
              key or include it in client-side code. Always use your public key
              for frontend applications and secret key only for server-side
              operations.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
