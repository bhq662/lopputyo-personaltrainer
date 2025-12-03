import type { Customer } from "../types";
import { useState, useEffect } from "react";
import { deleteCustomer, getCustomers } from "../customerAPI";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

import { DataGrid, GridOverlay, GridToolbar, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { Button, CircularProgress, Typography, Toolbar } from "@mui/material";
import AddTraining from "./AddTraining";

function CustomToolbar({ fetchCustomers }: { fetchCustomers: () => void }) {
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
                Customers
            </Typography>
            <AddCustomer fetchCustomers={fetchCustomers} />
        </Toolbar>
    );
}

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
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

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

    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure?")) {
            deleteCustomer(url)
                .then(() => fetchCustomers())
                .catch((err) => console.error(err));
        }
    };

    const columns: GridColDef[] = [
        { field: "firstname", width: 100, headerName: "First name" },
        { field: "lastname", width: 100, headerName: "Last name" },
        { field: "streetaddress", width: 150, headerName: "Street address" },
        { field: "postcode", width: 80, headerName: "ZIP" },
        { field: "city", width: 100, headerName: "City" },
        { field: "email", width: 180, headerName: "Email" },
        { field: "phone", width: 150, headerName: "Phone number" },
        {
            field: "actions",
            headerName: " ",
            sortable: false,
            filterable: false,
            width: 300,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Customer;
                const href = row?._links?.self?.href;
                if (!href) return null;
                function fetchTrainings(): void {
                    throw new Error("Function not implemented.");
                }

                return (
                    <>
                        <AddTraining fetchTrainings={fetchTrainings} iconOnly size="small" tooltip="Add a training for this customer" redirectTo="/trainings" />                        <EditCustomer fetchCustomers={fetchCustomers} CustomerRow={row} />
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
            },
        },
    ];

    return (
        <div style={{ width: "95%", height: 600, margin: "auto" }}>
            <CustomToolbar fetchCustomers={fetchCustomers} />  {/* keep your header */}
            <DataGrid
                rows={customers}
                columns={columns}
                slots={{
                    toolbar: GridToolbar,                 // change this line
                    loadingOverlay: CustomLoadingOverlay,
                }}
                sx={{
                    border: "none",
                    ".MuiDataGrid-row": {
                        "&:nth-of-type(even)": { backgroundColor: "hsl(210, 100%, 95%)" },
                        "&:hover": { backgroundColor: "hsl(210, 100%, 95%)" },
                    },
                    ".MuiDataGrid-cell": { color: "text.primary" },
                }}
                loading={loading}
                getRowId={(row: Customer) => row._links.self.href}
                autoPageSize
                rowSelection={false}
                slotProps={{
                    toolbar: {
                        csvOptions: {
                            fields: ["firstname", "lastname", "streetaddress", "postcode", "city", "email", "phone"],
                        },
                        printOptions: {
                            fields: ["firstname", "lastname", "streetaddress", "postcode", "city", "email", "phone"],
                            hideFooter: true,
                            hideToolbar: true,
                        },
                        showQuickFilter: true,              // optional
                    },
                }}
                showToolbar
            />
        </div>
    );
}