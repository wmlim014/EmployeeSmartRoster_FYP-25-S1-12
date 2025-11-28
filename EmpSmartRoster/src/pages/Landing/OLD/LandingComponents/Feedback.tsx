import "./Feedback.css";

export default function Feedback({
  className = "",
}: FeedbackProps) {
  return (
    <div className={`${className} feedback-feedback`}>
      <div className="feedback-container">
        <div className="feedback-item">
          <div className="feedback-content">
            <p className="feedback-text">James</p>
            <p className="feedback-subtext">(F&B Business Owner)</p>
            <p className="feedback-description">
              EmpRoster has greatly simplified scheduling for my business, ensuring smoother shift management and reducing conflicts among staff.
            </p>
            <p className="business-name">
              <span className="business-name-text">Bishan Bites Bistro</span>, <span className="industry-name">F&B Business</span>
            </p>
          </div>
        </div>

        <div className="feedback-item">
          <div className="feedback-content">
            <p className="feedback-text">Bailey Tan</p>
            <p className="feedback-subtext">(Logistics Company)</p>
            <p className="feedback-description">
              EmpRoster helps us efficiently manage employee shifts and workload distribution, improving operational efficiency and minimizing scheduling errors.
            </p>
            <p className="business-name">
              <span className="business-name-text">SwiftLink Transport</span>, <span className="industry-name">Logistics Company</span>
            </p>
          </div>
        </div>

        <div className="feedback-item">
          <div className="feedback-content">
            <p className="feedback-text">Daniel Wong</p>
            <p className="feedback-subtext">(Healthcare Facility Manager)</p>
            <p className="feedback-description">
              EmpRoster has streamlined our staff scheduling, ensuring optimal shift coverage and reducing last-minute changes. It’s an essential tool for our workforce management.
            </p>
            <p className="business-name">
              <span className="business-name-text">WellnessCare Clinic</span>, <span className="industry-name">Healthcare Facility</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeedbackProps {
  className?: string;
}
