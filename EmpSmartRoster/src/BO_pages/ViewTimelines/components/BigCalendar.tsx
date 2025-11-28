import React, { useMemo, useState } from 'react';
import moment from 'moment'
import 'moment-timezone'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import EventDetail from './TaskDetail/EventDetail';
import { TASK_STATUS } from '../../../controller/Variables.js';
import { FaChevronCircleLeft, FaChevronCircleRight } from '../../../../public/Icons.js'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TimelineCalendar.css';
import '../../../../public/styles/common.css';

// Set the Singapore time zone you want to use
moment.tz.setDefault('Asia/Singapore')
// Setup the localizer by providing the moment Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

interface ContinuousCalendarProps {
  tasks: any[];
  onTaskUpdate?: (updatedData: any) => void;
  onDelete?: (deletedTaskId: number) => void;
}
const MonthCalendar = ({ 
  tasks=[], 
  onTaskUpdate,
  onDelete, } : ContinuousCalendarProps) => {
  // console.log(tasks)
  const defaultDate = new Date();
  const [ selectedTask, setSelectedTask ] = useState<any[]>([]);
  const [ showTaskDetail, setShowTaskDetail ] = useState(false);
  
  const events = useMemo(() => (
    tasks.map(task => {
      // Convert Singapore-time-marked-as-UTC to actual local time
      const start = new Date(task.startDate.split(".")[0]);
      const end = new Date(task.endDate.split(".")[0]);
      
      return {
        ...task,
        title: task.title,
        startDate: start,
        endDate: end,
        allDay: false,
      };
    })
  ), [tasks]);
  // console.log(events)

  function triggerSelectedTask(task: any[]) {
      setSelectedTask(task);
      setShowTaskDetail(true);
  }

  function triggerCloseSelectedTask() {
      setSelectedTask([]);
      setShowTaskDetail(false);
  }

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    return (
      <div className="rbc-toolbar">
        <span className="today-month-select-btn">
          <span className="rbc-btn-group">
            <button onClick={() => toolbar.onNavigate('TODAY')}>Today</button>
          </span>
          
          <span className="rbc-btn-group">
            <button className='icon-button'
              onClick={() => toolbar.onNavigate('PREV')}>
              <FaChevronCircleLeft />
            </button>
            <span className="rbc-toolbar-label"><strong>{toolbar.label}</strong></span>
            <button  className='icon-button'
              onClick={() => toolbar.onNavigate('NEXT')}>
              <FaChevronCircleRight />
            </button>
          </span>
        </span>
        <span className="rbc-btn-group">
          <button 
            className={toolbar.view === Views.MONTH ? 'rbc-active' : ''}
            onClick={() => toolbar.onView(Views.MONTH)}
          >
            Month
          </button>
          <button 
            className={toolbar.view === Views.WEEK ? 'rbc-active' : ''}
            onClick={() => toolbar.onView(Views.WEEK)}
          >
            Week
          </button>
          <button 
            className={toolbar.view === Views.DAY ? 'rbc-active' : ''}
            onClick={() => toolbar.onView(Views.DAY)}
          >
            Day
          </button>
        </span>
      </div>
    );
  };

  // Custom event component
  const Event = ({ event }: any) => {
    return (
      <div className="custom-event" key={event.taskID}>
        <strong>{event.title}</strong>
        {event.fullName.length > 1 ? (
          <>
          {event.fullName.map((name:any, index:number) => (
            <div 
              key={index}
              className="event-resource"
            >
                {name || 'Unassigned'}
              </div>
          ))}
          </>
        ) : (
          <div className="event-resource">{event.fullName || 'Unassigned'}</div>
        )}
      </div>
    );
  };

  const CustomComponents: any = {
    toolbar: CustomToolbar,
    event: Event,
  }

  const { views } = useMemo(() => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
    }), []
  );

  return (
    <div className="timeline-management-container">
      <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="startDate"
        endAccessor="endDate"
        defaultDate={defaultDate}
        views={views}
        defaultView={Views.MONTH}
        components={CustomComponents}
        onSelectEvent={triggerSelectedTask}
        eventPropGetter={(event: any) => ({
          className: `event-style ${
            event.status === TASK_STATUS[1] ? 'in-progress' :
            event.status === TASK_STATUS[2] ? 'completed' :
            ''
          }`
        })}
      />
      </div>

      {showTaskDetail && selectedTask && (
          <EventDetail 
              task={selectedTask}
              allTasks={events}
              onDelete={onDelete}
              onClose={() => triggerCloseSelectedTask()}
          />
      )}
    </div>
  );
};

export default MonthCalendar;