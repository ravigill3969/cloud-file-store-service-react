import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Nav from "@/components/Nav";

const plans = [
  {
    title: "Free Tier",
    price: "$0",
    description: "Perfect for hobby projects and exploration.",
    features: [
      "100 POST API requests/month",
      "10 EDIT API requests/month",
      "1000 GET API requests/month",
      "No credit card required",
    ],
    buttonText: "Start for Free",
    featured: false,
  },
  {
    title: "Pro Tier",
    price: "$20/month",
    description: "For developers and teams scaling up.",
    features: [
      "500 POST API requests/month",
      "50 EDIT API requests/month",
      "5000 GET API requests/month",
      "Priority support",
      "API key rotation",
      "Monthly usage analytics",
    ],
    buttonText: "Upgrade to Pro",
    featured: true,
  },
  {
    title: "Enterprise Tier",
    price: "Custom Pricing",
    description: "Custom solutions for large-scale businesses.",
    features: [
      "Scalable API limits",
      "Dedicated account manager",
      "SLA & 24/7 support",
      "Custom integrations",
      "SSO, audit logs, usage reports",
    ],
    buttonText: "Contact Us",
    featured: false,
    contactEmail: "enterprise@yourdomain.com",
  },
];

export default function SubscriptionPage() {
  return (
    <>
    <Nav />
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`rounded-2xl shadow-md transition hover:shadow-xl ${
              plan.featured ? "border-2 border-blue-500" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {plan.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <p className="text-2xl font-bold mt-2">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
              {plan.contactEmail ? (
                <a href={`mailto:${plan.contactEmail}`}>
                  <Button variant="outline" className="w-full">
                    {plan.buttonText}
                  </Button>
                </a>
              ) : (
                <Button className="w-full">{plan.buttonText}</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
