import { useState } from 'react';
import type { Training } from '../types';
import { saveTraining } from '../trainingAPI';

// style imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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

    // error flags for required fields
    const [errors, setErrors] = useState({
        date: false,
        duration: false,
        activity: false,
        customer: false
    });

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
        setErrors({ date: false, duration: false, activity: false, customer: false });
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSave = () => {
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

        saveTraining(Training)
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
                    <TextField
                        required
                        margin="dense"
                        label="Customer (href or name)"
                        value={Training.customer}
                        onChange={event => {
                            setTraining({ ...Training, customer: event.target.value });
                            if (errors.customer) setErrors(prev => ({ ...prev, customer: false }));
                        }}
                        fullWidth
                        variant="standard"
                        error={errors.customer}
                        helperText={errors.customer ? "Customer is required" : ""}
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