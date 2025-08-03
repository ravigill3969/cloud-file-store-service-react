import { useEffect, useState } from "react";
import {
  Check,
  Star,
  Zap,
  Building,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useCreateStripeSession } from "@/api/stripe";
import { useUserContext } from "@/context/userContext";
import Nav from "@/components/Nav";

function Subscription() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate } = useCreateStripeSession();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        "100 GET API calls",
        "10 Edit API calls",
        "100 POST API calls",
        "Community support",
      ],
      buttonText: "Get Started",
      buttonStyle:
        "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300",
      popular: false,
      accentColor: "slate",
    },
    {
      name: "Premium",
      price: "$29",
      period: "/month",
      description: "5x the power with advanced features",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "500 GET API calls",
        "50 Edit API calls",
        "500 POST API calls",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      buttonText: "Start Premium",
      buttonStyle:
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
      popular: true,
      accentColor: "purple",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "/contact",
      description: "Unlimited power for organizations",
      icon: <Building className="w-6 h-6" />,
      features: [
        "Unlimited API calls",
        "Dedicated support",
        "Custom SLA",
        "On-premise deployment",
        "Advanced security",
        "Account manager",
      ],
      buttonText: "Contact Sales",
      buttonStyle:
        "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white",
      popular: false,
      accentColor: "emerald",
    },
  ];

  const { apiData } = useUserContext();

  useEffect(() => {
    if (apiData && apiData.account_type === "standard") {
      navigate("/");
    }
  });

  const handlePlanSelect = async (planName: string) => {
    if (planName === "Premium") {
      setIsLoading(true);
      try {
        mutate();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAccentClasses = (color: string) => {
    switch (color) {
      case "slate":
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: "bg-slate-100 text-slate-600",
          check: "bg-slate-100 text-slate-600",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200 ring-2 ring-purple-500/20",
          icon: "bg-purple-100 text-purple-600",
          check: "bg-purple-100 text-purple-600",
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: "bg-emerald-100 text-emerald-600",
          check: "bg-emerald-100 text-emerald-600",
        };
      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: "bg-slate-100 text-slate-600",
          check: "bg-slate-100 text-slate-600",
        };
    }
  };

  return (
    <>
      <Nav />
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col">
        {/* Header - Compact */}
        <div className="text-center pt-8 pb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Scale your API usage with plans designed for every stage of your
            journey
          </p>
        </div>

        {/* Pricing Cards - Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const accent = getAccentClasses(plan.accentColor);

                return (
                  <div
                    key={plan.name}
                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                      plan.popular
                        ? accent.border
                        : "border-slate-200 hover:border-slate-300"
                    } ${hoveredPlan === index ? "z-10" : ""}`}
                    onMouseEnter={() => setHoveredPlan(index)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Background Accent */}
                    <div
                      className={`absolute inset-0 ${accent.bg} opacity-40 rounded-2xl`}
                    />

                    <div className="relative p-6">
                      {/* Icon & Name */}
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${accent.icon}`}
                        >
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {plan.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-slate-900">
                            {plan.price}
                          </span>
                          <span className="text-slate-500 ml-1 text-sm">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div
                              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${accent.check}`}
                            >
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className="text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {plan.buttonText === "Get Started" ? (
                        <Link to={"/"} className="block">
                          <button
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${plan.buttonStyle}`}
                          >
                            <span className="flex items-center justify-center space-x-1">
                              <span>{plan.buttonText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handlePlanSelect(plan.name)}
                          disabled={isLoading}
                          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonStyle}`}
                        >
                          {isLoading && plan.name === "Premium" ? (
                            <span className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Loading...</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center space-x-1">
                              <span>{plan.buttonText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA - Compact */}
        <div className="text-center pb-8 pt-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Need something different?
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Get in touch with our team for custom solutions and enterprise
              pricing.
            </p>
            <button className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm">
              <span className="flex items-center justify-center space-x-1">
                <span>Talk to Sales</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscription;
