import { useState, useEffect } from 'react';
import { BiSolidUserDetail } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import "./DashBody.css";
import GetTheJobsData from '../../controller/BOJobsController';
import '../../../public/styles/common.css'


// Access the function from the default export
const { GetAllJobsData } = GetTheJobsData;

const DashBody = () => {

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);

    function getTheJobsData(){
        return GetAllJobsData();
    }    


    const handleDetailClick = (request: any) => {
    setSelectedRequest(request);
    setShowDetail(true);
    };

    const handleClosePopup = () => {
    setSelectedRequest(null);
    setShowDetail(false);
    };

  return (
    <div className="swap-requests">
      <div>
        <h1>
            NEEDS REVIEW <span className="badge">{getTheJobsData().length}</span>
        </h1>
      </div>

      {getTheJobsData().map((request) => (
        <div className="swap-card" key={request.date}>
          {/* Card Header */}
          <div className="swap-card-header">
            <h3>{request.fullName}</h3>
            <button className="request-detail-detail-table"
                onClick={() => handleDetailClick(request)}>
              <BiSolidUserDetail />
            </button>
          </div>

          {/* Card Body */}
          <div className="swap-card-body">
            <p>
              <strong>Date:</strong> {request.date}
            </p>
            <p>
              <strong>Type:</strong> {request.type}
            </p>
          </div>
        </div>
      ))}

      {/* Popup Modal */}
      {showDetail && selectedRequest && (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={handleClosePopup}><IoClose /></button>
                <h2 className="App-header">Review Details</h2>
                
                <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{selectedRequest.date}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedRequest.fullName}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{selectedRequest.type}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{selectedRequest.description}</span>
                </div>
            </div>
        </div>
    )}
    </div>
  );
}

export default DashBody;
