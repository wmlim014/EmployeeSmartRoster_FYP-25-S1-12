import { useLocation } from "react-router-dom"
import "./Title.css"
import "../../../../public/styles/common.css"

const RegisReqTitle = ({noOfPendingRequest = 0}: RegisReqTitleProps) => {
    const location = useLocation();
    const isOnAdminDash = location.pathname.includes('admin-dashboard');

    return(
        <div className="header">
            {isOnAdminDash &&(
                <div className="title-in-dash">
                    <h1>New Registration Request</h1>
                    <span className="totalPending">{noOfPendingRequest}</span>
                </div>
            )}
            {!isOnAdminDash && (
                <h1>Registration Request Management</h1>
            )}
        </div>
    )
}

interface RegisReqTitleProps {
    noOfPendingRequest?: number;
}

export default RegisReqTitle;