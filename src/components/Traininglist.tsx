import dayjs from "dayjs";
import type { Training } from "../types";
import { useState, useEffect } from "react";
import { getCustomerByUrl } from "../customerAPI";
import { deleteTraining, getTrainings } from "../trainingAPI";
import AddTraining from "./AddTraining";


// MUI style imports
import {
    DataGrid,
    GridOverlay,
    type GridColDef,
    type GridRenderCellParams
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

// initialize custom loading overlay for DataGrid
function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: "absolute", top: "50%" }}>
                <CircularProgress />
            </div>
        </GridOverlay>
    );
}

export default function Traininglist() {
    // set loading state
    const [loading, setLoading] = useState(true);

    // initial state
    const [trainings, setTrainings] = useState<Training[]>([]);

    // only fetch once on mount
    useEffect(() => {
        fetchTrainings();
    }, []);

    // fetch trainings from API
    const fetchTrainings = async () => {
        setLoading(true);

        try {
            const data = await getTrainings();
            const tr = data?._embedded?.trainings ?? [];

            // Fetch customer's name from training's Customer-link
            const trainingsWithNames = await Promise.all(
                tr.map(async (t: Training) => {
                    const customerUrl = t._links?.customer?.href;

                    if (!customerUrl) return { ...t, customer: "" };

                    try {
                        const cust = await getCustomerByUrl(customerUrl);
                        return {
                            ...t,
                            customer: `${cust.firstname} ${cust.lastname}`,
                        };
                    } catch {
                        return { ...t, customer: "" };
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

    //fetch delete-function from API
    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteTraining(url)
                .then(() => fetchTrainings())
                .catch(err => console.error(err))
        }
    }

    // define table layout, includes add, edit and delete -functions
    const columns: GridColDef[] = [
        {
            field: 'date', width: 250, headerName: 'Date', renderCell: (params: GridRenderCellParams) =>
                <span>{params.value ? dayjs(params.value as string).format('DD.MM.YYYY HH:mm') : ''}</span>
        },
        { field: 'duration', width: 125, headerName: 'Duration (min)' },
        { field: 'activity', width: 150, headerName: 'Activity' },
        { field: 'customer', width: 200, headerName: 'Customer' },


        // DELETE -functionality
        {
            field: '_links.self.href',
            headerName: ' ',
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) =>
                <Button
                    color="error"
                    size="small"
                    onClick={() => handleDelete(params.id as string)}>
                    DELETE
                </Button>
        }

        // TODO: EDIT -functionality (lecture on 1.11.)

    ]

    return (
        <>
            <div style={{ width: "95%", margin: "20px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Trainings</h2>
                <AddTraining fetchTrainings={fetchTrainings} />
            </div>

            <div style={{ width: "90%", height: 500, margin: "auto" }}>
                <DataGrid
                    rows={trainings}
                    columns={columns}
                    loading={loading}
                    slots={{
                        loadingOverlay: CustomLoadingOverlay,
                    }}
                    getRowId={(row: Training) => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </>
    )
}