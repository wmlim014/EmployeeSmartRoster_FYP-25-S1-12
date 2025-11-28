import "./SubscriptionPlans.css";
import subscriptionIcon from "./subscriptionPlan.png";

interface SubscriptionPlansProps {
  className?: string;
}

export default function SubscriptionPlans({ className = "" }: SubscriptionPlansProps) {
  return (
    <div className={`subscription-plans-container ${className}`}>
      <div className="subscription-plans-header">
        <img className="subscription-icon" src={subscriptionIcon} alt="Subscription Icon" />
        <div className="subscription-title">Subscription Plans</div>
      </div>

      <div className="subscription-table-container">
        <table className="subscription-table">
          <thead>
            <tr>
              <th>Starter Plan</th>
              <th>Basic Plan</th>
              <th>Advanced Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free for up to 2 users</td>
              <td>For small teams up to 20 users</td>
              <td>$20 for the first 20 users, $3 per user thereafter</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
