import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../components/PromptAlert/AlertContext"; 
import { formatPhoneNumber, formatNRIC, PASS_TYPE,
         FIRST_3_MIN_MC, MIN_YEAR1_ANNUAL, formatKey } from '../../../controller/Variables.js';
import BOEmployeeController from "../../../controller/BOEmployeeController";
import UserController from '../../../controller/User/UserController';
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton/SecondaryButton";

import { IoArrowBack, IoClose, GoAlertFill, TiTick } from '../../../../public/Icons.js'
import "./CreateNEditEmp.css"
import "../../../../public/styles/common.css";

interface CreateOrEditEmpProps {
    isCreate: boolean;
    currentUser: any;
    defaultValues: any;
    allRoles: any;
    allSkillsets: any;
    empLength?: number;
    onEmpAdd?: (newEmp: any) => void;
    onEmpUpdate?: (updatedEmpData: any) => void;
    onCloseDetail?: () => void
    onClose: () => void
}

const { validateEmail, validatePhoneNo, validateNRICofFIN } = UserController;
const { validateEndWorkTime, createEmployee, editEmployee,
        getRoleIdForEmp, getRoleNameForEmp, getSkillNameForEmp } = BOEmployeeController

const CreateEditAccount = ({
    isCreate, currentUser, defaultValues, 
    allRoles, allSkillsets, empLength = 0, 
    onEmpUpdate, onEmpAdd, onCloseDetail, onClose}: CreateOrEditEmpProps) => {
    // console.log("Default Value", defaultValues)
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ selectedRoleSkillset, setSelectedRoleSkillset ] = useState<any>([])
    const isMobile = window.innerWidth <= 768;
    const [ employeeData, setEmployeeData ] = useState({
        email: '',
        nric: '',
        hpNo: '',
        fullName: '',
        resStatusPassType: '',
        roleID: '',
        skillSetID: '',
        startWorkTime: '',
        endWorkTime: '',
        daysOfWork: '',
        noOfLeave: '',
        noOfMC: '',
        dateJoined: ''
    });
    const [ errors, setErrors ] = useState<{ 
        email?: string; 
        nricOfin?: string; 
        hpNo?:string;
        endWorkTime?:string;
    }>({})

    useEffect(() => {
        let updatedValues = { ...defaultValues };
        // console.log(updatedValues)
        if(!isCreate){
            const phoneStr = String(defaultValues.hpNo)
            updatedValues.hpNo = formatPhoneNumber(phoneStr)
            
            const role = getRoleNameForEmp(allRoles, updatedValues.roleID)
            updatedValues.roleID = role[0].roleName

            const skillset = getSkillNameForEmp(allSkillsets, updatedValues.skillSetID)
            updatedValues.skillSetID = skillset[0].skillSetName

            updatedValues.dateJoined = updatedValues.dateJoined.split('T')[0]
        }
        handleFindSkillToSelectedRole(updatedValues.roleID)
        setEmployeeData(updatedValues)
    }, [defaultValues, allRoles, allSkillsets])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'hpNo'){
            const formattedPhoneNumber = formatPhoneNumber(value)
            setEmployeeData((prevData) => ({
                ...prevData,
                hpNo: formattedPhoneNumber,
            }));
        } else if (name === 'nric'){
            const formattedNRIC = formatNRIC(value)
            setEmployeeData((prevData) => ({
                ...prevData,
                [name]: formattedNRIC,
            }));
        } else if (name === 'roleID' || name === 'skillSetID'){
            if(name === 'roleID') {
                const skillsetsToRole = handleFindSkillToSelectedRole(value)
                setEmployeeData((prevData) => ({
                    ...prevData,
                    skillSetID: String(skillsetsToRole[0].skillSetName),
                }));
            }
            setEmployeeData((prevData) => ({
                ...prevData,
                [name]: String(value),
            }));
        } else {
            setEmployeeData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    // useEffect(() => { console.log(employeeData) }, [employeeData])

    function handleFindSkillToSelectedRole(value: string) {
        // console.log(value)
        const role = getRoleIdForEmp(allRoles, value)
        // console.log(role)
        const filteredSkillsets = allSkillsets.filter((skillset: any) => {
            return skillset.roleID === role[0].roleID
        })
        // console.log(filteredSkillsets)
        setSelectedRoleSkillset(filteredSkillsets)
        return filteredSkillsets
    }

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
    
    const triggerNricOFinValidation = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Format the nric
        const formattedNRIC = formatNRIC(event.target.value);
        handleInputChange(event)

        const error = validateNRICofFIN(formattedNRIC)
        setErrors(prev => ({
            ...prev,
            nric: error
        }))
    }

    const triggerIsStartTimeBeforeEndTime = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleInputChange(event)
        const { startWorkTime, endWorkTime } = employeeData;

        const error = validateEndWorkTime(startWorkTime, endWorkTime)
        setErrors(prev => ({
            ...prev,
            endWorkTime: error
        }))
    };

    // Check if create/edit employee form
    const isFormIncomplete = () => {
        const requiredFields: (keyof typeof employeeData)[] = [
            'fullName',
            'email',
            'nric',
            'hpNo',
            'resStatusPassType',
            'roleID',
            'skillSetID',
            'startWorkTime',
            'endWorkTime',
            'daysOfWork',
            'dateJoined'
        ];
        
        return requiredFields.some(field => !employeeData[field]);
    };
    // console.log("isFormIncomplete?", isFormIncomplete(), employeeData);

    const isAllValueValid = () => {
        const validValues: (keyof typeof errors)[] = [
            'email',
            'nricOfin',
            'hpNo',
            'endWorkTime'
        ]

        return validValues.some(field => errors[field]);
    }

    function allowedToAddEmp() {
        if(currentUser?.isSubsExp === 1 && empLength >= 5){
            return false
        }
        return true
    }

    const triggerCreateEmpAcc = async() => {
        try{
            const response = await createEmployee(currentUser?.UID, employeeData, allRoles, allSkillsets)
            // console.log(response)
            if(response.response.message === "Employee added successfully"){
                if(onEmpAdd)
                    onEmpAdd(response.empData)

                if(!isMobile && onClose){
                    toggleConfirmation()
                    onClose()
                }
                else{
                    toggleConfirmation()
                    navigate('/users-management')
                }
                showAlert(
                    "Employee Account Created Successfully",
                    `${employeeData.email} : ${employeeData.fullName}`,
                    ``,
                    { type: 'success' }
                );
            } else {
                showAlert(
                    "Failed to Create Employee Account",
                    `${employeeData.email} is registered before`,
                    ``,
                    { type: 'error' }
                );
            }
        } catch(error) {
            showAlert(
                "triggerCreateEmpAcc",
                `Failed to Create Employee for "${employeeData.email}"`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const triggerUpdateEmpAcc = async() => {
        try{
            const response = await editEmployee(currentUser?.UID, defaultValues, employeeData, allRoles, allSkillsets)
            // console.log(response)
            if(response.response.message === "Employee updated successfully"){
                showAlert(
                    "Employee Information Update Successfully",
                    `${defaultValues.email} : ${defaultValues.fullName}`,
                    ``,
                    { type: 'success' }
                );

                if(onEmpUpdate)
                    onEmpUpdate(response.empData); // Update Locally from Controller response

                if(!isMobile && onClose && onCloseDetail){
                    toggleConfirmation()
                    onCloseDetail()
                    onClose()
                }
                else{
                    toggleConfirmation()
                    navigate('/users-management')
                }
            }
        } catch(error) {
            showAlert(
                "triggerUpdateEmpAcc",
                `Failed to Update Employee for "${employeeData.email}"`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Prompt user confirmation for update
    function toggleConfirmation () {
        setShowConfirmation(!showConfirmation)
    }

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                {isCreate ? (
                    <>
                    <h3 className="App-prompt-confirmation-title App-header">
                        Confirm The {employeeData.fullName}'s Information
                    </h3>

                    <span className='warning-message warining-message-in-confirmatiom-prompt'>
                        <div className="title">
                            <GoAlertFill />
                            <strong>Default Password is Set As</strong> 
                        </div>
                        <span className='warning-message-text create-emp-warning-message-text'>
                            [Name Initials in UPPERCASE] + 
                            [Last 4 digits of your mobile number] + 
                            _[First 3 characters of your NRIC in lowercase]
                        </span>
                        <span className='warning-message-text'>
                            <strong>Example: </strong>
                            If the employee's name is <b>Alice Tan</b>, mobile number is <b>9123 4567</b>, and NRIC is <b>S1234567D</b>, <br/>
                            Then the default password is: <b>AT4567_s12</b>
                        </span>
                    </span>
                    </>
                ) : (
                    <>
                    <h3 className="App-prompt-confirmation-title App-header">
                        Confirm Update {employeeData.fullName}'s Information
                    </h3>
                    </>
                )}

                <div className="all-create-employee-data">
                    <div className="create-employee-confirmation-detail">
                        <p className="title">Email</p>
                        <p className="main-data">{employeeData.email}</p>
                    </div>
                    <div className="create-employee-confirmation-detail odd-row">
                        <p className="title">NRIC</p>
                        <p className="main-data">{employeeData.nric}</p>
                    </div>
                    <div className="create-employee-confirmation-detail">
                        <p className="title">Regs.Pass Type</p>
                        <p className="main-data">{employeeData.resStatusPassType}</p>
                    </div>
                    <div className="create-employee-confirmation-detail odd-row">
                        <p className="title">Role</p>
                        <p className="main-data">{employeeData.roleID}</p>
                    </div>
                    <div className="create-employee-confirmation-detail">
                        <p className="title">Skillset</p>
                        <p className="main-data">{employeeData.skillSetID}</p>
                    </div>
                    <div className="create-employee-confirmation-detail odd-row">
                        <p className="title">Working Hours</p>
                        <p className="main-data">
                            {employeeData.startWorkTime} ~ {employeeData.endWorkTime} &nbsp;
                            ({employeeData.daysOfWork} days per weeks)
                        </p>
                    </div>
                    <div className="create-employee-confirmation-detail">
                        <p className="title">No. Of Leave</p>
                        <p className="main-data">
                            {employeeData.noOfLeave} annual leaves ; &nbsp;
                            {employeeData.noOfMC} MCs
                        </p>
                    </div>
                </div>
                <div className="btns-grp">
                    {!allowedToAddEmp() && (
                        <div className="error-reach-user-limit-container">
                            <span className='error-message'>
                                <GoAlertFill /> 
                                <span className='error-message-text error-reach-user-limit'>
                                    Free plan limit (5 employees)
                                </span>
                            </span>  
                            <button
                                className="error-message error-reach-user-limit-button"
                                onClick={() => navigate("/subscription-management")}
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    )}
                    {allowedToAddEmp() && isCreate && ( // Create new emp
                        <PrimaryButton 
                            text="Confirm" 
                            disabled={!allowedToAddEmp()}
                            onClick={() => triggerCreateEmpAcc()}
                        />
                    )}
                    {!isCreate && ( // Edit emp
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerUpdateEmpAcc()}
                        />
                    )}
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className={isMobile ? "mobile-create-emp-content" : "App-popup-content create-edit-emp-content"} onClick={(e) => e.stopPropagation()}>
            <div className='App-header'>
                {isMobile ? (
                    <>
                        <IoArrowBack 
                            onClick={() => navigate(-1)}
                            className="icons"
                        />
                        {isCreate ? (
                            <h1>Create New Employee Account</h1>
                        ):(
                            <h1>Edit Employee Information</h1>
                        )}
                    </>
                ) : (
                    <>
                        {isCreate ? (
                            <h1>Create New Employee Account</h1>
                        ) : (
                            <h1>Edit Employee Information</h1>
                        )}
                        <IoClose className="icons" onClick={onClose}/>
                    </>
                )}
            </div>
            
            {allRoles.length === 0 || allSkillsets.length === 0 ? (
                <span className='warning-message warining-message-in-confirmatiom-prompt'>
                    <div className="title">
                        <GoAlertFill />
                        <strong>Missing Skillset or Role: </strong> 
                    </div>
                    <span className='warning-message-text'>
                        Please go to <b>Company &gt; My Company</b>
                    </span>
                </span>
            ) : null}

            <div className="create-employee-form">
                <div className="create-emp-left">
                    {/* Input Employee Name */}
                    <div className='forms-input'>
                        <strong>
                            Name <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='text' 
                                name='fullName'
                                placeholder='Employee Name' 
                                value={employeeData.fullName}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />
                        </div>
                    </div>
                    {/* Input Email */}
                    <div className='forms-input'>
                        <strong>
                            Employee Email <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='email' 
                                name='email'
                                value={employeeData.email}
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
                            {!errors.email && employeeData.email && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>
                                    <span>Valid Email</span>
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Input HpNo */}
                    <div className='forms-input'>
                        <strong>
                            H/P No <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='tel' 
                                name='hpNo'
                                placeholder='8123 4567' 
                                value={formatPhoneNumber(String(employeeData.hpNo))}
                                onChange={(e) => triggerPhoneValidation(e)}
                                // onBlur={() => handlePhoneInput(hpNo)}
                                required
                            />
                            {errors.hpNo && (
                                <span className='error-message'>
                                    <GoAlertFill /> 
                                    <span className='error-message-text'>{errors.hpNo}</span>
                                </span>
                            )}
                            {!errors.hpNo && employeeData.hpNo && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>Valid Phone Number
                                </span>
                            )}
                        </div>
                    </div>
                    {/* NRIC */}
                    <div className='forms-input'>
                        <strong>
                            NRIC/FIN <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='text'
                                name='nric'
                                placeholder='M1234567Y' 
                                value={employeeData.nric}
                                onChange={(e) => triggerNricOFinValidation(e)}
                                required
                            />
                            {errors.nricOfin && (
                                <span className='error-message'>
                                    <GoAlertFill /> 
                                    <span className='error-message-text'>{employeeData.nric}</span>
                                </span>
                            )}
                            {!errors.nricOfin && employeeData.nric && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>Valid NRIC/FIN Format
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Radio Button: Registered pass type */}
                    <div className="radio-button-group">
                        <strong>
                            Reg. Pass Type <span style={{ color: 'red' }}>*</span>
                        </strong>
                        {PASS_TYPE.map((passType:string) => (
                            <label className="App-radio-option" key={passType}>
                                {passType}
                                <input 
                                    type='radio'
                                    name='resStatusPassType'
                                    value={passType} // use the passType as value
                                    checked={employeeData.resStatusPassType === passType}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />
                                <span className="checkmark"></span>
                            </label>
                        ))}
                    </div>
                    {/* Input Employee Date */}
                    <div className='forms-input'>
                        <strong>
                            Date Joined <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='date' 
                                name='dateJoined' 
                                value={employeeData.dateJoined}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!isCreate}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="create-emp-right">
                    {/* Role */}
                    <div className='forms-input'>
                        <strong>
                            Role <span style={{ color: 'red' }}>*</span>
                        </strong>
                        {/* Role dropdown */}
                        <select 
                            name="roleID"
                            value={employeeData.roleID}
                            onChange={(e) => handleInputChange(e)}
                        >
                            {allRoles.map((role:any) => (
                            <option key={role.roleID} value={role.roleName}>
                                {role.roleName}
                            </option>
                            ))}
                        </select>
                    </div>
                    {/* Skillsets */}
                    {selectedRoleSkillset && (
                        <div className='forms-input'>
                            <strong>
                                Skillsets <span style={{ color: 'red' }}>*</span>
                            </strong>
                            {/* Skillsets dropdown */}
                            <select 
                                name="skillSetID"
                                value={employeeData.skillSetID}
                                onChange={(e) => handleInputChange(e)}
                            >
                                {selectedRoleSkillset.map((skill:any) => (
                                <option key={skill.skillSetID} value={skill.skillSetName}>
                                    {skill.skillSetName}
                                </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/* Start Working Time */}
                    <div className='forms-input'>
                        <strong>
                            Start Working Time <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='time'
                            name='startWorkTime'
                            value={employeeData.startWorkTime}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                    {/* End Working Time */}
                    <div className='forms-input'>
                        <strong>
                            End Working Time <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='time'
                            name='endWorkTime'
                            value={employeeData.endWorkTime}
                            onChange={(e) => triggerIsStartTimeBeforeEndTime(e)}
                            min={employeeData.startWorkTime}
                            required
                        />
                        {errors.endWorkTime && (
                            <span className='error-message'>
                                <GoAlertFill /> 
                                <span className='error-message-text'>{errors.endWorkTime}</span>
                            </span>
                        )}
                        {!errors.endWorkTime && employeeData.endWorkTime && (
                            <span className='valid-message'>
                                <TiTick className='valid-icon'/>Valid End Work Time
                            </span>
                        )}
                    </div>
                    {/* Days Of Work */}
                    <div className='forms-input'>
                        <strong>
                            No. of Working Days <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='number'
                            name='daysOfWork'
                            value={employeeData.daysOfWork}
                            onChange={(e) => handleInputChange(e)}
                            min="1"
                            max="7"
                            required
                        />
                    </div>
                    {/* No. of Annual Leave */}
                    <div className='forms-input'>
                        <strong>
                            No. of Annual Leave <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='number'
                            name='noOfLeave'
                            value={employeeData.noOfLeave}
                            onChange={(e) => handleInputChange(e)}
                            min={MIN_YEAR1_ANNUAL}
                            required
                        />
                    </div>
                    {/* No. of MC */}
                    <div className='forms-input'>
                        <strong>
                            No. of Outpatient Leave (MC) <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='number'
                            name='noOfMC'
                            value={employeeData.noOfMC}
                            onChange={(e) => handleInputChange(e)}
                            min={FIRST_3_MIN_MC}
                            required
                        />
                    </div>
                    <div className="create-edit-emp-button">
                        {isCreate ? (
                            <PrimaryButton 
                                text="Create Employee"
                                disabled= {isFormIncomplete() || !!isAllValueValid()}
                                onClick={() => toggleConfirmation()}
                            />
                        ) : (
                            <PrimaryButton 
                                text="Update Information"
                                disabled= {isFormIncomplete() || !!isAllValueValid()}
                                onClick={() => toggleConfirmation()}
                            /> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditAccount;