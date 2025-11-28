import React, { useEffect, useState } from "react";
import LandingPageController from "../../controller/LandingPageController";
import { FaRegCreditCard, FaCheck, FaMinus } from "react-icons/fa";
import { HiMinus } from 'react-icons/hi';




import "./SubscriptionPlan.css";

interface SubscriptionPlan {
  subsPlanID: number;
  subscription_name: string;
  subscription_plan_description: string;
  price: number;
}

// Our current features from competitor analysis table
const features: string[] = [
  "Export Schedules",
  "Clock in / Clock out",
  "Generate timesheet",
  "Shift swapping request",
  "Labour cost analysis",
  "Metrics",
  "Automatic data encryption",
  "Access control",
  "Multi language",
  "Leave management",
  "Leave report",
  "Analysis report",
  "Leave submission notification",
  "Claim notification",
  "Task tracking",
  "Set custom role and skillset"
];

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await LandingPageController.getSubscriptionPlan();
      setPlans(data);
    };

    fetchPlans();
  }, []);

  return (
    <div className="subscription-plans">
      <h2>Our Subscription Plans</h2>
      <div className="plans-list">
      {plans.map((plan) => (
  <div key={plan.subsPlanID} className="plan-card">
    <div className="plan-icon">
      <FaRegCreditCard />
    </div>
    <h3>{plan.subscription_name}</h3>
    <p>{plan.subscription_plan_description}</p>
    <p className="plan-price">Price: ${plan.price}</p>
    <div className="divider-icon"><HiMinus /></div>
    <table>
      <tbody>
        {features.map((feature, idx) => (
          <tr key={idx}>
            <td><FaCheck /></td>
            <td>{feature}</td>
          </tr>
        ))}

        
        {plan.subscription_name === "Free" && (
          <tr>
            <td></td>
            <td><em>Limited to 5 Employees</em></td>
          </tr>
        )}

        
        {plan.subscription_name === "Premium Plan" && (
          <tr>
            <td><FaCheck /></td>
            <td><em>Unlimited Employees</em></td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
))}

      </div>
    </div>
  );
};

export default SubscriptionPlans;
