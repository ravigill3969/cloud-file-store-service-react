import { CheckCircle, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

// import { useVerifySession } from "@/api/stripe";

function Success() {
  const navigate = useNavigate();
  // const { mutate } = useVerifySession();

  useEffect(() => {
    // const sessionId = new URLSearchParams(window.location.search).get(
    //   "session_id"
    // );

    // if (!sessionId) {
    //   navigate("/");
    //   return;
    // }

    // if (sessionId) {
    //   mutate(sessionId);
    // }

    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-green-600">
            Your subscription has been activated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Thank you for your purchase. You should receive a confirmation email
            shortly.
          </p>
          <div className="flex flex-col gap-2">
            <Link to={"/"}>
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Success;
