import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { USER_ROLE, NO_DATA_MATCHED, LEAVE_STATUS, LEAVE_TYPE } from '../../controller/Variables'
import CreateOEditLeave from './components/CreateOEditLeave'
import LeaveMgtController from '../../controller/LeaveMgtController'
import LeaveMgt_t from './components/LeaveMgt_t'
import LeaveMgt_m from './components/LeaveMgt_m'

import './LeaveManagement.css'
import '../../../public/styles/common.css'

const { empGetAllLeave, handleFilterStatus, handleFilterString,
        handleFilterType, boGetAllLeave } = LeaveMgtController;

const LeaveManagement = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ allLeaves, setAllLeave ] = useState<any>([])
    const [ filterStatus, setFilterStatus ] = useState<string>('All')
    const [ filterType, setFilterType ] = useState<string>('All')
    const [ filterName, setFilterName ] = useState<string>('')
    const [ filteredLeaves, setFilteredLeaves ] = useState<any>([])

    // Employee fetch own submitted leave
    const fetchEmpSubmittedLeave = async () => {
        try {
            const response = await empGetAllLeave(user?.UID)
            // console.log(response)
            const leaves = response.leaveDetails || []
            setAllLeave(leaves)
        } catch(error) {
            showAlert(
                "fetchEmpSubmittedLeave",
                `Failed to fetch all submitted leave`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // BO fetch own's employees submitted leave
    const fetchAllSubmittedLeave = async () => {
        try {
            const response = await boGetAllLeave(user?.UID)
            // console.log(response)
            const leaves = response.leaveMCList || []
            setAllLeave(leaves)
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
        if(user?.role === USER_ROLE[2])
            fetchEmpSubmittedLeave()
        if(user?.role === USER_ROLE[1])
            fetchAllSubmittedLeave()
    }, [user])

    const handleFilterLeaves = async () => {
        let filtered = allLeaves

        if(filterStatus !== 'All') {
            filtered = handleFilterStatus(filtered, filterStatus)
            if(filterType !== 'All')
                filtered = handleFilterType(filtered, filterType)
            filtered = handleFilterString(filtered, filterName)
        } else {
            if(filterType !== 'All')
                filtered = handleFilterType(filtered, filterType)
            filtered = handleFilterString(filtered, filterName)
        }
        setFilteredLeaves(filtered)
    }
    // Filter when all leaves, status, type and name changed
    useEffect(() => { 
        handleFilterLeaves() 
    }, [allLeaves, filterStatus, filterType, filterName])

    // Update create locally
    function onLeaveCreate(newData: any, status: string) {
        // console.log(newData)
        const leaves = [
            ...allLeaves,
            {
                ...newData,
                status: status,
                submittedAt: new Date().toISOString()
            }
        ]
        // console.log(leaves)
        setAllLeave(leaves)
    }

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

    return(
        <div className="App-content">
            <div className="content">
                <div className="leave-mgt-page-title">
                    <h1>Leave/MC Management</h1>
                    {user?.role === USER_ROLE[2] && (
                        <CreateOEditLeave 
                            isCreate={true}
                            onCreate={onLeaveCreate}
                        />
                    )}
                </div>

                <div className="App-filter-search-component">
                    <div className="App-filter-container subscription-status">
                        <p className='App-filter-title'>Status</p>
                        {/* Status dropdown */}
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">ALL</option>
                            {LEAVE_STATUS.map((leave:any) => (
                            <option key={leave} value={leave}>
                                {leave}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="App-filter-container subscription-status">
                        <p className='App-filter-title'>Leave Type</p>
                        {/* Status dropdown */}
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">ALL</option>
                            {LEAVE_TYPE.map((type:any) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                            ))}
                        </select>
                    </div>
                    {user?.role === USER_ROLE[1] && (
                    <div className="App-filter-container uen-company-name">
                        <p className='App-filter-title'>Employee Name</p>
                        <input type='text' 
                            className='search-input'
                            placeholder='Search Employee Name' 
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>
                    )}
                </div>

                {filteredLeaves.length > 0 ? (
                    <>
                        <LeaveMgt_t 
                            leaves={filteredLeaves}
                            user={user}
                            onUpdateLeave={onLeaveChangeStatus}
                        />
                        <LeaveMgt_m
                            leaves={filteredLeaves}
                            user={user}
                            onUpdateLeave={onLeaveChangeStatus}
                        />
                    </>
                ) : (
                    <p>{NO_DATA_MATCHED}</p>
                )}
            </div>
        </div>
    )
}

export default LeaveManagement