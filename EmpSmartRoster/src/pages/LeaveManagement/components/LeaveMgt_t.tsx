import { useState } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { USER_ROLE, generateSGDateTimeForDateTimeInput, formatDateTime } from '../../../controller/Variables'
import Header from '../../../components/table/Header'
import Cell from '../../../components/table/Cell'
import LeaveDetail from './LeaveDetail'

import { FaRegListAlt } from '../../../../public/Icons.js'
import '../LeaveManagement.css'
import '../../../../public/styles/common.css'

interface LeaveMgtTableProps {
    leaves: any;
    user: any;
    onUpdateLeave: (updatedLeave: any) => void
}

const LeaveMgt_t = ({leaves = [], user, onUpdateLeave}: LeaveMgtTableProps) => {
    const [ showDetail, setShowDetail ] = useState(false)
    const [ selectedLeave, setSelectedLeave ] = useState<any>({})
    
    function toggleShowLeaveDetail (leave: any) {
        setSelectedLeave(leave);
        setShowDetail(!showDetail);
    };

    return(
        <>
        <div className="App-desktop-responsive-table leave-list">
            <div className='App-desktop-table-row leave-header'>
                {user.role === USER_ROLE[1] && (
                    <Header className='leave-header-from' text='FROM' />
                )}
                <Header className='leave-header-type' text='TYPE' />
                <Header className='leave-header-desc' text='DESCRIPTION' />
                <Header className='leave-header-start' text='LEAVE START' />
                <Header className='leave-header-end' text='LEAVE END' />
                <Header className='leave-header-status' text='STATUS' />
                <Header className='leave-header-submitted-at' text='SUBMITTED AT' />
                <Header className='App-header-icon-gap' text='' />
            </div>
            {leaves.map((leave:any) => (
            <div className="App-desktop-table-row leave-table-row" key={leave.leaveID}>
                {user.role === USER_ROLE[1] && (
                    <Cell className='cell-leave-from' text={leave.fullName} />
                )}
                <Cell className='cell-leave-type' text={leave.type} />
                <Cell className='cell-leave-desc' text={leave.description} />
                <Cell className='cell-leave-start' text={leave.leaveStart.split('T')[0]} />
                <Cell className='cell-leave-end' text={leave.leaveEnd.split('T')[0]} />
                <Cell className='cell-leave-status' text={leave.status} />
                <Cell className='cell-leave-submitted-at' text={formatDateTime(generateSGDateTimeForDateTimeInput(leave.submittedAt))} />
                
                <div 
                    className="App-desktop-table-icon" 
                    onClick={() => {
                        toggleShowLeaveDetail(leave)
                    }}>
                    <FaRegListAlt />
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
export default LeaveMgt_t