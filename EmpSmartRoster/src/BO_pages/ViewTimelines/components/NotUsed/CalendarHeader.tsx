import { FC } from 'react';
import { YEAR_CHANGE } from '../../../../controller/Variables.js';
import { FaPlusCircle, FaChevronCircleLeft, FaChevronCircleRight } from '../../../../../public/Icons.js'
import PrimaryButton from '../../../../components/PrimaryButton/PrimaryButton.js'

interface CalendarHeaderProps {
    year: number;
    selectedMonth: number;
    monthOptions: { name: string; value: string }[];
    handleMonthChange: (event: string) => void;
    handleTodayClick: () => void;
    triggerYearChange: (change: string) => void;
}

const CalendarHeader: FC<CalendarHeaderProps> = ({
    year,
    selectedMonth,
    monthOptions,
    handleMonthChange,
    handleTodayClick,
    triggerYearChange
}) => (
    <div className="calendar-header">
        {/* Month Dropdown Menu */}
        <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}    
        >
            {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
        
        {/* Select Today Button */}
        <PrimaryButton
            text='Today'
            onClick={handleTodayClick}
        />
        {/* Create task button */}
        <button
            className='create-new-task-button'
            // onClick={}
        >
            <div className="create-new-task-button-content">
                <FaPlusCircle />
                <p>Create Task</p>
            </div>
        </button>
        {/* Trigger year icons */}
        <div className="calendar-change-year">
            <FaChevronCircleLeft 
                className='calendar-trigger-change-year-icons'
                onClick={() => triggerYearChange(YEAR_CHANGE[0])}
            />
            <p>{year}</p>
            <FaChevronCircleRight 
                className='calendar-trigger-change-year-icons'
                onClick={() => triggerYearChange(YEAR_CHANGE[1])}
            />
        </div>
    </div>
);

export default CalendarHeader;