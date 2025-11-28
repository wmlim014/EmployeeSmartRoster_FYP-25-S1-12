import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime, USER_ROLE, NO_DATA_MATCHED } from '../../controller/Variables';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import Attendance_t from './components/Attendance_t';
import Attendance_m from './components/Attendance_m';
import AttendanceController from '../../controller/AttendanceController';

import { FaClock } from '../../../public/Icons.js'
import './Attendance.css'
import '../../../public/styles/common.css'

const { submitAttendance, submitCheckOut, empViewMyAttendances,
        sortAttendanceRecords, boViewMyEmpAttendances, handleFilterByStartTime,
        handleFilterEmpName } = AttendanceController

const AttendanceRecord = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const [ allAttendances, setAllAttendances ] = useState<any>([])
    const [ finalAttendance, setFinalAttendance ] = useState<any>({})
    const [ filterStart, setFilterStart ] = useState<any>(new Date().toISOString().split('T')[0])
    const [ filterEnd, setFilterEnd ] = useState<any>(new Date().toISOString().split('T')[0])
    const [ filterName, setFilterName ] = useState<string>('')
    const [ filteredRecords, setFIlteredRecords ] = useState<any>([])
    
    // EMP - Get all attendance record
    const fetchAllAttendanceRecord = async() => {
        try {
            let response = await empViewMyAttendances(user?.UID)
            // console.log(response)
            if(response.message === 'Employee Attendance successfully retrieved'){
                let allSortedResponse = response.employeeAttendance || []
                if(allSortedResponse.length > 0) {
                    allSortedResponse = sortAttendanceRecords(allSortedResponse)
                    // Set current registered attendance
                    setFinalAttendance(allSortedResponse[0])
                    
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
    // BO - Get all attendance record from my Employee
    const fetchEmpAttendanceRecord = async() => {
        try {
            let response = await boViewMyEmpAttendances(user?.UID)
            // console.log(response)
            if(response.responseCode === 200){
                let allSortedResponse = response.attendanceList || []
                if(allSortedResponse.length > 0) {
                    allSortedResponse = sortAttendanceRecords(allSortedResponse)
                    
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
    // Auto trigger when user and final attendance changed
    useEffect(() => { 
        if(user?.role === USER_ROLE[2])
            fetchAllAttendanceRecord()
        
        if(user?.role === USER_ROLE[1])
            fetchEmpAttendanceRecord()
    }, [user])

    // Employee Submit Attendance
    const checkIn = async() => {
        try {
            // console.log(empData)
            let response = await submitAttendance(user?.UID)
            // console.log(response)
            if(response.message === 'Attendance successfully added') {
                location.reload()
                showAlert(
                    'Clock In Successfully',
                    '',
                    `The attendance record update successfully`,
                    { type: 'success' }
                );
            }
        } catch (error) {
            showAlert(
                'checkIn',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    // Employee Check Out
    const checkOut = async() => {
        try {
            // console.log(empData)
            let response = await submitCheckOut(finalAttendance.attendanceID)
            // console.log(response)
            if(response.message === 'Employee Successfully Clocked Out ') {
                location.reload()
                showAlert(
                    'Clock Out Successfully',
                    '',
                    `The attendance record update successfully`,
                    { type: 'success' }
                );
            }
        } catch (error) {
            showAlert(
                'checkIn',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function triggerFilter() {
        let filtered = allAttendances
        filtered = handleFilterByStartTime(filtered, filterStart, filterEnd)
        filtered = handleFilterEmpName(filtered, filterName)
        setFIlteredRecords(filtered)
    }
    useEffect(()=>{triggerFilter()}, [
        allAttendances, 
        filterStart, 
        filterEnd,
        filterName
    ])

    return (
        <div className="App-content">
            <div className="content">
                <div className="attendance-record-page-header">
                    <h1>Attendance Records</h1>
                    {/* Display Clock in & out button for employee */}
                    {user?.role === USER_ROLE[2] && (
                        <>
                        {(!finalAttendance || finalAttendance.endTime !== null) ? (
                            <PrimaryButton 
                                text='Clock In'
                                onClick={() => checkIn()}
                            />
                        ):(
                            <PrimaryButton 
                                text='Clock Out'
                                onClick={() => checkOut()}
                            />
                        )}
                        </>
                    )}
                </div>
                {/* Display Current Registered Attendance (the lastest) for Employee */}
                {user?.role === USER_ROLE[2] && (
                    <div className="current-attendance card">
                        <h4>Last Registered Attendance</h4>
                        {finalAttendance !== null && (
                            <div className="current-attendance-record-content">
                                <p className='even-row'>
                                    <strong>Clocked In: </strong>
                                    <div>
                                        <FaClock className='clock-icon'/>
                                        {formatDisplayDateTime(finalAttendance.startTime)}
                                    </div>
                                </p>
                                {finalAttendance?.endTime !== null ? (
                                    <p className='even-row'>
                                        <strong>Clocked Out: </strong>
                                        <div>
                                            <FaClock className='clock-icon'/>
                                            {formatDisplayDateTime(finalAttendance.endTime)}
                                        </div>
                                    </p>
                                ):(
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="App-filter-search-component">
                    <div className="App-filter-container uen-company-name">
                        <p className='App-filter-title'>Filter Start Date <br/>From</p>
                        <input 
                            type='date' 
                            placeholder='Start Date' 
                            value={filterStart}
                            onChange={(e) => setFilterStart(e.target.value || filterEnd)}
                            max={filterEnd}
                        />
                    </div>
                    <div className="App-filter-container uen-company-name">
                        <p className='App-filter-title'><br/>To</p>
                        <input 
                            type='date' 
                            placeholder='Start Date' 
                            value={filterEnd}
                            onChange={(e) => setFilterEnd(e.target.value || filterStart)}
                            min={filterStart}
                        />
                    </div>
                    {user?.role === USER_ROLE[1] && (
                        <div className="App-filter-container uen-company-name">
                            <p className='App-filter-title'><br/>Search Employee Name</p>
                            <input type='text' 
                                className='search-input'
                                placeholder='Search Name' 
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                {filteredRecords.length > 0 ? (
                    <>
                    <Attendance_t 
                        attendanceRecords={filteredRecords}
                        user={user}
                    />
                    <Attendance_m 
                        attendanceRecords={filteredRecords}
                        user={user}
                    />
                    </>
                ) : (
                    <>{NO_DATA_MATCHED}</>
                )}
            </div>
        </div>
    )
}
export default AttendanceRecord