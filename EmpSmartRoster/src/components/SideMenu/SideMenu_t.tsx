import { useAuth } from "../../AuthContext";
import { USER_ROLE } from "../../controller/Variables";
import { BsShopWindow } from "react-icons/bs";
import { MdOutlineBugReport, MdFiberSmartRecord } from "react-icons/md";
import { LuUserCog } from "react-icons/lu";
import { GrSchedules } from "react-icons/gr";
import { FaHeartCircleExclamation, FaUsersViewfinder } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

import Menu from "./Menu";

export const SA_Items = [
    {
        name: 'user',
        label: 'USER MANAGEMENT',
        src: <LuUserCog className="menu-icon"/>,
        items: [
            {
                name: 'userManagement',
                label: 'BUSINESS OWNER MANAGEMENT',
                navHref: '/users-management',
            },
            {
                name: 'userRegReq',
                label: 'Registration Request Management',
                navHref: '/registration-req-management',
            },
            {
                name: 'subsTrans',
                label: 'View Subscription Transactions',
                navHref: '/view-subs-transactions',
            }
        ]
    },
    // {
    //     name: 'issue',
    //     label: 'ISSUES REPORTED',
    //     navHref: '/issues-reported',
    //     src: <MdOutlineBugReport className="menu-icon"/>,
    // },
    {
        name: 'landing',
        label: 'LANDING PAGE MANAGEMENT',
        src: <BsShopWindow className="menu-icon"/>,
        items: [
            {
                name: 'landingDemoVideo',
                label: 'Demo Video Management',
                navHref: '/video-management'
            },

            {
                name: 'EditSubscription',
                label: 'Subscription Plans',
                navHref: '/edit-subscription'
            },
            {
                name: 'landingReview',
                label: 'Reviews & Ratings',
                navHref: '/view-review-n-rating'
            },
            {
                name: 'landingFAQ',
                label: 'FAQs Management',
                navHref: '/faqs-management'
            },
            {
                name: 'landingPreview',
                label: 'Preview Landing Page',
                navHref: '/preview-landing-page'
            },
        ]
    },
]

export const BO_Items = [
        {
            name: 'user',
            label: 'COMPANY',
            src: <FaRegBuilding className="menu-icon"/>,
            items: [
                {
                    name: 'companyProfile',
                    label: 'My Company',
                    navHref: '/company-detail',
                },
                {
                    name: 'subscriptionManagement',
                    label: 'Subscription Management',
                    navHref: '/subscription-management',
                }
            ]
        },
        {
            name: 'timelineManagement',
            label: 'TIMELINE MANAGEMENT',
            navHref: '/timeline-management',
            src: <GrSchedules className="menu-icon"/>,
        },
        {
            name: 'employee',
            label: 'MY EMPLOYEE',
            src: <FaUsersViewfinder className="menu-icon"/>,
            items: [
                {
                    name: 'employeeManagement',
                    label: 'Employee Management',
                    navHref: '/users-management'
                },
                {
                    name: 'attendanceRecords',
                    label: 'Attendance Records',
                    navHref: '/view-employee-attendance-record'
                },
                {
                    name: 'leaveManagement',
                    label: 'Leave Management',
                    navHref: '/leave-n-mc-management'
                },
            ]
        },
        // {
        //     name: 'reportIssues',
        //     label: 'REPORT ISSUES',
        //     navHref: '/report-issues',
        //     src: <MdOutlineBugReport className="menu-icon"/>,
        // },
        {
            name: 'reviwRating',
            label: 'REVIEW & RATING MANAGEMENT',
            navHref: '/review-n-rating-management',
            src: <CiStar className="menu-icon"/>,
        },
]

export const EMP_Items = [
    // {
    //     name: 'mySchedule',
    //     label: 'MY SCHEDULES',
    //     navHref: '/my-schedule',
    //     src: <GrSchedules className="menu-icon"/>,
    // },
    {
        name: 'attendanceRecord',
        label: 'ATTENDANCE RECORD',
        navHref: '/view-attendance-record',
        src: <MdFiberSmartRecord className="menu-icon"/>,
        // items: [
        //     // {
        //     //     name: 'mySchedule',
        //     //     label: 'My Schedules',
        //     //     navHref: '/my-schedule',
        //     // },
        //     {
        //     name: 'attendanceRecord',
        //     label: 'Attendance Record',
        //     navHref: '/view-attendance-record',
        //     },
        //     // {
        //     // name: 'swapTime',
        //     // label: 'Swap Time Management',
        //     // navHref: '/swap-time-management',
        //     // },
        // ]
    },
    {
        name: 'leaveManagement',
        label: 'LEAVE MANAGEMENT',
        navHref: '/my-leave-management',
        src: <FaHeartCircleExclamation className="menu-icon"/>,
    },
    // {
    //     name: 'reportIssues',
    //     label: 'REPORT ISSUES',
    //     navHref: '/report-issues',
    //     src: <MdOutlineBugReport className="menu-icon"/>,
    // },
]

const SideMenu_t = () => {
    const { user } = useAuth();
    
    return (
        <>
        {user?.role === USER_ROLE[0] && (
            <Menu menuItems={SA_Items} responsive="desktop" />
        )}
        {user?.role === USER_ROLE[1] && (
            <Menu menuItems={BO_Items} responsive="desktop" />
        )}
        {user?.role === USER_ROLE[2] && (
            <Menu menuItems={EMP_Items} responsive="desktop" />
        )}
        </>
    );
};

export default SideMenu_t;