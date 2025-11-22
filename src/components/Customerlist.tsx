import type { Customer } from "../types";
import { useState, useEffect } from "react";
import { deleteCustomer, getCustomers } from "../customerAPI";
import AddCustomer from "./AddCustomer";

// MUI style imports
import {
    DataGrid,
    GridOverlay,
    type GridColDef,
    type GridRenderCellParams
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import EditCustomer from "./EditCustomer";

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


export default function Customerlist() {
    // loading state
    const [loading, setLoading] = useState(true);

    // initial state
    const [customers, setCustomers] = useState<Customer[]>([]);

    // only fetch once on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // fetch customers from API
    const fetchCustomers = async () => {
        setLoading(true);

        try {
            const data = await getCustomers();
            const list = data?._embedded?.customers ?? [];
            setCustomers(list);

        } catch (err) {
            console.error("Failed to fetch customers", err);

        } finally {
            setLoading(false);
        }
    };

    //fetch delete-function from API
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
        { field: 'postcode', width: 80, headerName: 'ZIP' },
        { field: 'city', width: 100, headerName: 'City' },
        { field: 'email', width: 180, headerName: 'Email' },
        { field: 'phone', width: 150, headerName: 'Phone number' },

        // ACTIONS column: DELETE + EDIT
        {
            field: 'actions',
            headerName: ' ',
            sortable: false,
            filterable: false,
            width: 180,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Customer;
                const href = row?._links?.self?.href;
                return (
                    <>
                        <EditCustomer
                            fetchCustomers={fetchCustomers}
                            CustomerRow={row}
                        />
                        <Button
                            color="error"
                            size="small"
                            onClick={() => href && handleDelete(href)}
                            style={{ marginRight: 2 }}>
                            DELETE
                        </Button>
                    </>
                );
            }
        }


    ]

    return (
        <>
            <div style={{ width: "95%", margin: "20px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Customers</h2>
                <AddCustomer fetchCustomers={fetchCustomers} />
            </div>

            <div style={{ width: "95%", height: 600, margin: "auto" }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    loading={loading}
                    slots={{
                        loadingOverlay: CustomLoadingOverlay,
                    }}
                    getRowId={(row: Customer) => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </>
    )

}