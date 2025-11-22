import { useEffect, useState } from 'react';
import type { Training } from '../types';
import { saveTraining } from '../trainingAPI';
import { getCustomers } from '../customerAPI';

// style imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

// added as a type here, because prop is unused anywhere else
type AddTrainingProps = {
    fetchTrainings: () => void;
}

export default function AddTraining({ fetchTrainings }: AddTrainingProps) {
    const [open, setOpen] = useState(false);
    const [Training, setTraining] = useState<Training>({
        date: "",
        duration: 0,
        activity: "",
        customer: "",
        _links: {
            self: {
                href: ''
            },
            customer: {
                href: ''
            },
            training: {
                href: ''
            }
        }
    });

    // customer options for the autocomplete: { label: "First Last", href: "/api/customers/..." }
    const [customerOptions, setCustomerOptions] = useState<{ label: string; href: string }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<{ label: string; href: string } | null>(null);

    // error flags for required fields
    const [errors, setErrors] = useState({
        date: false,
        duration: false,
        activity: false,
        customer: false
    });

    useEffect(() => {
        // load customers once for the autocomplete
        getCustomers()
            .then(data => {
                const customers = data?._embedded?.customers ?? [];
                const opts = customers.map((c: { firstname: string; lastname: string; _links: { self: { href: string } } }) => ({
                    label: `${c.firstname} ${c.lastname}`,
                    href: c._links?.self?.href ?? ''
                })).filter((o: { label: string; href: string }) => o.href);
                setCustomerOptions(opts);
            })
            .catch(err => console.error('Failed to load customers for AddTraining', err));
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const resetForm = () => {
        setTraining({
            date: "",
            duration: 0,
            activity: "",
            customer: "",
            _links: {
                self: {
                    href: ''
                },
                customer: {
                    href: ''
                },
                training: {
                    href: ''
                }
            }
        });
        setSelectedCustomer(null);
        setErrors({ date: false, duration: false, activity: false, customer: false });
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSave = () => {
        // ensure we store the href of selected customer
        if (selectedCustomer && selectedCustomer.href) {
            setTraining(prev => ({ ...prev, customer: selectedCustomer.href }));
        }
        // validate: require non-empty date, activity, customer and duration > 0
        const newErrors = {
            date: !Training.date || Training.date.trim() === "",
            duration: !Training.duration || Training.duration <= 0,
            activity: !Training.activity || Training.activity.trim() === "",
            customer: !Training.customer || Training.customer.trim() === ""
        };
        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(Boolean);
        if (hasError) {
            // keep dialog open and show red fields / helper text
            return;
        }

        // ensure payload uses customer href
        const payload: Training = { ...Training, customer: selectedCustomer?.href ?? Training.customer };

        saveTraining(payload)
            .then(() => {
                fetchTrainings();
                handleClose();
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            <Button variant="contained" size="medium" onClick={handleClickOpen}>
                New Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Training</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        label="Date"
                        value={Training.date}
                        onChange={event => {
                            setTraining({ ...Training, date: event.target.value });
                            if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.date}
                        helperText={errors.date ? "Date is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Duration (min)"
                        type="number"
                        value={Training.duration}
                        onChange={event => {
                            setTraining({ ...Training, duration: Number(event.target.value) });
                            if (errors.duration) setErrors(prev => ({ ...prev, duration: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.duration}
                        helperText={errors.duration ? "Duration must be greater than 0" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Activity"
                        value={Training.activity}
                        onChange={event => {
                            setTraining({ ...Training, activity: event.target.value });
                            if (errors.activity) setErrors(prev => ({ ...prev, activity: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.activity}
                        helperText={errors.activity ? "Activity is required" : ""}
                    />
                    <Autocomplete
                        options={customerOptions}
                        getOptionLabel={(option) => option.label}
                        value={selectedCustomer}
                        onChange={(_event, value) => {
                            setSelectedCustomer(value);
                            if (value && value.href) {
                                setTraining(prev => ({ ...prev, customer: value.href }));
                            }
                            if (errors.customer) setErrors(prev => ({ ...prev, customer: false }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                margin="dense"
                                label="Customer"
                                fullWidth
                                variant="standard"
                                error={errors.customer}
                                helperText={errors.customer ? "Customer is required (select from list)" : ""}
                            />
                        )}
                        sx={{ marginTop: 1 }}
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