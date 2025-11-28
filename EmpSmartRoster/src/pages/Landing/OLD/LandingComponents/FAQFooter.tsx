import "./FAQFooter.css";
import faqIcon from './faqIcon.png';

export default function FAQFooter({ className = "" }: FAQFooterProps) {
  return (
    <div className={`${className} faq-footer`}>
      <div className="faq-container">
        <img className="faq-icon" src={faqIcon} loading="lazy" alt="FAQ Icon" />
        <div className="faq-content">
          <div className="faq-title">Frequently Asked Questions:</div>
          <div className="faq-text">
            <p className="faq-question">1. Can EmpRoster be customized for different business needs?</p>
            <p>
              Yes, EmpRoster is flexible and can be tailored to suit different industries, shift structures, and employee roles, ensuring it meets your specific workforce management requirements.
            </p>
            <div className="faq-spacer"></div>
            <p className="faq-question">2. Is EmpRoster accessible on mobile devices?</p>
            <p>
              Yes, EmpRoster is fully responsive and can be accessed on any mobile device, allowing managers and employees to view schedules, make updates, and track attendance on the go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FAQFooterProps {
  className?: string;
}
