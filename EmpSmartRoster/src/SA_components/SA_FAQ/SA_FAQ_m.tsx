import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { IoClose, IoIosWarning } from "../../../public/Icons.js";
import { BiSolidUserDetail } from "../../../public/Icons.js";
import './SA_FAQ_m.css';
import '../../../public/styles/common.css';
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton";
import { updateFAQ, deleteFAQ } from "../../controller/NotUsed/FAQController.js";

interface FAQProps {
  data?: any[];
  onUpdate?: (updatedData: any) => void;
}

// New date formatter that includes time
const formatDate = (isoDate: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(isoDate).toLocaleString('en-US', options);
};

const SA_FAQ_m = ({ data = [], onUpdate }: FAQProps) => {
  const location = useLocation();
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  const triggerSelectedDetail = (faq: any) => {
    setSelectedFAQ(faq);
    setEditedQuestion(faq.question_desc);
    setEditedAnswer(faq.answer);
    setShowDetail(true);
    setIsEditing(false);
    setIsDeletePromptOpen(false);
  };

  const triggerCloseDetail = () => {
    setShowDetail(false);
    setSelectedFAQ(null);
    setIsEditing(false);
    setIsDeletePromptOpen(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedFAQ) return;
    try {
      await updateFAQ(
        selectedFAQ.faqID,
        editedQuestion,
        editedAnswer,
        selectedFAQ.isShown,
        selectedFAQ.createdOn
      );
      if (onUpdate) onUpdate(selectedFAQ);
      triggerCloseDetail();
    } catch (err) {
      console.error("Failed to update FAQ", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuestion(selectedFAQ?.question_desc || "");
    setEditedAnswer(selectedFAQ?.answer || "");
  };

  const confirmDeleteFAQ = async () => {
    if (!selectedFAQ) return;
    try {
      await deleteFAQ(selectedFAQ.faqID);
      if (onUpdate) onUpdate(selectedFAQ);
      triggerCloseDetail();
    } catch (err) {
      console.error("Failed to delete FAQ", err);
    }
  };

  const cancelDeleteFAQ = () => {
    setIsDeletePromptOpen(false);
  };

  if (data.length === 0) {
    return (
      <div className="App-mobile-responsive-table">
        <b>No FAQs found</b>
      </div>
    );
  }

  return (
    <div className="App-mobile-responsive-table">
      {data.map((faq: any) => (
        <div key={faq.faqID} className="App-mobile-responsive-table-card">
          <div className="App-mobile-responsive-table-card-title">
            <h2>{faq.question_desc}</h2>
            <div
              className="App-mobile-table-icon"
              onClick={() => triggerSelectedDetail(faq)}
            >
              <BiSolidUserDetail />
            </div>
          </div>
          <div className="App-mobile-responsive-table-card-data">
            <div className="App-mobile-responsive-table-card-data-detail">
              <p className="App-mobile-responsive-table-card-data-title">
                Answer
              </p>
              <p>{faq.answer}</p>
            </div>
            <div className="App-mobile-responsive-table-card-data-detail">
              <p className="App-mobile-responsive-table-card-data-title">
                Created On
              </p>
              <p>{faq.createdOn ? formatDate(faq.createdOn) : 'N/A'}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Popup Modal to Show FAQ Details */}
      {showDetail && selectedFAQ && (
        <div className="App-popup">
          <div className="App-popup-content">
            <div className="App-header">
              <h1>FAQ Details</h1>
              <button className="icons" onClick={triggerCloseDetail}>
                <IoClose />
              </button>
            </div>
            {!isEditing ? (
              <div className="faq-detail-mobile-content">
                <p><strong>Question:</strong> {selectedFAQ.question_desc}</p>
                <p><strong>Answer:</strong> {selectedFAQ.answer}</p>
                <p>
                  <strong>Created On:</strong> {selectedFAQ.createdOn ? formatDate(selectedFAQ.createdOn) : "N/A"}
                </p>
                <div className="btns-grp">
                  <PrimaryButton text="Edit Details" onClick={handleEditClick} />
                  <SecondaryButton text="Delete FAQ" onClick={() => setIsDeletePromptOpen(true)} />
                </div>
              </div>
            ) : (
              <div className="faq-detail-mobile-content">
                <label>
                  <p><strong>Question:</strong></p>
                  <input
                    type="text"
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                  />
                </label>
                <label>
                  <p><strong>Answer:</strong></p>
                  <input
                    type="text"
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                  />
                </label>
                <div className="btns-grp">
                  <PrimaryButton text="Save Changes" onClick={handleSaveChanges} />
                  <SecondaryButton text="Cancel" onClick={handleCancelEdit} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {isDeletePromptOpen && selectedFAQ && (
        <div className="App-popup">
          <div className="App-popup-content faq-delete-prompt">
            <div className="App-header">
              <label className="faq-popup-warning-icon">
                <IoIosWarning />
              </label>
              <h2>Delete FAQ?</h2>
              <button className="icons" onClick={cancelDeleteFAQ}>
                <IoClose />
              </button>
            </div>
            <div className="faq-popup-delete-content">
              <p>Are you sure you want to delete this FAQ?</p>
            </div>
            <div className="btns-grp">
              <PrimaryButton text="Delete" onClick={confirmDeleteFAQ} />
              <SecondaryButton text="Cancel" onClick={cancelDeleteFAQ} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SA_FAQ_m;
