import { useLogout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/userContext";
import {
  Menu,
  X,
  Home,
  Settings,
  Key,
  Zap,
  LogOut,
  Crown,
  ArrowRight,
  Image,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { apiData } = useUserContext();

  const { mutate } = useLogout();

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success("Logged in successfully!");
  };

  const handleLogout = () => {
    mutate();
  };

  const handleUpgrade = () => {
    console.log("Coming soon");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <Link to={"/"}>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CloudAPI
                </h1>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button
                onClick={() => toast.success("Coming soon")}
                variant="ghost"
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Link to={"/"}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  API Keys
                </Button>
              </Link>
              <Link to={"/profile"}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to={"/my-images"}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Image className="w-4 h-4 mr-2" />
                  My-images
                </Button>
              </Link>
              <Link to={"/upload"}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {apiData?.account_type !== "standard" ? (
                  <Link to={"/subscription"}>
                    <Button
                      onClick={handleUpgrade}
                      className="relative group overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 text-white font-semibold px-8 py-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-gray-900/25 border border-gray-700 hover:border-gray-600"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center gap-3">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg">Upgrade</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                ) : null}

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    Login
                  </Button>
                </Link>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleNav}>
              {isNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isNavOpen && (
          <div className="md:hidden border-t border-indigo-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button
                onClick={() => toast.success("Coming soon")}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>

              <Link to={"/"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  API Keys
                </Button>
              </Link>
              <Link to={"/profile"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to={"/my-images"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  My-images
                </Button>
              </Link>
              <Link to={"/upload"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="pt-2 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link to={"/subscription"}>
                      <Button
                        variant="secondary"
                        className="w-full mb-3 justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        Upgrade
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button
                        onClick={handleLogin}
                        variant="outline"
                        className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        Login
                      </Button>
                    </Link>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
