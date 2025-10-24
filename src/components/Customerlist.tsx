import { useState, useEffect } from "react";
import type { Customer } from "../types";

// style imports
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { deleteCustomer, getCustomers } from "../customerAPI";

export default function Customerlist() {
    // initial state
    const [customers, setCustomers] = useState<Customer[]>([]);

    // only fetch once on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // fetch customers from API
    const fetchCustomers = () => {
        getCustomers()
            .then(data => setCustomers(data._embedded.customers))
            .catch(err => console.error(err))
    }

    //fetch delete-function from customerAPI
    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteCustomer(url)
                .then(() => fetchCustomers())
                .catch(err => console.error(err))
        }
    }

    // define table layout, includes add, edit and delete -functions
    const columns: GridColDef[] = [
        { field: 'firstname', width: 100, headerName: 'First name' },
        { field: 'lastname', width: 100, headerName: 'Last name' },
        { field: 'streetaddress', width: 150, headerName: 'Street address' },
        { field: 'postcode', width: 100, headerName: 'Postal code' },
        { field: 'city', width: 100, headerName: 'City' },
        { field: 'email', width: 200, headerName: 'Email' },
        { field: 'phone', width: 150, headerName: 'Phone number' },

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
                    rows={customers}
                    columns={columns}
                    getRowId={(row: Customer) => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </>
    )

}