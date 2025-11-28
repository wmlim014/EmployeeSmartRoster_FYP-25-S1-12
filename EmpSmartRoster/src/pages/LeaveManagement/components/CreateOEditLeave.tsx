import { useState, useEffect } from 'react'
import { useAuth } from '../../../AuthContext'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { LEAVE_STATUS, LEAVE_TYPE } from '../../../controller/Variables'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import LeaveForm from './LeaveForm'
import LeaveMgtController from '../../../controller/LeaveMgtController'
import UserController from '../../../controller/User/UserController'

import { FaRegEdit } from '../../../../public/Icons.js'
import '../LeaveManagement.css'
import '../../../../public/styles/common.css'

interface CreateOEditLeaveProps {
    isCreate: boolean;
    leaveValue?: any;
    onClose?: () => void;
    onUpdate?: (value: any) => void;
    onCreate?: (value: any, status: string) => void;
}
const { empGetUserProfile } = UserController;

const CreateOEditLeave = ({
    isCreate, leaveValue, onClose, onUpdate, onCreate
}: CreateOEditLeaveProps) => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ userProfile, setUserProfile ] = useState<any>({})
    const [ showLeaveForm, setShowLeaveForm ] = useState(false)

    // Get employee informations
    const fetchMyProfile = async () => {
        try {
            let response = await empGetUserProfile (user?.UID)
            // console.log(response)
            if(response.message === 'Employee Profile successfully retrieved') {
                response = response || []
                // console.log(response)
                setUserProfile(response)
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
    useEffect(() => { fetchMyProfile() }, [user])

    function toggleShowLeaveForm () {
        setShowLeaveForm(!showLeaveForm)
    }

    return(
        <>
        {isCreate ? (
            <PrimaryButton 
                text='Submit Leave/MC'
                onClick={toggleShowLeaveForm}
            />
        ):(
            <FaRegEdit
                className='icons edit-leave-icon'
            />
        )}
        {showLeaveForm && userProfile && (
            <LeaveForm 
                isCreate={isCreate}
                user={userProfile}
                onCreate={onCreate}
                onClose={toggleShowLeaveForm}
            />
        )}
        </>
    )
}

export default CreateOEditLeave