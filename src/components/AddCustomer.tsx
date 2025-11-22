import { useState } from 'react';
import type { Customer } from '../types';
import { saveCustomer } from '../customerAPI';

// style imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// added as a type here, because prop is unused anywhere else
type AddCustomerProps = {
    fetchCustomers: () => void;
}

export default function AddCustomer({ fetchCustomers }: AddCustomerProps) {
    const [open, setOpen] = useState(false);
    const [Customer, setCustomer] = useState<Customer>({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: "",
        _links: {
            self: {
                href: ''
            },
            customer: {
                href: ''
            },
            trainings: {
                href: ''
            }
        }
    });

    // error flags for required fields
    const [errors, setErrors] = useState({
        firstname: false,
        lastname: false,
        streetaddress: false,
        postcode: false,
        city: false,
        email: false,
        phone: false
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const resetForm = () => {
        setCustomer({
            firstname: "",
            lastname: "",
            streetaddress: "",
            postcode: "",
            city: "",
            email: "",
            phone: "",
            _links: {
                self: {
                    href: ''
                },
                customer: {
                    href: ''
                },
                trainings: {
                    href: ''
                }
            }
        });
        setErrors({
            firstname: false,
            lastname: false,
            streetaddress: false,
            postcode: false,
            city: false,
            email: false,
            phone: false
        });
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSave = () => {
        // validate required fields (adjust which fields are required as needed)
        const newErrors = {
            firstname: !Customer.firstname || Customer.firstname.trim() === "",
            lastname: !Customer.lastname || Customer.lastname.trim() === "",
            streetaddress: !Customer.streetaddress || Customer.streetaddress.trim() === "",
            postcode: !Customer.postcode || Customer.postcode.trim() === "",
            city: !Customer.city || Customer.city.trim() === "",
            email: !Customer.email || Customer.email.trim() === "",
            phone: !Customer.phone || Customer.phone.trim() === ""
        };
        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(Boolean);
        if (hasError) {
            // keep dialog open and show red fields / helper text
            return;
        }

        saveCustomer(Customer)
            .then(() => {
                fetchCustomers();
                handleClose();
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            <Button variant="contained" size="medium" onClick={handleClickOpen}>
                New Customer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        label="First Name"
                        value={Customer.firstname}
                        onChange={event => {
                            setCustomer({ ...Customer, firstname: event.target.value });
                            if (errors.firstname) setErrors(prev => ({ ...prev, firstname: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.firstname}
                        helperText={errors.firstname ? "First name is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Last Name"
                        value={Customer.lastname}
                        onChange={event => {
                            setCustomer({ ...Customer, lastname: event.target.value });
                            if (errors.lastname) setErrors(prev => ({ ...prev, lastname: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.lastname}
                        helperText={errors.lastname ? "Last name is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Street Address"
                        value={Customer.streetaddress}
                        onChange={event => {
                            setCustomer({ ...Customer, streetaddress: event.target.value });
                            if (errors.streetaddress) setErrors(prev => ({ ...prev, streetaddress: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.streetaddress}
                        helperText={errors.streetaddress ? "Street address is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="ZIP"
                        value={Customer.postcode}
                        onChange={event => {
                            setCustomer({ ...Customer, postcode: event.target.value });
                            if (errors.postcode) setErrors(prev => ({ ...prev, postcode: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.postcode}
                        helperText={errors.postcode ? "ZIP is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="City"
                        value={Customer.city}
                        onChange={event => {
                            setCustomer({ ...Customer, city: event.target.value });
                            if (errors.city) setErrors(prev => ({ ...prev, city: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.city}
                        helperText={errors.city ? "City is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Email"
                        value={Customer.email}
                        onChange={event => {
                            setCustomer({ ...Customer, email: event.target.value });
                            if (errors.email) setErrors(prev => ({ ...prev, email: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.email}
                        helperText={errors.email ? "Email is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Phone number"
                        value={Customer.phone}
                        onChange={event => {
                            setCustomer({ ...Customer, phone: event.target.value });
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.phone}
                        helperText={errors.phone ? "Phone number is required" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}