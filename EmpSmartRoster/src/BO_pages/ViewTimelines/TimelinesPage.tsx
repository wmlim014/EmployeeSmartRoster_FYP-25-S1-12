import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import TimelineController from '../../controller/TimelineController'
import CreateOEditTask from './components/CreateOEdit/CreateOEdit'
// import MonthCalendar from '../../components/Timelines/NotUsed/MonthCalendar'
import MonthCalendar from './components/BigCalendar'

import { FcGoogle } from '../../../public/Icons.js'
import './TimelinesPage.css'
import '../../../public/styles/common.css'

const { getAllTasks,googleCalendarGetAuth,googleCalendarSync } = TimelineController

const BOTimelinesPage = () => {
    const { user } = useAuth();
    // console.log("BOTimelinesPage: \n", user)
    const { showAlert } = useAlert();
    const [ allTasks, setAllTasks ] = useState<any>([]);

    const fetchTasksData = async () => {
        try {
            let data = await getAllTasks(user?.UID)
            data = data.sortedTimeline || [];
            // console.log(data)
            setAllTasks(data);
        } catch(error) {
            showAlert(
                "fetchTasksData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Auto trigger when allRegisRequest length change
    useEffect(() => { 
        fetchTasksData();
    }, [allTasks.length]); 
    
    //check url everytime timeline-management is loaded for code 
    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

        if (code) {
            console.log("OAuth Code detected in URL:", code);

            const syncGoogleCalendar = async () => {
                try {
                    const result = await googleCalendarSync({ code, business_owner_id: user?.UID });
                    console.log("Google Calendar Synced:", result);

                    showAlert(
                        "Google Calendar",
                        "Sync Successful",
                        "Your calendar has been connected!",
                        { type: 'success' }
                    );
                } catch (error) {
                    console.error("Google Calendar sync failed", error);
                    showAlert(
                        "Google Calendar",
                        "Sync Failed",
                        error instanceof Error ? error.message : "An unknown error occurred.",
                        { type: 'error' }
                    );
                } finally {
                    
                    const cleanUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            };

            syncGoogleCalendar();
        }
    }, []);

    const handleDeleteTask = async (taskID: number) => {
        // console.log(taskID)
        setAllTasks((prev:any) => 
            prev.filter((task:any) => 
                task.taskID !== taskID
        ));
    }
    const handleConnectGoogleCalendar = async () => {
        try {
            const { authUrl } = await googleCalendarGetAuth();
            console.log("authURL:",authUrl);
            window.location.href = authUrl;

        } catch (error) {
            showAlert(
                "Google Calendar Auth",
                "Failed to get auth URL",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    };
    
    return (
        <div className="App-content">
            <div className="content">
                <div className="timeline-header">
                    <h1>Timeline Management</h1>
                    
                    <CreateOEditTask 
                        isCreate={true}
                    />
                    <button 
                        className='sync-google-calendar-button primary-button'
                        onClick={handleConnectGoogleCalendar} 
                        style={{ marginRight: '1rem' }}
                    >
                        <FcGoogle className='google-calenar-icon'/>Sync My Schedule 
                    </button>
                </div>
                <MonthCalendar 
                    tasks={allTasks} 
                    onDelete={handleDeleteTask}
                />
            </div>
        </div>
    )
}

export default BOTimelinesPage