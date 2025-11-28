import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Typography } from "@mui/material";

export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    tooltip?: string;
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
        <div style={{ whiteSpace: "normal", lineHeight: "1.2" }}>
            <strong>{event.title}</strong>
        </div>
    );
}


export default function TrainingCalendar({ events }: { events: CalendarEvent[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<AllowedView>("week");

    return (
        <Box sx={{ width: "100%", height: "80vh" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Training - Calendar view
            </Typography>

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
