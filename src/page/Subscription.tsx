import { useEffect, useState } from "react";
import {
  Check,
  Star,
  Zap,
  Building,
  Crown,
  Sparkles,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useCreateStripeSession } from "@/api/stripe";
import { useUserContext } from "@/context/userContext";

function Subscription() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const navigate = useNavigate();

  const { mutate } = useCreateStripeSession();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      icon: <Sparkles className="w-8 h-8" />,
      features: [
        "100 GET API calls",
        "10 Edit API calls",
        "100 POST API calls",
        "Basic support",
        "API documentation",
        "Community access",
      ],
      buttonText: "Get Started",
      buttonStyle:
        "bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300",
      popular: false,
      gradient: "from-gray-50 to-gray-100",
    },
    {
      name: "Premium",
      price: "$29",
      period: "/month",
      description: "5x the power of Free plan",
      icon: <Crown className="w-8 h-8" />,
      features: [
        "500 GET API calls",
        "50 Edit API calls",
        "500 POST API calls",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Team collaboration",
        "API rate limiting",
      ],
      buttonText: "Start Premium",
      buttonStyle:
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105",
      popular: true,
      gradient: "from-purple-50 to-blue-50",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "/month",
      description: "Unlimited power for your organization",
      icon: <Building className="w-8 h-8" />,
      features: [
        "Unlimited API calls",
        "Dedicated support",
        "Custom SLA",
        "On-premise deployment",
        "Advanced security",
        "Custom integrations",
        "Training & onboarding",
        "Account manager",
      ],
      buttonText: "Contact Sales",
      buttonStyle:
        "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transform hover:scale-105",
      popular: false,
      gradient: "from-emerald-50 to-teal-50",
    },
  ];

  const { apiData } = useUserContext();

  useEffect(() => {
    if (apiData && apiData.account_type === "standard") {
      navigate("/");
    }
  });

  const handlePlanSelect = (planName: string) => {
    if (planName === "Premium") {
      mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Power
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scale your API usage with plans designed for every stage of your
            journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? "border-purple-500 ring-4 ring-purple-500/20"
                  : "border-gray-200 hover:border-gray-300"
              } ${hoveredPlan === index ? "z-10" : ""}`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50 rounded-2xl`}
              />

              <div className="relative p-8">
                {/* Mobile Layout */}
                <div className="lg:hidden">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      plan.name === "Free"
                        ? "bg-gray-100 text-gray-600"
                        : plan.name === "Premium"
                        ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600"
                        : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600"
                    }`}
                  >
                    <div className="w-6 h-6">{plan.icon}</div>
                  </div>

                  {/* Plan Name and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {plan.price}
                      </div>
                      <div className="text-sm text-gray-500">{plan.period}</div>
                    </div>
                  </div>

                  {/* More Info Button */}
                  <button
                    onClick={() =>
                      setSelectedPlan(selectedPlan === index ? null : index)
                    }
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all duration-200 mb-4"
                  >
                    <Info className="w-4 h-4" />
                    <span className="font-medium">
                      {selectedPlan === index ? "Hide Details" : "More Info"}
                    </span>
                  </button>

                  {/* Expandable Details */}
                  {selectedPlan === index && (
                    <div className="space-y-4 mb-6">
                      <p className="text-gray-600">{plan.description}</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-2"
                          >
                            <div
                              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                                plan.name === "Free"
                                  ? "bg-gray-100"
                                  : plan.name === "Premium"
                                  ? "bg-purple-100"
                                  : "bg-emerald-100"
                              }`}
                            >
                              <Check
                                className={`w-2.5 h-2.5 ${
                                  plan.name === "Free"
                                    ? "text-gray-600"
                                    : plan.name === "Premium"
                                    ? "text-purple-600"
                                    : "text-emerald-600"
                                }`}
                              />
                            </div>
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  {plan.buttonText === "Get Started" ? (
                    <Link to={"/"}>
                      <button
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                      >
                        {plan.buttonText}
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect(plan.name)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                      plan.name === "Free"
                        ? "bg-gray-100 text-gray-600"
                        : plan.name === "Premium"
                        ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600"
                        : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600"
                    }`}
                  >
                    {plan.icon}
                  </div>

                  {/* Plan Details */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.name === "Free"
                              ? "bg-gray-100"
                              : plan.name === "Premium"
                              ? "bg-purple-100"
                              : "bg-emerald-100"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              plan.name === "Free"
                                ? "text-gray-600"
                                : plan.name === "Premium"
                                ? "text-purple-600"
                                : "text-emerald-600"
                            }`}
                          />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.buttonText === "Get Started" ? (
                    <Link to={"/"}>
                      <button
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.buttonStyle}`}
                      >
                        {plan.buttonText}
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect(plan.name)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need something different?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help you find the perfect plan for your needs. Get
              in touch with our team for custom solutions.
            </p>
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
