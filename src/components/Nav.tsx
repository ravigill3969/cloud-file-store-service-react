import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, Settings, Mail } from 'lucide-react';

export default function Nav() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Brand</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <User className="w-4 h-4 mr-2" />
                About
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <Settings className="w-4 h-4 mr-2" />
                Services
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <User className="w-4 h-4 mr-2" />
                About
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <Settings className="w-4 h-4 mr-2" />
                Services
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full text-gray-700 border-gray-300 hover:bg-gray-50">
                  Login
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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