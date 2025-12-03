import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    tooltip: string;
}

type AllowedView = "month" | "week" | "day";


const locales = { fi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

function CustomEvent({ event }: { event: CalendarEvent }) {
    return (
        <>
            <div style={{
                fontSize: "0.75em",
                color: "#fff"
            }}>
                {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </div>
            <div style={{
                fontSize: "0.85em", whiteSpace: "normal",
                wordBreak: "break-word",
                overflow: "hidden",
                lineHeight: "1.2"
            }}>
                <strong>{event.title}</strong>
            </div>
        </>
    );
}


export default function TrainingCalendar({ events }: { events: CalendarEvent[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<AllowedView>("month");

    return (
        <Box sx={{ width: "100%", height: "100vh" }}>
            {/* <Typography variant="h5" sx={{ mb: 2 }}>
                Trainings - Calendar view
            </Typography> */}
            <CalendarMonthIcon />

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
                style={{ height: "100%", marginBottom: "20" }}
            />
        </Box>
    );
}
