import { useState, useEffect, useRef, useMemo } from 'react'
import { TODAY, DAYS_OF_WEEK, MONTHS, YEAR_CHANGE } from '../../../../controller/Variables.js';
import CalendarHeader from './CalendarHeader.js';
import EventDetail from '../TaskDetail/EventDetail.js';

import '../index.css'
import '../../../../../public/styles/common.css'


const TASK_STATUS = ['Not Started', 'In Progress', 'Completed'];

interface ContinuousCalendarProps {
    tasks: any[];
    onClick?: (_day:number, _month: number, _year: number) => void;
}
const MonthCalendar: React.FC<ContinuousCalendarProps> = ({ tasks=[], onClick }) => {
    // console.log(tasks)
    const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [ year, setYear ] = useState<number>(TODAY.getFullYear());
    const [ selectedMonth, setSelectedMonth ] = useState<number>(TODAY.getMonth());
    const [ selectedTask, setSelectedTask ] = useState<any[]>([]);
    const [ showTaskDetail, setShowTaskDetail ] = useState(false);

    const calendarContainerRef = useRef<HTMLDivElement>(null);
    
    // Create month options for dropdown
    const monthOptions = useMemo(() => {
        return MONTHS.map((month, index) => ({
            name: month,
            value: index.toString() // Store as string but keep the numeric index
        }));
    }, []);

    // Preprocessing for task mapping
    const taskMap = useMemo(() => {
        const map = new Map<string, any[]>();
        if(!tasks) return map;

        tasks.forEach(task => {
            const taskDate = new Date(task.taskDate);
            // Subtract 2 hours (7200 seconds in milliseconds)
            taskDate.setHours(taskDate.getHours() - 2);
            const dateKey = new Date(taskDate).toISOString().split('T')[0];
            if (!map.has(dateKey))
                map.set(dateKey, []);
            map.get(dateKey)!.push(task);
        });
        // console.log(map)
        return map
    }, [tasks])

    // Enable the scolling for calendar
    const scrollToDay = (monthIndex: number, dayIndex: number) => {
        if (!calendarContainerRef.current) return;

        const targetDayIndex = dayRefs.current.findIndex(
            (ref) => ref && 
                parseInt(ref.getAttribute('data-month')!) === monthIndex && 
                parseInt(ref.getAttribute('data-day')!) === dayIndex
        );

        const targetElement = dayRefs.current[targetDayIndex];
        if (!targetElement) return;

        const container = calendarContainerRef.current;
        const elementRect = targetElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate position to center the element
        const offset = elementRect.top - containerRect.top - (containerRect.height / 3);
        
        container.scrollTo({
            top: container.scrollTop + offset,
            behavior: 'smooth',
        });
    };
    
    // Change year
    function triggerYearChange (changeString: string){
        if(changeString === YEAR_CHANGE[0])
            setYear((prevYear) => prevYear - 1)
        else
            setYear((prevYear) => prevYear + 1)
    }

    const handleMonthChange = (event: string) => {
        const monthIndex = parseInt(event, 10);
        setSelectedMonth(monthIndex);
        scrollToDay(monthIndex, 1);
    };
    
    const handleTodayClick = () => {
        setYear(TODAY.getFullYear());
        setSelectedMonth(TODAY.getMonth())
        scrollToDay(TODAY.getMonth(), TODAY.getDate());
    };
    
    const handleDayClick = (day: number, month: number, year: number) => {
        if (!onClick) { return; }
        if (month < 0) {
          onClick(day, 11, year - 1);
        } else {
          onClick(day, month, year);
        }
    }

    function triggerSelectedTask(task: any[]) {
        setSelectedTask(task);
        setShowTaskDetail(true);
    }

    function triggerCloseSelectedTask() {
        setSelectedTask([]);
        setShowTaskDetail(false);
    }

    // Start generate a calendar
    const generateCalendar = useMemo(() => {
        const today = new Date();
    
        const daysInYear = (): { month: number; day: number }[] => {
            const daysInYear = [];
            const startDayOfWeek = new Date(year, 0, 0).getDay();
        
            if (startDayOfWeek < 6) {
                for (let i = 0; i < startDayOfWeek; i++) {
                daysInYear.push({ month: -1, day: 32 - startDayOfWeek + i });
                }
            }
        
            for (let month = 0; month < 12; month++) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
        
                for (let day = 1; day <= daysInMonth; day++) {
                daysInYear.push({ month, day });
                }
            }
        
            const lastWeekDayCount = daysInYear.length % 7;
            if (lastWeekDayCount > 0) {
                const extraDaysNeeded = 7 - lastWeekDayCount;
                for (let day = 1; day <= extraDaysNeeded; day++) {
                daysInYear.push({ month: 0, day });
                }
            }
            
            return daysInYear;
        };
    
        const calendarDays = daysInYear();
    
        const calendarWeeks = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            calendarWeeks.push(calendarDays.slice(i, i + 7));
        }
        const calendar = calendarWeeks.map((week, weekIndex) => (
            <div className="calendar-week" key={`week-${weekIndex}`}>
                {week.map(({ month, day }, dayIndex) => {
                    const index = weekIndex * 7 + dayIndex
                    const isNewMonth = index === 0 || calendarDays[index - 1].month !== month;
                    const isToday = today.getMonth() === month && today.getDate() === day && today.getFullYear() === year;
                    const isPrevMonth = month < selectedMonth;
                    const isPrevYear = year < TODAY.getFullYear();
                    const dateObj = new Date(year, month, day);
                    const dateKey = dateObj.toISOString().split('T')[0];
                    const tasksForDay = taskMap.get(dateKey) || [];
                    // console.log(`${month} - ${day}`)

                    return (
                        <div
                            key={`${month}-${day}`}
                            ref={(el) => { dayRefs.current[index] = el; }}
                            data-month={month}
                            data-day={day}
                            onClick={() => handleDayClick(day, month, year)}
                            className={`calendar-day ${isToday ? 'today' : ''} 
                                                     ${isPrevMonth ? 'prev-month-day' : ''}
                                                     ${isPrevYear ? 'prev-month-day' : ''}`}
                        >
                            <span className='day-number'>
                                {day}
                            </span>
                            {isNewMonth  && (
                                <span className="month-name">
                                {MONTHS[month]}
                                </span>
                            )}

                            {/* Display task */}
                            <div className="tasks-container">
                                {tasksForDay.length > 0 ? (
                                    tasksForDay.map((task, index) => (   
                                        <div 
                                            key={index} 
                                            className={`task-entry
                                                        ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                        ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                            onClick={() => triggerSelectedTask(task)}
                                        >             
                                            {task.title}
                                        </div>
                                    ))
                                ): null}
                            </div>
                        </div>
                    );
                })}
            </div>
        ));
        return calendar;
    }, [year, selectedMonth, taskMap, tasks]);

    useEffect(() => {
        const calendarContainer = document.querySelector('.calendar-container');
    
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const month = parseInt(entry.target.getAttribute('data-month')!, 10);
                    setSelectedMonth(month);
                }
                });
            },
            {
                root: calendarContainer,
                rootMargin: '-75% 0px -25% 0px',
                threshold: 0,
            },
        );
    
        dayRefs.current.forEach((ref) => {
            if (ref && ref.getAttribute('data-day') === '15') {
                observer.observe(ref);
            }
        });
    
        return () => {
            observer.disconnect();
        };
    }, []);

    // Select today by default
    useEffect(() => {
        // This will run only once when component mounts
        const timer = setTimeout(() => {
            scrollToDay(TODAY.getMonth(), TODAY.getDate());
        }, 100); // Small delay to ensure DOM is ready
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setSelectedMonth(TODAY.getMonth());
        setYear(TODAY.getFullYear());
    }, []);

    return (
        <div className='calendar-content'>
            <CalendarHeader
                year={year}
                selectedMonth={selectedMonth}
                monthOptions={monthOptions}
                handleMonthChange={handleMonthChange}
                handleTodayClick={handleTodayClick}
                triggerYearChange={triggerYearChange}
            />

            <div className="main-calendar-card-container">
                <div className="calendar-days-of-week">
                    {DAYS_OF_WEEK.map((day, index) => (
                        <div key={index} className='weekday'>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar-grid-card" ref={calendarContainerRef}>
                    {generateCalendar}
                </div>
            </div>

            {showTaskDetail && selectedTask && (
                <div className="App-popup">
                    <EventDetail 
                        task={selectedTask}
                        onClose={() => triggerCloseSelectedTask()}
                    />
                </div>
            )}
        
        </div>
    )
}

export default MonthCalendar