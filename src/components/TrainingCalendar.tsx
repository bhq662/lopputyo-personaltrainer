import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";


// event shape used by the calendar and allowed views
// CalendarEvent matches data passed from Traininglist
interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    tooltip: string;
}

// reinforce strong typing for view state
type AllowedView = "month" | "week" | "day";

// date-fns localizer (Finnish)
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { fi },
});

// compact custom event rendereing inside calendar cells: time range + title
function CustomEvent({ event }: { event: CalendarEvent }) {
    return (
        <>
            <div style={{ fontSize: "0.75em", color: "#fff" }}>
                {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </div>
            <div
                style={{
                    fontSize: "0.75em",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflow: "hidden",
                    lineHeight: 1.2,
                    color: "#fff",
                }}
            >
                <strong>{event.title}</strong>
            </div>
        </>
    );
}

export default function TrainingCalendar({ events }: { events: CalendarEvent[] }) {
    // component state with current date and active view
    const [currentDate, setCurrentDate] = useState(new Date());
    // toggles between month, week and day
    const [view, setView] = useState<AllowedView>("month");

    return (
        // layout container for calendar
        <Box
            sx={{
                width: "100%",
                height: "70vh",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0px 4px 6px rgba(118, 150, 199, 0.15)",
                bgcolor: "background.paper",
            }}
        >
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day"]}
                view={view}
                onView={(v) => setView(v as AllowedView)}
                date={currentDate}
                onNavigate={(d) => setCurrentDate(d)}
                components={{ event: CustomEvent }}
                tooltipAccessor="tooltip"
                style={{ height: "100%" }}
            />
        </Box>
    );
}