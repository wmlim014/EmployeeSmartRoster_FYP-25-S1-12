import React, { useEffect, useState } from "react";
import "./FAQ.css";
import LandingPageController from "../../controller/LandingPageController";

interface FAQItem {
  faqID: number;
  question: string;
  answer: string;
  createdOn: string;
}

const FAQSection: React.FC = () => {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  console.log("Test FAQ: ",faqData)

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        // call the controller
        const result = await LandingPageController.getFAQ();
        // normalize: if result.FAQList exists, use that, otherwise assume it's already the mapped array
        const list: any[] = (result as any).FAQList ?? (result as any);
        // if they came in API shape, map now; if already mapped, just cast
        const mapped: FAQItem[] = (list[0] && (list[0] as any).question_desc)
          ? // raw API items: filter isShown and map
            (list as any[])
              .filter(faq => faq.isShown === 1)
              .map(faq => ({
                faqID: faq.faqID,
                question: faq.question_desc,
                answer: faq.answer,
                createdOn: new Date(faq.createdOn).toLocaleDateString(),
              }))
          : // already-mapped shape
            (list as FAQItem[]);
        setFaqData(mapped);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchFAQ();
  }, []);

  return (
    <div className="faq-section">
      <h1 className="faq-heading">Frequently Asked Questions</h1>
      {faqData.length > 0 ? (
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div
              key={faq.faqID}
              className="faq-item fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
              <p className="faq-date">
                <i>Posted on {faq.createdOn}</i>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-faq">No FAQs available at the moment.</p>
      )}
    </div>
  );
};

export default FAQSection;
