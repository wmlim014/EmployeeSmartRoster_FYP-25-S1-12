import { useEffect, useState } from 'react'
import { useAuth } from '../../../AuthContext'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { SWAP_REQ_STATUS, NO_DATA_MATCHED } from '../../../controller/Variables.js'
import SwapTimeDetail from './SwapTimeDetail'
import TimelineController from '../../../controller/TimelineController'

import { FaRegListAlt } from '../../../../public/Icons'
import '../MySchedules.css'
import '../../../../public/styles/common.css'

const { viewAllIncomingSwapTime, viewAllSwapTime, updateSwapTimeStatus, filterStatus } = TimelineController
        
const SwapMgt = () => {
    const { user } = useAuth()
    const { showAlert } = useAlert()
    const [ filterSwapRequestStatus, setFilterSwapRequestStatus ] = useState<string>(SWAP_REQ_STATUS[0])
    const [ filterIncommingStatus, setFilterIncommingStatus ] = useState<string>(SWAP_REQ_STATUS[0])
    const [ allSwapRequest, setAllSwapRequest] = useState<any>([])
    const [ filteredSwapRequest, setFilteredSwapRequest ] = useState<any>([])
    const [ allIncomingSwap, setAllIncomingSwap ] = useState<any>([])
    const [ filteredIncomingSwap, setFilteredIncomingSwap ] = useState<any>([])
    const [ showSwapDetail, setShowSwapDetail ] = useState(false)
    const [ isIncomming, setIsIncomming ] = useState(false)
    const [ selectedSwap, setSelectedSwap ] = useState<any>({})

    // Get all swap request submitted
    const fetchAllSubmittedSwap = async () => {
        try {
            let response = await viewAllSwapTime (user?.UID)
            // console.log(response)
            if(response.message === 'Swap Request successfully retrieved, postViewEmployeeSwapRequest') {
                response = response.combinedEntry || []
                // console.log(response)
                setAllSwapRequest(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    // Get all incoming swap request received
    const fetchAllIncomingSwap = async () => {
        try {
            let response = await viewAllIncomingSwapTime (user?.UID)
            // console.log(response)
            if(response.message === 'Swap Request successfully retrieved, postViewEmployeeIncomingSwapRequest') {
                response = response.combinedEntry || []
                // console.log(response)
                setAllIncomingSwap(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => { 
        fetchAllSubmittedSwap()
        fetchAllIncomingSwap()
    }, [user])

    const triggerFilterReceivedSwap = () => {
        let filtered = allSwapRequest
        filtered = filterStatus(filtered, filterSwapRequestStatus)
        setFilteredSwapRequest(filtered)
    }
    // Auto trigger when all swap request changed
    useEffect(() => { triggerFilterReceivedSwap() }, [
        allSwapRequest,
        filterSwapRequestStatus
    ])
    const triggerFilterIncomingSwap = () => {
        let filtered = allIncomingSwap
        filtered = filterStatus(filtered, filterIncommingStatus)
        setFilteredIncomingSwap(filtered)
        // console.log(filtered)
    }
    // Auto trigger when all incoming swap request changed
    useEffect(() => { triggerFilterIncomingSwap() }, [
        allIncomingSwap,
        filterIncommingStatus
    ])

    function toggleShowSwapDetail(isIncomming: boolean, swapRequest: any) {
        setShowSwapDetail(!showSwapDetail)
        setIsIncomming(isIncomming)
        setSelectedSwap(swapRequest)
    }

    function onUpdateIncomingSwapRequestStatus(updatedData: any) {
        const newData = allIncomingSwap.map((swapRequest: any) => 
            swapRequest.senderDetails.swapReqID === updatedData.senderDetails.swapReqID
            ? updatedData
            : swapRequest
        )
        setAllIncomingSwap(newData)
    }

    return(
        <div className="content swap-time-management">
            <h1>Swap Time Management</h1>
            <div className="submitted-time-swap">
                <div className="submitted-swap-list-container">
                    <h3>Submitted Swap Request</h3>
                    <div className="App-filter-search-component">
                        <div className="App-filter-container subscription-status">
                            <p className='App-filter-title'>Filter Submitted Swap Request</p>
                            {/* Swap Request Status Dropdown */}
                            <select 
                                value={filterSwapRequestStatus}
                                onChange={(e) => setFilterSwapRequestStatus(e.target.value)}
                            >
                                {SWAP_REQ_STATUS.map((swapStatus:any) => (
                                <option key={swapStatus} value={swapStatus}>
                                    {swapStatus}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {filteredSwapRequest.length > 0 ? (
                        <>
                        {filteredSwapRequest.map((swapRequest: any) => (
                            <div 
                                key={swapRequest.senderDetails.swapReqID}
                                className="App-mobile-responsive-table-card"
                            >
                                <div className="App-mobile-responsive-table-card-title">
                                    <h2>{swapRequest.receiverDetails.fullName}</h2>
                                    <div
                                        className="App-mobile-table-icon"
                                        onClick={() => toggleShowSwapDetail(false, swapRequest)}
                                    >
                                        <FaRegListAlt />
                                    </div>
                                </div>
                                <div className="App-mobile-responsive-table-card-data">
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            From
                                        </p>
                                        <p>{swapRequest.senderDetails.taskName}</p>
                                    </div>
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            To
                                        </p>
                                        <p>{swapRequest.receiverDetails.taskName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </>
                    ):(
                        <p>{NO_DATA_MATCHED}</p>
                    )}
                </div>
            </div>
            
            <div className="submitted-swap-list-container">
                <h3>Received Swap Request</h3>
                <div className="App-filter-search-component">
                    <div className="App-filter-container subscription-status">
                        <p className='App-filter-title'>Filter Received Swap Request</p>
                        {/* Swap Request Status Dropdown */}
                        <select 
                            value={filterIncommingStatus}
                            onChange={(e) => setFilterIncommingStatus(e.target.value)}
                        >
                            {SWAP_REQ_STATUS.map((swapStatus:any) => (
                            <option key={swapStatus} value={swapStatus}>
                                {swapStatus}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
                {filteredIncomingSwap.length > 0 ? (
                    <>
                    {filteredIncomingSwap.map((swapRequest: any) => (
                        <div 
                            key={swapRequest.receiverDetails.swapReqID}
                            className="App-mobile-responsive-table-card"
                        >
                            <div className="App-mobile-responsive-table-card-title">
                                <h2>{swapRequest.receiverDetails.fullName}</h2>
                                <div
                                    className="App-mobile-table-icon"
                                    onClick={() => toggleShowSwapDetail(true, swapRequest)}
                                >
                                    <FaRegListAlt />
                                </div>
                            </div>
                            <div className="App-mobile-responsive-table-card-data">
                                <div className="App-mobile-responsive-table-card-data-detail">
                                    <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                        From
                                    </p>
                                    <p>{swapRequest.receiverDetails.taskName}</p>
                                </div>
                                <div className="App-mobile-responsive-table-card-data-detail">
                                    <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                        To
                                    </p>
                                    <p>{swapRequest.senderDetails.taskName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </>
                ):(
                    <p>{NO_DATA_MATCHED}</p>
                )}
            </div>
            {showSwapDetail && selectedSwap && (
                <SwapTimeDetail 
                    swap={selectedSwap}
                    isIncomming={isIncomming}
                    onUpdate={onUpdateIncomingSwapRequestStatus}
                    onClose={() => toggleShowSwapDetail(false, {})}
                />
            )}
        </div>
    )
}

export default SwapMgt