import { useEffect, useState } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import { formatPhoneNumber, USER_ROLE, hideNRIC } from '../../../controller/Variables.js'
import UserController from '../../../controller/User/UserController.js'

import { GoAlertFill, TiTick, BiSolidHide, BiSolidShow } from '../../../../public/Icons.js'
import './styles.css'
import '../../../../public/styles/common.css'

interface BOUpdateUserProfileProps {
    userData: any
    currentUser: any
    onDataUpdate?: (updatedData: any) => (void)
    onClose: () => void
}

const { validateEmail, validatePhoneNo, boUpdateUserProfile,
        empUpdateUserProfile, } = UserController;

const UpdateUserProfileCard = ({ userData, currentUser, onDataUpdate, onClose }: BOUpdateUserProfileProps) => {
    const { showAlert } = useAlert();
    const [ dataForUpdate, setDataForUpdate ] = useState({
        email: '',
        hpNo: '',
        fullName: '',
    });
    const [ errors, setErrors ] = useState({
        email: '',
        hpNo: '',
    });
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ showNRIC, setShowNRIC ] = useState(false)

    useEffect(() => {
        let values = { ...userData }
        values.hpNo = formatPhoneNumber(String(values.hpNo))
        setDataForUpdate(values)
    }, [userData])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'hpNo'){
            const formattedPhoneNumber = formatPhoneNumber(value)
            setDataForUpdate((prevData) => ({
                ...prevData,
                hpNo: formattedPhoneNumber,
            }));
        } else {
            setDataForUpdate((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const triggerEmailValidation = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Store email value
        const email = event.target.value
        handleInputChange(event)

        const error = validateEmail(email)
        setErrors(prev => ({
            ...prev,
            email: error
        }))
    }

    const triggerPhoneValidation = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Format the phone number with spaces
        const formattedNumber = formatPhoneNumber(event.target.value);
        handleInputChange(event)

        const error = validatePhoneNo(formattedNumber)
        setErrors(prev => ({
            ...prev,
            hpNo: error
        }))
    }

    // Check if all data filled
    const isFormIncomplete = () => {
        const requiredFields: (keyof typeof dataForUpdate)[] = [
            'fullName',
            'email',
            'hpNo'
        ];

        return requiredFields.some(field => !dataForUpdate[field]);
    };
    // console.log("isFormIncomplete?", isFormIncomplete(), employeeData);
    // Check if any error within the form
    const isAllValueValid = () => {
        const validValues: (keyof typeof errors)[] = [
            'email',
            'hpNo',
        ]

        return validValues.some(field => errors[field]);
    }

    function toggleConfirmUpdateProfile() {
        setShowConfirmation(!showConfirmation)
    }

    function toggleShowNRIC() {
        setShowNRIC(!showNRIC)
    }

    const triggerBO_UpdateUserProfile = async() => {
        try {
            const response = await boUpdateUserProfile(userData.user_id, dataForUpdate)
            // console.log(response)
            if (response.message === "hpNo , fullName , email successfully updated") {
                if (onDataUpdate)
                    onDataUpdate(dataForUpdate)
    
                if (onClose)
                    onClose()

                showAlert(
                    "Update User Profile",
                    `Succeed`,
                    ``,
                    { type: 'success' }
                );
            } else {
                if (response.body === `{"message":"Duplicate entry '${dataForUpdate.email}' for key 'User.email'"}`) {
                    toggleConfirmUpdateProfile()
                    showAlert(
                        "Update User Profile",
                        `Failed to Update User Profile`,
                        `The new email had been registered`,
                        { type: 'error' }
                    );
                } else {
                    toggleConfirmUpdateProfile()
                    showAlert(
                        "Update User Profile",
                        `Failed to Update User Profile`,
                        ``,
                        { type: 'error' }
                    );
                }
            }
        } catch (error) {
            showAlert(
                "triggerBO_UpdateUserProfile",
                `Failed to Update User Profile`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const triggerEMP_UpdateUserProfile = async() => {
        try {
            const response = await empUpdateUserProfile(userData.user_id, dataForUpdate)
            // console.log(response)
            if (response.message === 'Profile successfully updated.') {
                if (onDataUpdate)
                    onDataUpdate(dataForUpdate)
    
                if (onClose)
                    onClose()

                showAlert(
                    "Update User Profile",
                    `Succeed`,
                    ``,
                    { type: 'success' }
                );
            } else {
                if (response.body === `{"message":"Duplicate entry '${dataForUpdate.email}' for key 'User.email'"}`) {
                    toggleConfirmUpdateProfile()
                    showAlert(
                        "Update User Profile",
                        `Failed to Update User Profile`,
                        `The new email had been registered`,
                        { type: 'error' }
                    );
                } else {
                    toggleConfirmUpdateProfile()
                    showAlert(
                        "Update User Profile",
                        `Failed to Update User Profile`,
                        ``,
                        { type: 'error' }
                    );
                }
            }
        } catch (error) {
            showAlert(
                "triggerBO_UpdateUserProfile",
                `Failed to Update User Profile`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    if (showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmUpdateProfile}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                <h3 className="App-prompt-confirmation-title App-header">
                    Confirm Update User Information
                </h3>

                <div className="user-profile-data email">
                    <p className="title">EMAIL</p>
                    <p className="main-data">{dataForUpdate.email}</p>
                </div>
                <div className="user-profile-data fullname">
                    <p className="title">FULLNAME</p>
                    <p className="main-data">{dataForUpdate.fullName}</p>
                </div>
                <div className="user-profile-data hpNo">
                    <p className="title">H/P NO</p>
                    <p className="main-data">{formatPhoneNumber(String(dataForUpdate.hpNo))}</p>
                </div>

                <div className="update-user-profile-button">
                    {currentUser?.role === USER_ROLE[1] && (
                        <PrimaryButton 
                            text='Confirm'
                            onClick={() => triggerBO_UpdateUserProfile()}
                        />
                    )}
                    {currentUser?.role === USER_ROLE[2] && (
                        <PrimaryButton 
                            text='Confirm'
                            onClick={() => triggerEMP_UpdateUserProfile()}
                        />
                    )}
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => toggleConfirmUpdateProfile()}
                    />
                </div>
            </div>
        </div>
    )
    
    return (
        <>
            <div className="user-profile-data email even-row">
                <p className="edit-title">EMAIL</p>
                <p className="main-data">
                    <input type='email' 
                        name='email'
                        value={dataForUpdate.email}
                        placeholder='Enter Employee Email' 
                        onChange={(e) => triggerEmailValidation(e)}
                        required
                    />
                    {errors.email && (
                        <span className='error-message'>
                            <GoAlertFill />
                            <span className='error-message-text'>{errors.email}</span>
                        </span>
                    )}
                    {!errors.email && dataForUpdate.email !== userData.email && (
                        <span className='valid-message'>
                            <TiTick className='valid-icon'/>
                            <span>Valid Email</span>
                        </span>
                    )}
                </p>
            </div>
            <div className="user-profile-data fullname">
                <p className="edit-title">FULLNAME</p>
                <p className="main-data">
                    <input type='text' 
                        name='fullName'
                        placeholder='Employee Name' 
                        value={dataForUpdate.fullName}
                        onChange={(e) => handleInputChange(e)}
                        required
                    />
                </p>
            </div>
            <div className="user-profile-data nric even-row">
                <p className="title">NRIC</p>
                <div className="main-data">
                    <div className='user-profile-nric-contain'>
                    {!showNRIC ? (
                        <>
                        {hideNRIC(userData.nric.toUpperCase())}
                        <BiSolidHide 
                            className='hide-show-nric-icon'
                            onClick={() => toggleShowNRIC()}
                        />
                        </>
                    ) : (
                        <>
                        {userData.nric.toUpperCase()}
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
                <p className="edit-title">H/P NO</p>
                <p className="main-data">
                    <input type='tel' 
                        name='hpNo'
                        placeholder='8123 4567' 
                        value={dataForUpdate.hpNo}
                        onChange={(e) => triggerPhoneValidation(e)}
                        // onBlur={(e) => triggerPhoneValidation(e)}
                        required
                    />
                    {errors.hpNo && (
                        <span className='error-message'>
                            <GoAlertFill /> 
                            <span className='error-message-text'>{errors.hpNo}</span>
                        </span>
                    )}
                    {!errors.hpNo && dataForUpdate.hpNo !== userData.hpNo && (
                        <span className='valid-message'>
                            <TiTick className='valid-icon'/>Valid Phone Number
                        </span>
                    )}
                </p>
            </div>
            <div className="update-user-profile-button">
                <PrimaryButton 
                    text='Update Profile'
                    disabled={isFormIncomplete() || !!isAllValueValid()}
                    onClick={() => toggleConfirmUpdateProfile()}
                />
                <SecondaryButton 
                    text='Cancel'
                    onClick={onClose}
                />
            </div>
        </>
    )
}

export default UpdateUserProfileCard;