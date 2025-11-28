import { useState } from "react"
import { useLocation } from "react-router-dom"
import { formatDateTime, NO_DATA_MATCHED } from "../../../controller/Variables.js"
import RegisReqDetail from "./RegisReqDetail.js"

import { BiSolidUserDetail } from "../../../../public/Icons.js"
import './RegisReq_m.css'
import '../../../../public/styles/common.css'

const RegisReq_m = ({data=[], onUpdate}: RegisReqProps) => {
    const location = useLocation()
    const [ selectedRequest, setSelectedRequest ] = useState<any>([]);
    const [ showDetail, setShowDetail ] = useState(false)
    const isOnAdminDash = location.pathname.includes('admin-dashboard');

    const triggerSelectedDetail = (request:any) => {
        setSelectedRequest(request)
        setShowDetail(true)
    }

    function triggerCloseDetail(){
        setShowDetail(false)
        setSelectedRequest([])
    }

    if(data.length === 0) return (
        <div className="App-mobile-responsive-table">
            <b>{NO_DATA_MATCHED}</b>
        </div>
    )

    return(
        <>
        <div className={`${isOnAdminDash ? 'set-visible' : 'App-mobile-responsive-table'}`}>
            {data.map((request:any) => (
            <div key={request.registrationID}>
                <div className="App-mobile-responsive-table-card">
                    <div className="App-mobile-responsive-table-card-title">
                        <h2>
                            {request.bizName}
                        </h2>
                        <div className="App-mobile-table-icon" 
                            onClick={() => {
                                triggerSelectedDetail(request)
                            }}>
                            <BiSolidUserDetail />
                        </div>
                    </div>
                    <div className="App-mobile-responsive-table-card-data">
                        <div className="App-mobile-responsive-table-card-data-detail uen">
                            <p className="App-mobile-responsive-table-card-data-title">
                                UEN
                            </p>
                            <p>{request.UEN}</p>
                        </div>

                        <div className="App-mobile-responsive-table-card-data-detail status">
                            <p className="App-mobile-responsive-table-card-data-title">
                                Status
                            </p>
                            <p>{request.status}</p>
                        </div>

                        <div className="App-mobile-responsive-table-card-data-detail registered">
                            <p className="App-mobile-responsive-table-card-data-title">
                                Registered On
                            </p>
                            <p>{formatDateTime(request.createdAt)}</p>
                        </div>
                    </div>
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
    )
}

interface RegisReqProps {
    data?: any;
    onUpdate?: (updatedData: any) => void
}

export default RegisReq_m;