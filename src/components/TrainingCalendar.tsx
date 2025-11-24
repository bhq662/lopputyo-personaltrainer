import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from "dayjs";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dayjsLocalizer(dayjs);

type TrainingEvent = {
    start: Date;
    end: Date;
    title: string;
};

interface TrainingCalendarProps {
    events: TrainingEvent[];
}

const TrainingCalendar = ({ events }: TrainingCalendarProps) => {
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default TrainingCalendar;