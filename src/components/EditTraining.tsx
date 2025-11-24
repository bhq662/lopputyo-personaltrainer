import { useState } from 'react';
import type { Training } from '../types';
import { editTraining } from '../trainingAPI';

import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type EditTrainingProps = {
    fetchTrainings: () => void;
    TrainingRow: Training & { customerName?: string; selfUrl: string; customerUrl: string };
};

export default function EditTraining({ fetchTrainings, TrainingRow }: EditTrainingProps) {
    const [open, setOpen] = useState(false);

    const [training, setTraining] = useState<Training>({
        customerUrl: "",
        date: "",
        duration: 0,
        activity: "",
        customer: "",
        _links: {
            self: { href: "" },
            customer: { href: "" },
        }
    });

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const [errors, setErrors] = useState({
        date: false,
        duration: false,
        activity: false
    });

    const handleClickOpen = () => {
        setOpen(true);

        setTraining({
            customerUrl: "",
            date: TrainingRow.date ?? "",
            duration: TrainingRow.duration ?? 0,
            activity: TrainingRow.activity ?? "",
            customer: TrainingRow._links?.customer?.href ?? "",  // ✔ always URL
            _links: {
                self: { href: TrainingRow.selfUrl },          // ALWAYS correct
                customer: { href: TrainingRow._links.customer.href }
            }
        });

        const parsed = TrainingRow.date ? dayjs(TrainingRow.date) : null;
        setSelectedDate(parsed?.isValid() ? parsed : null);
    };

    const resetForm = () => {
        setTraining({
            customerUrl: "",
            date: "",
            duration: 0,
            activity: "",
            customer: "",
            _links: {
                self: { href: "" },
                customer: { href: "" },
            }
        });
        setSelectedDate(null);
        setErrors({ date: false, duration: false, activity: false });
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSave = async () => {
        if (selectedDate) {
            setTraining(prev => ({ ...prev, date: selectedDate.toISOString() }));
        }

        const newErrors = {
            date: !selectedDate,
            duration: training.duration <= 0,
            activity: !training.activity.trim()
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        const payload: Training = {
            ...training,
            date: selectedDate ? selectedDate.toISOString() : training.date,
            customer: TrainingRow.customerUrl // <-- use real customer URL here
        };

        try {
            const url = TrainingRow.selfUrl;
            if (!url) throw new Error("No training URL to edit");

            await editTraining(url, payload);
            fetchTrainings();
            handleClose();
        } catch (err) {
            console.error("editTraining failed", err);
        }
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                Edit
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Training</DialogTitle>
                <DialogContent>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Date & Time"
                            value={selectedDate}
                            format="DD.MM.YYYY HH:mm"
                            enableAccessibleFieldDOMStructure={false}
                            onChange={(value) => {
                                setSelectedDate(value);
                                if (value) {
                                    setTraining(prev => ({
                                        ...prev,
                                        date: value.toISOString()
                                    }));
                                }
                            }}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    required: true,
                                    margin: "dense",
                                    fullWidth: true,
                                    variant: "standard",
                                    error: errors.date,
                                    helperText: errors.date ? "Date is required" : ""
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        required
                        margin="dense"
                        label="Duration (min)"
                        type="number"
                        value={training.duration}
                        onChange={(e) => setTraining({ ...training, duration: Number(e.target.value) })}
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
                        onChange={(e) => setTraining({ ...training, activity: e.target.value })}
                        fullWidth
                        variant="standard"
                        error={errors.activity}
                        helperText={errors.activity ? "Activity is required" : ""}
                    />

                    <TextField
                        label="Customer"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={TrainingRow.customerName || ""}
                        slotProps={{
                            input: {
                                readOnly: true,
                                style: { caretColor: "transparent", cursor: "default" },
                                onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.blur()
                            }
                        }}
                        helperText="Customer cannot be changed after creation"
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