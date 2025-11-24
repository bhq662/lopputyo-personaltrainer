import dayjs from "dayjs";
import type { Training } from "../types";
import { useState, useEffect } from "react";
import { getCustomerByUrl } from "../customerAPI";
import { deleteTraining, getTrainings } from "../trainingAPI";
import AddTraining from "./AddTraining";

import {
    DataGrid,
    GridOverlay,
    type GridColDef,
    type GridRenderCellParams
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import EditTraining from "./EditTraining";

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
    const [loading, setLoading] = useState(true);
    const [trainings, setTrainings] = useState<Training[]>([]);

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
                    const customerUrl = t._links?.customer?.href;

                    if (!customerUrl) {
                        return {
                            ...t,
                            customerName: "",
                            customerUrl: ""
                        } as Training;
                    }

                    try {
                        const cust = await getCustomerByUrl(customerUrl);
                        return {
                            ...t,
                            customerName: `${cust.firstname} ${cust.lastname}`,
                            customerUrl: cust._links.self.href // actual customer URL
                        } as Training;
                    } catch {
                        return {
                            ...t,
                            customerName: "",
                            customerUrl: ""
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
                .catch(err => console.error(err));
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'date',
            width: 250,
            headerName: 'Date',
            renderCell: (params: GridRenderCellParams) =>
                <span>{params.value ? dayjs(params.value as string).format('DD.MM.YYYY HH:mm') : ''}</span>
        },
        { field: 'duration', width: 125, headerName: 'Duration (min)' },
        { field: 'activity', width: 150, headerName: 'Activity' },

        // ✔ use customerName instead of customer
        { field: 'customerName', width: 200, headerName: 'Customer' },

        {
            field: 'actions',
            headerName: ' ',
            sortable: false,
            filterable: false,
            width: 180,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Training;
                const href = row?._links?.self?.href;
                if (!href) return null;

                return (
                    <>
                        <EditTraining
                            fetchTrainings={fetchTrainings}
                            TrainingRow={{
                                ...row,
                                selfUrl: row._links.self.href,
                                customerUrl: row.customerUrl // this works now
                            }}
                        />
                        <Button
                            color="error"
                            size="small"
                            onClick={() => handleDelete(href)}
                            style={{ marginRight: 2 }}
                        >
                            DELETE
                        </Button>
                    </>
                );
            }
        }
    ];

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
                    slots={{ loadingOverlay: CustomLoadingOverlay }}
                    getRowId={(row: Training) => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </>
    );
}