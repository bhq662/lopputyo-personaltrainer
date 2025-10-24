import { useState, useEffect } from "react";
import type { Training } from "../types";
import type { Customer } from "../types";

// style imports
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { deleteTraining, getTraining } from "../trainingAPI";

export default function Traininglist() {
    // initial state
    const [trainings, setTrainings] = useState<Training[]>([]);

    // only fetch once on mount
    useEffect(() => {
        fetchTrainings();
    }, []);

    // fetch trainings from API
    const fetchTrainings = () => {
        getTrainings()
            .then(data => setTrainings(data._embedded.customers))
            .catch(err => console.error(err))
    }

    // fetch customers from API to display first names
    const fetchCustomers = () => {
        getCustomers()
            .then(data => setCustomers(data._embedded.customers))
            .catch(err => console.error(err))
    }

    //fetch delete-function from trainingAPI
    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteTraining(url)
                .then(() => fetchTrainings())
                .catch(err => console.error(err))
        }
    }

    // define table layout, includes add, edit and delete -functions
    const columns: GridColDef[] = [
        { field: '', headerName: '' },


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

        // TODO: ADD -functionality (lecture on 1.11.)
        // TODO: EDIT -functionality (lecture on 1.11.)

    ]

    return (
        <>
            {/* display table */}
            <div style={{ width: '100%', height: 500, margin: 'auto' }}>
                <DataGrid
                    rows={trainings}
                    columns={columns}
                    getRowId={(row: Training) => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </>
    )
}