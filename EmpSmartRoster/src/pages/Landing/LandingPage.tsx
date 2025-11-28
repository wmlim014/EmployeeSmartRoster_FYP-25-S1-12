import "./LandingPage.css"
import NavBar from "./LandingNavBar";
import Title from "./Title";
import Video from "./Video";
import Reviews from "./Review";
import FAQ from "./FAQ";
import SubscriptionPlans from "./SubscriptionPlan";

export default function LandingPage() {
  return (
    <div className="landingPage">
      <NavBar />

      <div id="title"><Title /></div>
      <div id="video"><Video /></div>
      <div id="subscription"><SubscriptionPlans /></div>
      <div id="reviews"><Reviews /></div>
      <div id="faq"><FAQ /></div>
    </div>
  );
}



  // refer to /Users/hongweiteo/Documents/GitHub/testEmployeeSmartRoster/Employee-Smart-Roster-main/Employee-Smart-Roster-main/fireJetReact/src/SA_components/Registration_Request/RegisReqDetail.tsx
  