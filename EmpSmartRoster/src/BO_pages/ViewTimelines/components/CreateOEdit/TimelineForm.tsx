import { useState, useEffect } from "react";
import { useAlert } from "../../../../components/PromptAlert/AlertContext";
import PrimaryButton from "../../../../components/PrimaryButton/PrimaryButton";
import TimelineController from "../../../../controller/TimelineController";

import { IoClose, FaPlusCircle } from '../../../../../public/Icons.js'
import './CreateNEditTask.css'
import '../../../../../public/styles/common.css'

interface TimelineFormProps {
    isCreateTask: boolean;
    isTaskCreated: boolean;
    defaultValues: any;
    bo_UID: any;
    newTimelineValue: (timelineValue: any) => void;
}

const { createNewTimeline, getTimelines, getTimelineSelected,
        isSameTimelineCreated } = TimelineController

const TimelineForm = ({ 
    isCreateTask, isTaskCreated, defaultValues, bo_UID, newTimelineValue
}: TimelineFormProps) => {
    // console.log(defaultValues)
    const { showAlert } = useAlert()
    const [ isCreateTimeline, setIsCreateTimeline ] = useState(false)
    const [ allTimelines, setAllTimelines ] = useState<any>([])
    const [ newTimelines, setNewTimeline ] = useState<any>({
        title: '',
        timeLineDescription: '',
    })
    const [ timelineValue, setTimelineValues ] = useState({
        timeLineID: '',
        title: '',
        timeLineDescription: '',
    })
    useEffect(() => {
        setTimelineValues(defaultValues)
        if(newTimelineValue)
            newTimelineValue(defaultValues)
    }, [defaultValues, !isCreateTask])

    const handleInputChange = (event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = event.target;
        setNewTimeline((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const triggerFetchAllTimelines = async() => {
        try {
            // console.log(defaultValues)
            let response = await getTimelines(bo_UID);
            if (response.message === 'Timeline retrieved successfully.'){
                response = response.timeline || [];
                // console.log(response)
                setAllTimelines(response)
                if(isCreateTask){
                    if(response.length > 0) {
                        setTimelineValues(response[0]) //Set 1st selected timeline
                    }
                    if(newTimelineValue)
                        newTimelineValue(response[0])
                }
            }
        } catch(error) {
            showAlert(
                "triggerFetchAllTimelines",
                `Failed to Fetch All Timelines`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {triggerFetchAllTimelines()}, [bo_UID])

    const handleSelectedTimeline = (timeLineID: any) => {
        // console.log(timeLineID)
        const timelineMatch = getTimelineSelected(allTimelines, timeLineID)
        // console.log(timelineMatch)
        if (timelineMatch) {
            const value = {
                timeLineID: timelineMatch.timeLineID,
                title: timelineMatch.timelineTitle,
                timeLineDescription: timelineMatch.timeLineDescription,
            }
            // console.log(value)
            setTimelineValues(value)
            if(newTimelineValue)
                newTimelineValue(value)
        }
    }

    const triggerCreateTimeline = async() => {
        let isCreated = isSameTimelineCreated(allTimelines, newTimelines.title)
        isCreated = isCreated || []
        if (isCreated.length === 0) {
            try {
                let response = await createNewTimeline(bo_UID, newTimelines)
                // console.log(response)
                // Return: message, timeLineID
                if(response.message === 'Timeline created successfully') {
                    const newData = {
                        ...newTimelines,
                        timeLineID: response.timelineID
                    }
                    // console.log(newData)
                    // Make sure the key and value is aligned to other timeline object
                    const alignTimelinesValue =  {
                        timeLineID: newData.timeLineID,
                        business_owner_id: bo_UID,
                        timelineTitle: newData.title,
                        createdAt: new Date(),
                        lastModifiedAt: null,
                        isCompleted: 0
                    }
                    // console.log(alignTimelinesValue)
                    // Update all timeline value locally
                    setAllTimelines([
                        ...allTimelines,
                        alignTimelinesValue
                    ])
                    if(newTimelineValue)
                        newTimelineValue(newData)

                    setTimelineValues({
                        timeLineID: newData.timeLineID,
                        title: newData.title,
                        timeLineDescription: newData.timeLineDescription,
                    })
                    toggleisCreateTimeline()
                } else {
                    showAlert(
                        "triggerCreateTimeline",
                        `Failed to Create Timeline for "${timelineValue.title}"`,
                        `${response.body}`,
                        { type: 'error' }
                    );
                }
            } catch(error) {
                showAlert(
                    "triggerCreateTimeline",
                    `Failed to Create Timeline for "${timelineValue.title}"`,
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        } else {
            showAlert(
                "Create Timeline Failed",
                `Failed to Create Timeline`,
                `"${timelineValue.title}" is created before`,
                { type: 'error' }
            );
        }
    }

    function toggleisCreateTimeline() {
        setIsCreateTimeline(!isCreateTimeline)
        setNewTimeline({
            timeLineID: '',
            title: '',
            timeLineDescription: '',
        })
    }

    if(isCreateTimeline) return (
        <div className="App-popup" onClick={toggleisCreateTimeline}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className='App-header'>
                    <h1>Create New Timeline</h1>
                    <IoClose 
                        className="icons"
                        onClick={toggleisCreateTimeline}
                    />
                </div>
                <div className="App-popup-main-content">
                    {/* Input Timeline Title */}
                    <div className='forms-input'>
                        <strong>
                            Timeline Title <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='text' 
                            name='title'
                            placeholder='Timeline Title' 
                            value={newTimelines.title}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                    {/* Input Task Description */}
                    <div className='forms-input'>
                        <strong>
                            Timeline Description <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <textarea name='timeLineDescription'
                            rows={4}
                            placeholder='Timeline Description' 
                            value={newTimelines.timeLineDescription}
                            onChange={(e) => handleInputChange(e)}
                            maxLength={500}
                            required
                        />
                    </div>
                    <PrimaryButton 
                        text="Create Timeline"
                        disabled={!newTimelines.title
                                    || !newTimelines.timeLineDescription}
                        onClick={() => triggerCreateTimeline()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="timeline-creation-form card">
            {/* Available Timeline */}
            <div className='forms-input'>
                <strong className="select-available-timeline-title">
                    {isCreateTask ? ( 
                        <>
                            Select Available Timeline
                            <FaPlusCircle 
                                className="create-new-timeline-icon"
                                onClick={toggleisCreateTimeline}
                            />
                        </> 
                    ) : ( <>Task Allocated In: </> )
                    } 
                    
                </strong>
                <div className="fields">
                    {/* Timeline dropdown */}
                    <select 
                        id="selectTimeline"
                        name="timelineValue"
                        value={timelineValue.timeLineID}
                        onChange={(e) => handleSelectedTimeline(e.target.value)}
                        disabled={!isCreateTask || isTaskCreated}
                    >
                        {allTimelines.map((timeline:any) => (
                        <option key={timeline.timeLineID} value={timeline.timeLineID}>
                            {timeline.timelineTitle}
                        </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default TimelineForm