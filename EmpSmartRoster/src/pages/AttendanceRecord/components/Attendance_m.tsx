import { useLocation } from "react-router-dom"
import { formatDisplayDateTime, USER_ROLE } from '../../../controller/Variables'

import '../Attendance.css'
import '../../../../public/styles/common.css'

interface AttendanceRecord_TProps {
    attendanceRecords: any;
    user: any;
}

const Attendance_m = ({ attendanceRecords, user } : AttendanceRecord_TProps) => {
    // console.log(attendanceRecords)
    const location = useLocation()
    const isOnBODash = location.pathname.includes('business-dashboard');

    return(
        <>
        <div className={`${isOnBODash ? 'set-visible' : 'App-mobile-responsive-table'}`}>
            {attendanceRecords.map((attendance:any) => (
                <div key={attendance.attendanceID} className="App-mobile-responsive-table-card">
                    {user.role === USER_ROLE[1] && (
                        <div className="App-mobile-responsive-table-card-title">
                            <h2>{attendance.fullName}</h2>
                        </div>
                    )}
                    <div className="App-mobile-responsive-table-card-data attendance-record-mobile-data">
                        <div className="App-mobile-responsive-table-card-data-detail attendance-record-mobile-data-row odd-row">
                            <p className="App-mobile-responsive-table-card-data-title attendance-record-mobile-title">
                                Start Working Time
                            </p>
                            <p>{formatDisplayDateTime(attendance.startTime)}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail attendance-record-mobile-data-row">
                            <p className="App-mobile-responsive-table-card-data-title attendance-record-mobile-title">
                                End Working Time
                            </p>
                            <p>{formatDisplayDateTime(attendance.endTime)}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail attendance-record-mobile-data-row odd-row">
                            <p className="App-mobile-responsive-table-card-data-title attendance-record-mobile-title">
                                Total Working Hours
                            </p>
                            <p>{attendance.hrsWorked}</p>
                        </div>
                        {user.role === USER_ROLE[1] && (
                        <>
                        <div className="App-mobile-responsive-table-card-data-detail attendance-record-mobile-data-row">
                            <p className="App-mobile-responsive-table-card-data-title attendance-record-mobile-title">
                                MC Taken
                            </p>
                            <p>{String(attendance.MC_count)}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail attendance-record-mobile-data-row odd-row">
                            <p className="App-mobile-responsive-table-card-data-title attendance-record-mobile-title">
                                Leave Taken
                            </p>
                            <p>{String(attendance.leave_count)}</p>
                        </div>
                        </>
                        )}
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}
export default Attendance_m
