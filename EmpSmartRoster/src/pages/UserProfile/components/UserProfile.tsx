import { useState } from 'react'
import { formatPhoneNumber, hideNRIC } from '../../../controller/Variables.js'

import { BiSolidHide, BiSolidShow } from '../../../../public/Icons.js'
import './styles.css'
import '../../../../public/styles/common.css'

interface BOUserProfileProps {
    userData: any
}

const UserProfileCard = ({ userData }: BOUserProfileProps) => {
    // console.log(userData)
    const [ showNRIC, setShowNRIC ] = useState(false)

    function toggleShowNRIC() {
        setShowNRIC(!showNRIC)
    }
    
    return (
        <>
            <div className="user-profile-data email even-row">
                <p className="title">EMAIL</p>
                <p className="main-data">{userData.email}</p>
            </div>
            <div className="user-profile-data fullname">
                <p className="title">FULLNAME</p>
                <p className="main-data">{userData.fullName}</p>
            </div>
            <div className="user-profile-data nric even-row">
                <p className="title">NRIC</p>
                <div className="main-data">
                    <div className='user-profile-nric-contain'>
                    {!showNRIC ? (
                        <>
                        {hideNRIC(String(userData.nric))}
                        <BiSolidHide 
                            className='hide-show-nric-icon'
                            onClick={() => toggleShowNRIC()}
                        />
                        </>
                    ) : (
                        <>
                        {userData.nric}
                        <BiSolidShow 
                            className='hide-show-nric-icon'
                            onClick={() => toggleShowNRIC()}
                        />
                        </>
                    )}
                    </div>
                </div>
            </div>
            <div className="user-profile-data hpNo">
                <p className="title">H/P NO</p>
                <p className="main-data">{formatPhoneNumber(String(userData.hpNo))}</p>
            </div>
        </>
    )
}

export default UserProfileCard;