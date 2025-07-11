import { Button } from "@/components/ui/button";
import { Menu, X, Home, Settings, Key, Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CloudAPI
              </h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button
                onClick={() => toast.success("coming soon")}
                variant="ghost"
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => toast.success("coming soon")}
                variant="ghost"
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button
                onClick={() => toast.success("coming soon")}
                variant="ghost"
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link to={"/login"}>
              <Button
                variant="outline"
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                Login
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
              Get Started
            </Button>
          </div>

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

        {isNavOpen && (
          <div className="md:hidden border-t border-indigo-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>

              <div className="pt-2 space-y-2">
                <Link to={"/login"}>
                  <Button
                    variant="outline"
                    className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    Login
                  </Button>
                </Link>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
