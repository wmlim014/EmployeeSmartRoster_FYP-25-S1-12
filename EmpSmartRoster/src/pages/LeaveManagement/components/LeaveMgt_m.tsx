import { useState } from 'react'
import { useLocation } from "react-router-dom"

import { USER_ROLE, generateSGDateTimeForDateTimeInput, formatDateTime, formatTextForDisplay } from '../../../controller/Variables'
import LeaveDetail from './LeaveDetail'

import { FaRegListAlt } from '../../../../public/Icons.js'
import '../LeaveManagement.css'
import '../../../../public/styles/common.css'

interface LeaveMgtTableProps {
    leaves: any;
    user: any;
    onUpdateLeave: (updatedLeave: any) => void
}

const LeaveMgt_m = ({leaves = [], user, onUpdateLeave}: LeaveMgtTableProps) => {
    const location = useLocation()
    const isOnBODash = location.pathname.includes('business-dashboard');
    const [ showDetail, setShowDetail ] = useState(false)
    const [ selectedLeave, setSelectedLeave ] = useState<any>({})
    
    function toggleShowLeaveDetail (leave: any) {
        setSelectedLeave(leave);
        setShowDetail(!showDetail);
    };

    return(
        <>
        <div className={`${isOnBODash ? 'set-visible' : 'App-mobile-responsive-table'}`}>
            {leaves.map((leave: any) => (
            <div key={leave.leaveID} className="App-mobile-responsive-table-card">
                <div className="App-mobile-responsive-table-card-title">
                {user.role === USER_ROLE[1] && <h2>{leave.fullName}</h2>}
                {user.role === USER_ROLE[2] && <h2>{leave.type}</h2>}
                <div
                    className="App-mobile-table-icon"
                    onClick={() => toggleShowLeaveDetail(leave)}
                >
                    <FaRegListAlt />
                </div>
                </div>

                <div className="App-mobile-responsive-table-card-data">
                    {user.role === USER_ROLE[1] && (<div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        Type
                        </p>
                        <p>{leave.type}</p>
                    </div>)}

                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        Description
                        </p>
                        <p dangerouslySetInnerHTML={{ __html: formatTextForDisplay(leave.description) }}/>
                    </div>

                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        Start
                        </p>
                        <p>{leave.leaveStart.split('T')[0]}</p>
                    </div>
                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        End
                        </p>
                        <p>{leave.leaveEnd.split('T')[0]}</p>
                    </div>
                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        Status
                        </p>
                        <p>{leave.status}</p>
                    </div>
                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p className="App-mobile-responsive-table-card-data-title">
                        Submitted At
                        </p>
                        <p>{formatDateTime(generateSGDateTimeForDateTimeInput(leave.submittedAt))}</p>
                    </div>
                </div>
            </div>
            ))}
        </div>
        {showDetail && selectedLeave && (
            <LeaveDetail
                leave={selectedLeave}
                user={user}
                onUpdate={onUpdateLeave}
                onClose={toggleShowLeaveDetail}
            />
        )}
        </>
    )
}
export default LeaveMgt_m