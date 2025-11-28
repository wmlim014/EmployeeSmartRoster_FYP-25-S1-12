import { useState } from "react";
import { BiSolidUserDetail } from "../../../../public/Icons.js";
import { formatDateTime } from "../../../controller/Variables.js"
import Header from "../../../components/table/Header";
import Cell from "../../../components/table/Cell";
import RegisReqDetail from "./RegisReqDetail";
import "./RegisReq.css";
import "../../../../public/styles/common.css";

// Access the function from the default export

const RegisReq = ({data=[], onUpdate}: RegisReqProps) => {
    const [ selectedRequest, setSelectedRequest ] = useState<any>([]);
    const [ showDetail, setShowDetail ] = useState(false)
    
    const triggerSelectedDetail = (request:any) => {
        setSelectedRequest(request)
        setShowDetail(true)
    }

    function triggerCloseDetail(){
        setShowDetail(false)
        setSelectedRequest([])
    }

    if(data.length === 0) return (
        <div className="App-desktop-responsive-table">
            <b>No Data Match with Filter...</b>
        </div>
    )

    return (
        <>
        <div className="App-desktop-responsive-table">
            <div className="App-desktop-table-row desktop-table-header">
                <Header className='header-uen' text='UEN' />
                <Header className='header-company-name' text='COMPANY NAME' />
                <Header className='header-status' text='STATUS' />
                <Header className='header-reg-date' text='REGISTERED DATE' />
                <Header className='App-header-icon-gap' text=''/>
            </div>
            {data.map((request:any) => (
            <div className='App-desktop-table-row regis-req-row' key={request.registrationID}>
                <Cell className='body-uen' text={request.UEN} />
                <Cell className='body-company-name' text={request.bizName} />
                <Cell className='body-status' text={request.status} />
                <Cell className='body-reg-date' text={formatDateTime(request.createdAt)} />
                <div 
                    className="App-desktop-table-icon" 
                    onClick={() => {
                        triggerSelectedDetail(request)
                    }}>
                    <BiSolidUserDetail />
                </div>
            </div>
            ))}
        </div>
        {showDetail && selectedRequest && (
            <div className="App-popup" onClick={triggerCloseDetail}>
                <RegisReqDetail 
                    regisRequest= {selectedRequest}
                    onClose={() => { triggerCloseDetail() }}
                    onUpdate={onUpdate}
                />
            </div>
        )}
        </>
    );
  };

interface RegisReqProps {
    data?: any;
    onUpdate?: (updatedData: any) => void
}
  
  export default RegisReq;