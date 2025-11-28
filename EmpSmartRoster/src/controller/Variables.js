import DOMPurify from 'dompurify';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s]+$/
export const PW_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
export const COMPANY_PHONE_PATTERN = /^[6]\d{7}$/ // Valid singapore virtual number starting with 6
export const PHONE_PATTERN = /^[89]\d{7}$/ // Valid singapore phone number starting with 8,9
export const NRIC_PATTERN = /^[A-Z][0-9]{7}[A-Z]$/ // Valid singapore work pass type common pattern
export const NO_DATA_MATCHED = "No Data Match with Filter...";

// Variables for calendar
export const TODAY = new Date();
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const YEAR_CHANGE = ['prevYear', 'nextYear'];

// ENUM in DB
export const USER_ROLE = ['System Admin', 'Business Owner', 'Employee']
export const TASK_STATUS = ['Not Started', 'In Progress', 'Completed'];
export const REG_STATUS = ["Pending", "Approved", "Rejected"];
export const SUB_PLAN = ['Free', 'Premium']
export const SUB_STATUS = ["Pending", "Completed", "Failed", "Cancelled", "Expired"];
export const PASS_TYPE = ['Singapore Citizen/PR', 'Employment Pass', 'S Pass', 'Work Permit', 'Other Work Pass'];
export const IS_ACC_SUSPENDED = ['Activated', 'Suspended'];
export const ISSUES_CATEGORY = ['Schedule Management', 'Attendance', 'Resources Allocation', 'Employee Management', 'Company Profile', 'Leave and MC Management']
export const ISSUES_LOG_STATUS = ['Pending Response', 'In Progress', 'Pending User', 'Response Resolved'];
export const LEAVE_TYPE = ['Vacation Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'MC'];
export const LEAVE_STATUS = ['Pending', 'Approved', 'Rejected', 'Cancelled']
export const SWAP_REQ_STATUS = ['Pending', 'Approved', 'Rejected', 'Cancelled']

// SG MOM Rules: last update on 20 Apr 2025
// MC: https://www.mom.gov.sg/employment-practices/leave/sick-leave/eligibility-and-entitlement
// Need to check everytime employee when login
// (EVERY MONTH +3 Until Max 6 months)
export const FIRST_3_MIN_MC =  5 // 1st 3 month Outpatient sick leave
export const FIRST_6_MIN_MC = 14 // 1st 6 month Outpatient sick leave 

// ANNUAL LEAVE: https://www.mom.gov.sg/employment-practices/leave/annual-leave/eligibility-and-entitlement
// (EVERY YEAR +1 until Max 8 Year)
export const MIN_YEAR1_ANNUAL = 7 // 1st year annual leave
export const MIN_YEAR8_ANNUAL = 14 // 8th and after that year annual leave

// Format Local date time to display
export function formatDisplayDateTime(isoString) {
    if(!isoString) return '';

    const isoStr = new Date (isoString).toISOString()
    const dateTime = isoStr.split('T')
    // 2025-05-08T21:09:00.000Z
    const date = dateTime[0].split('-');
    let time = dateTime[1].split('.')[0];
    time = time.split(':')

    const ampm = time[0] >= 12 ? 'PM' : 'AM';

    time[0] = time[0] % 12;
    time[0] = time[0] === 0 ? 12 : time[0]; // handle midnight

    return `${date[2]}/${date[1]}/${date[0]} ${time[0]}:${time[1]}${ampm}`;
}
// Format local ISO String date time to DD/MM/YYYY HH:mmtt
export function formatDateTime (isoString){
    if(!isoString) return '';
    
    const date = new Date(isoString);

    // Set Singapore timezone
    const sgDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

    const day = String(sgDate.getDate()).padStart(2, '0');
    const month = String(sgDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = sgDate.getFullYear();

    let hours = sgDate.getHours();
    const minutes = String(sgDate.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const formattedHours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${formattedHours}:${minutes}${ampm}`;
}

// convert ISO String to Local datetime in YYYY-MM-DDTHH:mm
export function generateSGDateTimeForDateTimeInput(date) {
    if(!date) return '';
    
    const sgDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

    const year = sgDate.getFullYear();
    const month = String(sgDate.getMonth() + 1).padStart(2, '0');
    const day = String(sgDate.getDate()).padStart(2, '0');
    const hours = String(sgDate.getHours()).padStart(2, '0');
    const minutes = String(sgDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
// Format [ "19/05/2025", "5:25PM" ] to `${year}-${monthMap[month]}-${day}T${hours}:${minutes}`
export function formatDateArrToDisplayInDateTimeInput (dateArr) {
    // Extract date and time from the array
    const [datePart, timePart] = dateArr;

    // Split date into day, month, and year
    const [day, month, year] = datePart.split('/');

    // Convert month abbreviation to numeric value
    const monthMap = {
        "01": "01", "02": "02", "03": "03", "04": "04", "05": "05", 
        "06": "06", "07": "07", "08": "08", "09": "09", "10": "10", 
        "11": "11", "12": "12"
    };

    // Split time and convert to 24-hour format
    let [time, period] = timePart.split(/(AM|PM)/i);
    let [hours, minutes] = time.trim().split(':');

    // Convert hours based on AM/PM
    if (period.toUpperCase() === "PM" && hours !== "12") {
        hours = String(parseInt(hours) + 12);
    } else if (period.toUpperCase() === "AM" && hours === "12") {
        hours = "00";
    }

    // Pad single-digit hours and minutes with leading zeros
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    // Return the formatted datetime string
    return `${year}-${monthMap[month]}-${day}T${hours}:${minutes}`;
}

export function generateSGDateTimeForPaymentRequestRef(date) {
    if(!date) return '';

    const sgDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

    const year = sgDate.getFullYear();
    const month = String(sgDate.getMonth() + 1).padStart(2, '0');
    const day = String(sgDate.getDate()).padStart(2, '0');
    const hours = String(sgDate.getHours()).padStart(2, '0');
    const minutes = String(sgDate.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}

// Utility function to format date only for MySchedules
export function formatMSDisplayDateTime(dateString) {
    if(!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    //const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

// PDF processor
export async function encodeFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // reader.result looks like: "data:application/pdf;base64,..."
            const base64String = reader.result.split(',')[1]; // remove prefix
            resolve(base64String);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function convertDateToSGTime (timeStamp) {
    const dateTime = new Date(timeStamp);
    dateTime.setHours(dateTime.getHours() - 2);
    return new Date(dateTime).toISOString().split('T');
}

export function formatPhoneNumber (phone) {
    // Remove all non-digit characters first 
    // and prevent user to input more than 8 number
    const cleaned = phone.replace(/\D/g, '').slice(0, 8);
    // Insert a space after every 4 digits
    return cleaned.length > 4 
        ? `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`
        : cleaned;
}

export function formatPosterCode (postCode) {
    // Remove all non-digit characters first 
    // and prevent user to input more than 6 number
    const cleaned = postCode.replace(/\D/g, '').slice(0, 6);
    // Insert a space after every 4 digits
    return cleaned;
}

export function formatNRIC (nric) {
    const raw = nric.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    let result = '';

    // 1st char: A-Z
    if (raw.length >= 1 && /[A-Z]/.test(raw[0])) {
        result += raw[0];
    }

    // Next 7 chars: only digits
    for (let i = 1; i <= 7 && raw.length > i; i++) {
        if (/\d/.test(raw[i])) {
            result += raw[i];
        }
    }

    // Last char: A-Z
    if (raw.length >= 9 && /[A-Z]/.test(raw[8])) {
        result += raw[8];
    }

    return result;
};

export function hideNRIC (nric) {
    const last4 = nric.slice(-4); // Get last 4 characters
    return last4.padStart(nric.length, '*'); // Fill the rest with *
}

export function formatKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')   // insert space before capital letters
        .replace(/^./, str => str.toUpperCase()); // capitalize first letter
}

export function formatTextForDisplay(text) {
    if (!text) return '';
    
    // 1. Convert newlines to <br>
    let formatted = String(text).replace(/\n/g, '<br/>');
    
    // 2. Auto-link URLs
    formatted = formatted.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // 3. Sanitize HTML
    return DOMPurify.sanitize(formatted);
}