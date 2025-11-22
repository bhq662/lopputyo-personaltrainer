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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        })
    };

    const handleSave = () => {
        if (Training == null) {
            alert("Fill all fields first");
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
                        margin="dense"
                        label="Date"
                        value={Training.date}
                        onChange={event => setTraining({ ...Training, date: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Duration"
                        type="number"
                        value={Training.duration}
                        onChange={event => setTraining({ ...Training, duration: Number(event.target.value) })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Activity"
                        value={Training.activity}
                        onChange={event => setTraining({ ...Training, activity: event.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Customer"
                        value={Training.customer}
                        onChange={event => setTraining({ ...Training, customer: event.target.value })}
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