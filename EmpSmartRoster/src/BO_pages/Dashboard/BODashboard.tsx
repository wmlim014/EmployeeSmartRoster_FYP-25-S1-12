import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { LEAVE_STATUS } from '../../controller/Variables'
import Attendance_m from '../../pages/AttendanceRecord/components/Attendance_m'
import LeaveMgt_m from '../../pages/LeaveManagement/components/LeaveMgt_m';
import AttendanceController from '../../controller/AttendanceController';
import LeaveMgtController from '../../controller/LeaveMgtController'

import './Dashboard.css'
import '../../../public/styles/common.css'

const { boGetAllLeave, handleFilterStatus } = LeaveMgtController;
const { boViewMyEmpAttendances, sortAttendanceRecords } = AttendanceController

const BODashboard = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ allLeaves, setAllLeave ] = useState<any>([])
    const [ allAttendances, setAllAttendances ] = useState<any>([])

    // BO fetch own's employees submitted leave
    const fetchAllSubmittedLeave = async () => {
        try {
            const response = await boGetAllLeave(user?.UID)
            // console.log(response)
            const leaves = response.leaveMCList || []
            const filtered = handleFilterStatus(leaves, LEAVE_STATUS[0])
            setAllLeave(filtered)
        } catch(error) {
            showAlert(
                "fetchEmpSubmittedLeave",
                `Failed to fetch all submitted leave`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => { 
        fetchAllSubmittedLeave()
        fetchEmpAttendanceRecord()
    }, [user])
    // Update leave status change locally
    function onLeaveChangeStatus(updatedLeave: any) {
        // console.log(updatedLeave)
        const leaves = allLeaves.map((leave: any) => 
            leave.leaveID === updatedLeave.leaveID 
            ? updatedLeave
            : leave
        )
        setAllLeave(leaves)
    }

    const fetchEmpAttendanceRecord = async() => {
        try {
            let response = await boViewMyEmpAttendances(user?.UID)
            // console.log(response)
            if(response.responseCode === 200){
                let allSortedResponse = response.attendanceList || []
                if(allSortedResponse.length > 0) {
                    allSortedResponse = sortAttendanceRecords(allSortedResponse)
                    // Set current registered attendance
                    
                    // Filter to get all completed attendance (with clock in and out)
                    const filteredOutIncompletedAttendance = allSortedResponse.filter((attendance: any) => {
                        return attendance.endTime !== null
                    })
                    // console.log(filteredOutIncompletedAttendance)
                    setAllAttendances(filteredOutIncompletedAttendance || [])
                }
            }
        } catch (error) {
            showAlert(
                'fetchAllAttendanceRecord',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    return (
        <div className="App-content">
            <div className="content">
                <h1>My Dashboard</h1>
                <div className="bo-dashboard-container">
                    <div className="bo-dashboard-leave-management">
                        <h3>Leave Pending Approval</h3>
                        {allLeaves.length > 0 ? (
                            <LeaveMgt_m 
                                leaves={allLeaves}
                                user={user}
                                onUpdateLeave={onLeaveChangeStatus}
                            />
                        ):(
                            <>No Leave Pending Approve</>
                        )}
                    </div>
                    <div className="bo-dashboard-attendance-record">
                        <h3>All Employee Attendance Records</h3>
                        {allLeaves.length > 0 ? (
                            <Attendance_m 
                                attendanceRecords={allAttendances}
                                user={user}
                            />
                        ):(
                            <>No Employee Attendance Records Completed</>
                        )}
                    </div>
                </div>
                
            </div>
        </div>

    );
}

export default BODashboard;