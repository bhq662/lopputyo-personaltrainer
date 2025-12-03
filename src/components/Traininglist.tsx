import dayjs from "dayjs";
import type { Training } from "../types";
import { useState, useEffect } from "react";
import { getCustomerByUrl } from "../customerAPI";
import { deleteTraining, getTrainings } from "../trainingAPI";
import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import TrainingCalendar from "./TrainingCalendar";

// MUI imports
import {
    DataGrid,
    GridOverlay,
    type GridColDef,
    type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Button, Typography, Toolbar } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TableViewIcon from "@mui/icons-material/TableView";
import CircularProgress from "@mui/material/CircularProgress";

// initialise custom toolbar and switching between calendar / table views
function TrainingToolbar({
    fetchTrainings,
    calendarView,
    setCalendarView,
}: {
    fetchTrainings: () => void;
    calendarView: boolean;
    setCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Toolbar
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "20px 0px 10px 0px",
            }}
        >
            <Typography variant="h5" sx={{ margin: 0 }}>
                Trainings
            </Typography>
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
                    {calendarView ? <TableViewIcon /> : <CalendarMonthIcon />}
                </Button>
            </div>
        </Toolbar>
    );
}

// initialise training event type locally since it's not used elsewhere
interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    tooltip: string;
}

// initialise custom loading overlay for datagrid
function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: "absolute", top: "50%" }}>
                <CircularProgress />
            </div>
        </GridOverlay>
    );
}

// parse training date for visual clarity
function parseTrainingDate(dateStr: string | undefined, duration: number) {
    if (!dateStr) return null;
    const day = dayjs(dateStr);
    if (!day.isValid()) return null;
    const start = day.toDate();
    const end = day.add(duration, "minute").toDate();
    return { start, end };
}

export default function Traininglist() {
    // loading: true while fetching
    const [loading, setLoading] = useState(true);
    // table/calendar source
    const [trainings, setTrainings] = useState<Training[]>([]);
    // switcher for main presentation
    const [calendarView, setCalendarView] = useState(false);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        setLoading(true);
        try {
            // getTrainings returns HAL with _embedded.trainings
            const data = await getTrainings();
            const tr = data?._embedded?.trainings ?? [];

            // for each training, fetch the related customer (N+1 requests)
            // display customerName and add customerUrl for edit-dialog fallback
            const trainingsWithNames: Training[] = await Promise.all(
                tr.map(async (t: Training) => {
                    const customerUrl = t._links?.customer?.href ?? "";
                    if (!customerUrl) {
                        return { ...t, customerName: "", customerUrl: "" } as Training;
                    }
                    try {
                        const cust = await getCustomerByUrl(customerUrl);
                        return {
                            ...t,
                            customerName: `${cust.firstname} ${cust.lastname}`,
                            customerUrl: cust._links.self.href,
                        } as Training;
                    } catch {
                        return { ...t, customerName: "", customerUrl: "" } as Training;
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

    // delete handler with confirmation and list refresh
    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteTraining(url)
                .then(() => fetchTrainings())
                .catch((err) => console.error(err));
        }
    };

    // DataGrid columns
    const columns: GridColDef[] = [
        {
            field: "date",
            width: 250,
            headerName: "Date",
            renderCell: (params: GridRenderCellParams) => {
                const dateStr = params.value as string | undefined;
                const day = dayjs(dateStr);
                return (
                    <span>{day.isValid() ? day.format("DD.MM.YYYY HH:mm") : "Invalid date"}</span>
                );
            },
        },
        { field: "duration", width: 125, headerName: "Duration (min)" },
        { field: "activity", width: 150, headerName: "Activity" },
        { field: "customerName", width: 200, headerName: "Customer" },
        // render EditTraining and Delete
        {
            field: "actions",
            headerName: " ",
            sortable: false,
            filterable: false,
            width: 260,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Training;
                // stable row ID
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

    // iterates over each training, converting its date and duration 
    // into start/end date objects
    const calendarEvents: CalendarEvent[] = trainings
        .map((t) => {
            const times = parseTrainingDate(t.date, t.duration);
            if (!times || !t.activity) return null;
            return {
                title: t.activity + (t.customerName ? " - " + t.customerName : ""),
                start: times.start,
                end: times.end,
                tooltip:
                    t.activity +
                    ` (${t.duration} min)` +
                    (t.customerName ? " - " + t.customerName : ""),
            };
        })
        // invalid items turn into nulls and are removed
        .filter((e): e is CalendarEvent => e !== null);

    return (
        <div style={{ width: "95%", margin: "20px auto" }}>
            <TrainingToolbar
                fetchTrainings={fetchTrainings}
                calendarView={calendarView}
                setCalendarView={setCalendarView}
            />
            {/* conditional rendering for displaying calendar/table */}
            {calendarView ? (
                <TrainingCalendar events={calendarEvents} />
            ) : (
                <div style={{ width: "100%", height: 500 }}>
                    {/* render DataGrid w/ custom toolbar + loading overlay, if calendar
                    view is not clicked */}
                    <DataGrid
                        rows={trainings}
                        columns={columns}
                        slots={{
                            toolbar: () => (
                                <TrainingToolbar
                                    fetchTrainings={fetchTrainings}
                                    calendarView={calendarView}
                                    setCalendarView={setCalendarView}
                                />
                            ),
                            loadingOverlay: CustomLoadingOverlay,
                        }}
                        sx={{
                            margin: "30px auto",
                            border: "none",
                            ".MuiDataGrid-row": {
                                "&:nth-of-type(even)": {
                                    backgroundColor: "hsl(210, 100%, 95%)",
                                },
                                "&:hover": {
                                    backgroundColor: "hsl(210, 100%, 95%)",
                                },
                            },
                            ".MuiDataGrid-cell": {
                                color: "text.primary",
                            },
                        }}
                        loading={loading}
                        getRowId={(row: Training) =>
                            row._links?.self?.href ?? `${row.activity}-${row.date}`
                        }
                        autoPageSize
                        rowSelection={false}
                    />
                </div>
            )}
        </div>
    );
}