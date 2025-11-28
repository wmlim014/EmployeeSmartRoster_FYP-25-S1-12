import { useState } from 'react';
import { IoClose } from '../../../../public/Icons.js'; // Adjust the import path as needed
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { formatDateTime, formatDisplayDateTime, formatPhoneNumber } from '../../../controller/Variables.js';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';
import CreateOEditEmp from '../BO_CreateOEditEmp/CreateOEdit';
import BOEmployeeController from '../../../controller/BOEmployeeController.js';

import { HiOutlineIdentification,
         MdOutlineMailOutline,
         MdContactPhone,
         HiOutlineCalendarDateRange, } from '../../../../public/Icons.js'
import './UserDetail.css';
import '../../../../public/styles/common.css';

interface UserDetailProps {
  user?: any;
  role?: string;
  skillset?: string;
  onClose?: () => void;
  onEmpUpdate?: (updatedData: any) => void
}
const { inactiveOrActiveEmployee } = BOEmployeeController

const UserDetail = ({ user, role, skillset, onClose, onEmpUpdate }: UserDetailProps) => {
  // console.log(role)
  const { showAlert } = useAlert();
  const [ suspend, setSuspend ] = useState(false);

  const handleSuspendUser = async (isActive: number) => {
    try {
      const response = await inactiveOrActiveEmployee(user.user_id, isActive)
      // console.log(response)
      if (response.message === 'Employee status updated successfully') {
        const updatedUser = {
          ...user,
          activeOrInactive: isActive,
        };

        if (onEmpUpdate) 
          onEmpUpdate(updatedUser);

        if (onClose) 
          onClose();

        handleCancelSuspend()
      } else {
        showAlert(
          'User Detail: handleSuspendUser',
          `suspend user successfully ${user.email}`,
          ``,
          { type: 'success' }
        );
      }
    } catch (error) {
      showAlert(
        'User Detail: handleSuspendUser',
        `suspend user failed ${user.email}`,
        error instanceof Error ? error.message : String(error),
        { type: 'error' }
      );
    }
  };

  const handleCancelSuspend = () => {
    setSuspend(false);
  };

  if (suspend)
    return (
      <div className="App-popup" onClick={handleCancelSuspend}>
        <div className="App-popup-prompt-content suspend-user" onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="App-prompt-confirmation-title App-header">
              Confirm to&nbsp;
              { user.activeOrInactive === 1 
              ? "Suspend"
              : "Activate" } {user.fullName}
            </p>
          </div>
          <p>{user.email}</p>
          <div className="btns-grp">
          { user.activeOrInactive === 1 
              ? <PrimaryButton 
                  text="Confirm" 
                  onClick={() => handleSuspendUser(0)}
                />
              : <PrimaryButton 
                  text="Confirm" 
                  onClick={() => handleSuspendUser(1)}
                /> }
            
            <SecondaryButton 
              text="Cancel" 
              onClick={handleCancelSuspend}
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
      <div className="App-header">
        <h1>{user.fullName}</h1>
        <div className="suspend-btn">
          <CreateOEditEmp 
            isCreate={false}
            selectedEmpValues={user}
            onEmpUpdate={onEmpUpdate}
            onCloseDetail={onClose}
          />
          <button className="icons" onClick={onClose}>
            <IoClose />
          </button>
        </div>
      </div>
      <div className="App-popup-main-content">
        <div className="user-info">
          <h3>Personal Information</h3>
          <div className="user-info-data registered-pass">
            <p className="title">
              <HiOutlineIdentification className='App-popup-content-icon'/>
            </p>
            <p className="main-data">
              {user.resStatusPassType}&nbsp;&#x27A1;&nbsp;
              <strong>{user.nric}</strong>
            </p>
          </div>
          <div className="user-info-data email">
            <p className="title App-popup-content-icon">
              <MdOutlineMailOutline className='App-popup-content-icon'/>
            </p>
            <p className="main-data">{user.email}</p>
          </div>
          <div className="user-info-data hpNo">
            <p className="title App-popup-content-icon">
              <MdContactPhone className='App-popup-content-icon'/>
            </p>
            <p className="main-data">{formatPhoneNumber(String(user.hpNo))}</p>
          </div>
        </div>
        {/* Job and Position Information */}
        <div className="job-position-info">
          <h3>Job & Position Information</h3>
          <div className="job-position-info-data role">
            <p className="title">Role:</p>
            <p className="main-data">{role}</p>
          </div>
          <div className="job-position-info-data skillset">
            <p className="title">Skillset:</p>
            <p className="main-data">{skillset}</p>
          </div>
          <div className="job-position-info-data join-date">
            <p className="title">Date Joined:</p>
            <p className="main-data display-date">
              <HiOutlineCalendarDateRange className='App-popup-content-icon'/>
              {formatDisplayDateTime(user.dateJoined).split(' ')[0]}
            </p>
          </div>
        </div>
        {/* Account Information */}
        <div className="account-info">
          <div className="account-info-data account-status">
            <p className="title">Account Status:</p>
            <p className="main-data">
              { user.activeOrInactive === 1 
                ? "Activated"
                : "Suspended" }
            </p>
          </div>
          {/* <div className="account-info-data last-update">
            <p className="title">Last Update:</p>
            <div className="last-update-date-time">
              <p className="main-data display-date">
                <HiOutlineCalendarDateRange className='App-popup-content-icon'/>
                {formatDateTime(user.dateJoined).split(' ')[0]}
              </p>
              <p className="main-data display-date">
                <TiTime className='App-popup-content-icon'/>
                {formatDateTime(user.dateJoined).split(' ')[1]}
              </p>
            </div>
          </div> */}
        </div>
      </div>
      <div className="suspend-btn">
        {!user.isSuspended && (
          <SecondaryButton 
            text={ user.activeOrInactive === 1 
              ? "Suspend"
              : "Activate" } 
            onClick={() => setSuspend(true)}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetail;
