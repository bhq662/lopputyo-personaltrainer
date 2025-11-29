import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Training } from '../types';
import { saveTraining } from '../trainingAPI';
import { getCustomers } from '../customerAPI';

// date picker imports
import type { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// style imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

type AddTrainingProps = {
    fetchTrainings: () => void;
    redirectTo?: string;
}

export default function AddTraining({ fetchTrainings, redirectTo }: AddTrainingProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const [training, setTraining] = useState<Training>({
        customerUrl: "",
        date: "",
        duration: 0,
        activity: "",
        customer: "",
        _links: {
            self: { href: '' },
            customer: { href: '' },
        }
    });

    const [customerOptions, setCustomerOptions] = useState<{ label: string; href: string }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<{ label: string; href: string } | null>(null);

    const [errors, setErrors] = useState({
        date: false,
        duration: false,
        activity: false,
        customer: false
    });

    useEffect(() => {
        getCustomers()
            .then(data => {
                const customers = data?._embedded?.customers ?? [];
                type Customer = {
                    firstname: string;
                    lastname: string;
                    _links: {
                        self: { href: string };
                    };
                };

                const opts = customers
                    .map((c: Customer) => ({ label: `${c.firstname} ${c.lastname}`, href: c._links?.self?.href ?? '' }))
                    .filter((o: { label: string; href: string }) => o.href);
                setCustomerOptions(opts);
            })
            .catch(err => console.error('Failed to load customers for AddTraining', err));
    }, []);

    const handleClickOpen = () => setOpen(true);

    const resetForm = () => {
        setTraining({
            customerUrl: "",
            date: "",
            duration: 0,
            activity: "",
            customer: "",
            _links: {
                self: { href: '' },
                customer: { href: '' },
            }
        });
        setSelectedCustomer(null);
        setSelectedDate(null);
        setErrors({ date: false, duration: false, activity: false, customer: false });
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSave = async () => {
        if (selectedDate) {
            setTraining(prev => ({ ...prev, date: selectedDate.format('YYYY-MM-DD') }));
        }

        const customerHref = selectedCustomer?.href ?? training.customer;

        const newErrors = {
            date: !(selectedDate || (training.date && training.date.trim() !== "")),
            duration: !training.duration || training.duration <= 0,
            activity: !training.activity || training.activity.trim() === "",
            customer: !customerHref || customerHref.trim() === ""
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        const payload: Training = {
            ...training,
            date: selectedDate ? selectedDate.toISOString() : training.date,
            customer: customerHref
        };
        try {
            await saveTraining(payload);
            fetchTrainings();
            handleClose();
            if (redirectTo && location.pathname !== redirectTo) {
                navigate(redirectTo);
            }
        } catch (err) {
            console.error('saveTraining failed', err);
        }
    };

    return (
        <>
            <Button variant="contained" size="medium" onClick={handleClickOpen}>
                New Training
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            enableAccessibleFieldDOMStructure={false}
                            label="Date & Time"
                            value={selectedDate}
                            format="DD.MM.YYYY HH:mm"
                            onChange={(value) => {
                                setSelectedDate(value);
                                if (value) setTraining(prev => ({ ...prev, date: value.toISOString() }));
                                if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                            }} slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    required: true,
                                    margin: "dense",
                                    fullWidth: true,
                                    variant: "standard",
                                    error: errors.date,
                                    helperText: errors.date ? "Date and time are required" : "",
                                },
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        required
                        margin="dense"
                        label="Duration (min)"
                        type="number"
                        value={training.duration}
                        onChange={e => {
                            setTraining({ ...training, duration: Number(e.target.value) });
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
                        value={training.activity}
                        onChange={e => {
                            setTraining({ ...training, activity: e.target.value });
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
                        onChange={(_e, value) => {
                            setSelectedCustomer(value);
                            if (value && value.href) setTraining(prev => ({ ...prev, customer: value.href }));
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
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}