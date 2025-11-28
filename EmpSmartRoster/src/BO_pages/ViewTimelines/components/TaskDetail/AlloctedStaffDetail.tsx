import { HiMiniViewfinderCircle, TiTime } from '../../../../../public/Icons.js'
import { MdContactPhone, MdOutlineMailOutline } from '../../../../../public/Icons.js'

import './MoreInfor.css'
import '../../../../../public/styles/common.css'

interface AllocatedStaffDetailProps {
    allocatedStaff: any;
}

const AllocatedStaffDetail = ({ allocatedStaff = [] }: AllocatedStaffDetailProps) => {
    // console.log(allocatedStaff.allocatedTime)
    
    return (
        <div className="allocated-staff-content">
            {/* <p className="title allocated-staff-title">{allocatedStaff.jobTitle}</p> */}
            <div className="allocated-staff-info">
                {/* Display contact number */}
                <div className="allocated-staff-contact-no">
                    <MdContactPhone className='App-popup-content-icon'/>
                    {allocatedStaff.hpNo}
                </div>
                {/* Display email */}
                <div className="allocated-staff-email">
                    <MdOutlineMailOutline className='App-popup-content-icon'/>
                    {allocatedStaff.email}
                </div>
            </div>
            
            {allocatedStaff?.allocatedTime?.length === 2 && (
                <div className="allocation-date-detail-container">
                    <p className="title">Allocated Date:</p>
                    <div className="allocated-date-detail">    
                        <div className="event-detail-date-display">
                            <HiMiniViewfinderCircle className='App-popup-content-icon'/>
                            <p className="main-data">{allocatedStaff.allocatedTime[0]}</p>
                        </div>
                        <div className="event-detail-time-display">
                            <TiTime className='App-popup-content-icon'/>
                            <p className="main-data">{allocatedStaff.allocatedTime[1].split('.')[0]}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllocatedStaffDetail