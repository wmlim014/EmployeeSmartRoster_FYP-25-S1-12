import './SA_FAQ.css';
import '../../../public/styles/common.css';
import React, { useState } from 'react';
import { FAQController, updateFAQ, addFAQ, deleteFAQ } from '../../../controller/NotUsed/FAQController';
import Header from "../../../components/table/Header";
import Cell from "../../../components/table/Cell";
import { IoClose, IoIosWarning } from '../../../../public/Icons.js';
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton/SecondaryButton";
import SA_FAQ_m from '../../../SA_components/SA_FAQ/SA_FAQ_m';

const FAQManagement = () => {
  const { faqs, loading, error, refetch } = FAQController();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<any>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");


  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);

  const openViewModal = (faq: any) => {
    setCurrentFAQ(faq);
    setEditedQuestion(faq.question_desc);
    setEditedAnswer(faq.answer);
    setIsEditing(false);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentFAQ(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!currentFAQ) return;
    try {
      const response = await updateFAQ(
        currentFAQ.faqID,
        editedQuestion,
        editedAnswer,
        currentFAQ.isShown,
        currentFAQ.createdOn
      );
      // console.log(response)
      
      refetch();
      closeViewModal();
    } catch (err) {
      console.error("Failed to update FAQ", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuestion(currentFAQ.question_desc);
    setEditedAnswer(currentFAQ.answer);
  };


  const confirmDeleteFAQ = async () => {
    if (!currentFAQ) return;
    try {
      const result = await deleteFAQ(currentFAQ.faqID);
      // console.log("FAQ deleted successfully:", result);
      refetch();
      setIsDeletePromptOpen(false);
      closeViewModal();
    } catch (err) {
      console.error("Failed to delete FAQ", err);
    }
  };

  const cancelDeleteFAQ = () => {
    setIsDeletePromptOpen(false);
  };

  const handleAddFAQ = async () => {
    try {
      const createdOn = new Date().toISOString();
      const result = await addFAQ(newQuestion, newAnswer, 1, createdOn);
      // console.log("FAQ added successfully:", result);
      refetch();
      setNewQuestion("");
      setNewAnswer("");
    } catch (err) {
      console.error("Failed to add FAQ:", err);
    }
  };

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


  const displayedFaqs = faqs.filter((faq: any) =>
    faq.question_desc.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="content">
      <h1 className="faq-logo">FAQ Management</h1>
      
      {/* Inline Add FAQ Section */}
      <div className="faq-add-section">
        <h2>Add New FAQ</h2>
        <div className="faq-add-form">
          <div className="faq-add-field">
            <label className="title-add-faq">Question:</label>
            <input
              type="text"
              className="faq-add-input"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question here..."
              required
            />
          </div>
          <div className="faq-add-field">
            <label className="title-add-faq">Answer:</label>
            <div className="faq-add-input-container">
              <input
                type="text"
                className="faq-add-input"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer here..."
                required
              />
            </div>
          </div>
          <div className="btns-grp">
            <PrimaryButton 
              text="Add FAQ" 
              onClick={handleAddFAQ} 
              disabled={ !newQuestion 
                         || !newAnswer
                        }
            />
          </div>
        </div>
      </div>

      <div className="faq-search-section">
          <input
              type="text"
              className="faq-search-input"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQs..."
          />
          {faqSearch && (
              <button 
                  className="faq-search-clear" 
                  onClick={() => setFaqSearch("")}
                  aria-label="Clear search"
              >
              <IoClose />
              </button>
          )}
      </div>
      
      {/* FAQ Listing Section */}
      <div className="main-contents">
        <div className="App-desktop-responsive-table">
          {faqs ? (
            <div>Loading FAQs...</div>
          ) : error ? (
            <div>Error loading FAQs: {(error as Error)?.message || 'Unknown error'}</div>
          ) : (
            <>
              <div className="App-desktop-table-row desktop-table-header">
                <Header className="header-faq-question" text="Question" />
                <Header className="header-faq-answer" text="Answer" />
                <Header className="App-header-icon-gap" text="" />
              </div>
                {displayedFaqs.map((faq: any) => (
              <div key={faq.faqID} className="App-desktop-table-row faq-table-body">
                  <Cell className="body-faq-question" text={faq.question_desc} />
                  <Cell className="body-faq-answer" text={faq.answer} />
                  <Cell
                  className="body-faq-action"
                  text={
                      <div className="faq-action-buttons">
                      <button className="primary-button" onClick={() => openViewModal(faq)}>
                          View Details
                      </button>
                      </div>
                  }
                  />
              </div>
                ))}
            </>
          )}
        </div>
      </div>
      {/* FAQ Listing Section for Mobile */}
      <div className="mobile-faq-container">
        <SA_FAQ_m data={displayedFaqs} onUpdate={refetch} />
      </div>

      {/* View Details Popup Modal */}
        {isViewModalOpen && currentFAQ && (
        <div className="App-popup">
          <div className="App-popup-content">
            <div className="App-header">
              <h1>FAQ Details</h1>
              <button className="icons" onClick={closeViewModal}>
                <IoClose />
              </button>
            </div>
            <div className="App-popup-main-content">
              {!isEditing ? (
                <div className="FAQ-Details">
                  <p className="title-faq-view-details">Question:</p>
                  <p className="main-data">{currentFAQ.question_desc}</p>
                  <p className="title-faq-view-details">Answer:</p>
                  <p className="main-data">{currentFAQ.answer}</p>
                  <p className="title-faq-view-details">Created On:</p>
                  <p className="main-data">
                    {currentFAQ.createdOn ? formatDate(currentFAQ.createdOn) : "N/A"}
                  </p>
                </div>
              ) : (
                <div className="faq-edit-detail-contents">
                  <label>
                    <p className="title-faq-edit-details-question">Question:</p>
                    <input
                      type="text"
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                    />
                  </label>
                  <label>
                    <p className="title-faq-edit-details-answer">Answer:</p>
                    <input
                      type="text"
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                    />
                  </label>
                </div>
              )}
              <div className="faq-modal-actions">
                {!isEditing ? (
                  <div className="btns-grp">
                    <PrimaryButton text="Edit Details" onClick={handleEditClick} />
                    <SecondaryButton text="Delete FAQ" onClick={() => setIsDeletePromptOpen(true)} />
                  </div>
                ) : (
                  <div className="btns-grp">
                    <PrimaryButton text="Save Changes" onClick={handleSaveChanges} />
                    <SecondaryButton text="Cancel" onClick={handleCancelEdit} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Prompt Modal */}
        {isDeletePromptOpen && currentFAQ && (
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
              <p>Are you sure to delete this FAQ?</p>
          </div>
          <div className="faq-modal-actions">
              <div className="btns-grp">
              <PrimaryButton text="Delete" onClick={confirmDeleteFAQ} />
              <SecondaryButton text="Cancel" onClick={cancelDeleteFAQ} />
              </div>
          </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default FAQManagement;
