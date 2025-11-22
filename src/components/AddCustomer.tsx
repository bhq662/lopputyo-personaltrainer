// THIS TSX IS USED AS A WHOLE IN Customerlist.tsx

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

// tyypitetään tässä, koska muualla ei käytetä
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        })
    };

    const handleSave = () => {
        if (Customer == null) {
            alert("Fill all fields first");
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
            <Button variant="outlined" onClick={handleClickOpen}>
                New Customer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add new Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="First Name"
                        value={Customer.firstname}
                        onChange={event => setCustomer({ ...Customer, firstname: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        value={Customer.lastname}
                        onChange={event => setCustomer({ ...Customer, lastname: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Street Address"
                        value={Customer.streetaddress}
                        onChange={event => setCustomer({ ...Customer, streetaddress: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="ZIP"
                        value={Customer.postcode}
                        onChange={event => setCustomer({ ...Customer, postcode: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        value={Customer.city}
                        onChange={event => setCustomer({ ...Customer, city: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        value={Customer.email}
                        onChange={event => setCustomer({ ...Customer, email: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Phone number"
                        value={Customer.phone}
                        onChange={event => setCustomer({ ...Customer, phone: event.target.value })}
                        fullWidth
                        variant="standard"
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