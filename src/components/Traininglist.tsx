import dayjs from "dayjs";
import type { Training } from "../types";
import { useState, useEffect } from "react";
import { getCustomerByUrl } from "../customerAPI";
import { deleteTraining, getTrainings } from "../trainingAPI";
import AddTraining from "./AddTraining";
import TrainingCalendar from "./TrainingCalendar";

import {
    DataGrid,
    GridOverlay,
    type GridColDef,
    type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import EditTraining from "./EditTraining";

// Define CalendarEvent type
interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    tooltip: string;
}

// Loading overlay for DataGrid
function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: "absolute", top: "50%" }}>
                <CircularProgress />
            </div>
        </GridOverlay>
    );
}

// Helper to parse dates safely
function parseTrainingDate(dateStr: string | undefined, duration: number) {
    if (!dateStr) return null;
    const day = dayjs(dateStr);
    if (!day.isValid()) return null;

    const start = day.toDate();
    const end = day.add(duration, "minute").toDate();
    return { start, end };
}

export default function Traininglist() {
    const [loading, setLoading] = useState(true);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [calendarView, setCalendarView] = useState(false);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        setLoading(true);

        try {
            const data = await getTrainings();
            const tr = data?._embedded?.trainings ?? [];
            const trainingsWithNames: Training[] = await Promise.all(
                tr.map(async (t: Training) => {
                    const customerUrl = t._links?.customer?.href ?? "";

                    if (!customerUrl) {
                        return {
                            ...t,
                            customerName: "",
                            customerUrl: "",
                        } as Training;
                    }

                    try {
                        const cust = await getCustomerByUrl(customerUrl);
                        return {
                            ...t,
                            customerName: `${cust.firstname} ${cust.lastname}`,
                            customerUrl: cust._links.self.href,
                        } as Training;
                    } catch {
                        return {
                            ...t,
                            customerName: "",
                            customerUrl: "",
                        } as Training;
                    }
                })
            );

            setTrainings(trainingsWithNames);
        } catch (err) {
            console.error("Failed to fetch trainings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteTraining(url)
                .then(() => fetchTrainings())
                .catch((err) => console.error(err));
        }
    };

    const columns: GridColDef[] = [
        {
            field: "date",
            width: 250,
            headerName: "Date",
            renderCell: (params: GridRenderCellParams) => {
                const dateStr = params.value as string | undefined;
                const day = dayjs(dateStr);
                return <span>{day.isValid() ? day.format("DD.MM.YYYY HH:mm") : "Invalid date"}</span>;
            },
        },
        { field: "duration", width: 125, headerName: "Duration (min)" },
        { field: "activity", width: 150, headerName: "Activity" },
        { field: "customerName", width: 200, headerName: "Customer" },

        {
            field: "actions",
            headerName: " ",
            sortable: false,
            filterable: false,
            width: 260,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Training;
                const href = row?._links?.self?.href;
                if (!href) return null;

                const selfUrl = href;
                const customerUrl = row._links?.customer?.href ?? row.customerUrl ?? "";
                const customerName = row.customerName ?? "";

                return (
                    <>
                        <EditTraining
                            fetchTrainings={fetchTrainings}
                            TrainingRow={{
                                ...row,
                                selfUrl,
                                customerUrl,
                                customerName,
                            }}
                        />
                        <Button
                            color="error"
                            size="small"
                            onClick={() => handleDelete(href)}
                            style={{ marginLeft: 8 }}
                        >
                            DELETE
                        </Button>
                    </>
                );
            },
        },
    ];

    // Map trainings to calendar events safely
    const calendarEvents: CalendarEvent[] = trainings
        .map((t) => {
            const times = parseTrainingDate(t.date, t.duration);
            if (!times || !t.activity) return null;

            return {
                title: t.activity + (t.customerName ? " - " + t.customerName : ""),
                start: times.start,
                end: times.end,
                tooltip: t.activity + ` (${t.duration} min)` + (t.customerName ? " - " + t.customerName : ""),
            };
        })
        .filter((e): e is CalendarEvent => e !== null); // Type guard

    return (
        <div style={{ width: "95%", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "right", alignItems: "center", marginBottom: 10, marginTop: 10 }}>
                <div>
                    <AddTraining fetchTrainings={fetchTrainings} />
                    <Button
                        variant="outlined"
                        style={{ marginLeft: 8 }}
                        onClick={(e) => {
                            setCalendarView((prev) => !prev);
                            (e.currentTarget as HTMLButtonElement).blur();
                        }}
                    >
                        {calendarView ? "Table View" : "Calendar View"}
                    </Button>
                </div>
            </div>

            {calendarView ? (
                <TrainingCalendar events={calendarEvents} />
            ) : (
                <div style={{ width: "100%", height: 500 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Training - Table view
                    </Typography>
                    <DataGrid
                        rows={trainings}
                        columns={columns}
                        loading={loading}
                        slots={{ loadingOverlay: CustomLoadingOverlay }}
                        getRowId={(row: Training) => row._links?.self?.href ?? `${row.activity}-${row.date}`}
                        autoPageSize
                        rowSelection={false}
                    />
                </div>
            )}
        </div>
    );
}
