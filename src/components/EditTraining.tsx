import { useEffect, useState } from 'react';
import type { Training } from '../types';
import { getCustomers, editTraining } from '../trainingAPI';

// date picker imports
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// style imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type EditTrainingProps = {
    fetchTrainings: () => void;
    TrainingRow: Training;
}

export default function EditTraining({ fetchTrainings, TrainingRow }: EditTrainingProps) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState<Training>({
        date: "",
        duration: 0,
        activity: "",
        customer: "",
        _links: {
            self: { href: '' },
            customer: { href: '' },
            training: { href: '' }
        }
    });

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
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
            .catch(err => console.error('Failed to load customers for EditTraining', err));
    }, []);

    const handleClickOpen = () => {
        setOpen(true);

        // initialize training state from row
        setTraining({
            date: TrainingRow.date ?? "",
            duration: TrainingRow.duration ?? 0,
            activity: TrainingRow.activity ?? "",
            customer: (typeof TrainingRow.customer === 'string' && TrainingRow.customer) || (TrainingRow._links?.customer?.href ?? ""),
            _links: {
                self: { href: TrainingRow._links?.self?.href ?? '' },
                customer: { href: TrainingRow._links?.customer?.href ?? '' },
                training: { href: TrainingRow._links?.training?.href ?? '' }
            }
        });

        // initialize selectedDate from incoming date if possible
        const parsed = TrainingRow.date ? dayjs(TrainingRow.date) : null;
        setSelectedDate(parsed && parsed.isValid() ? parsed : null);

        // initialize selectedCustomer to match options (use href if available)
        const href = TrainingRow._links?.customer?.href ?? (typeof TrainingRow.customer === 'string' ? TrainingRow.customer : '');
        const label = typeof TrainingRow.customer === 'string' ? TrainingRow.customer : '';
        setSelectedCustomer(href ? { label: label || href, href } : null);
    };

    const resetForm = () => {
        setTraining({
            date: "",
            duration: 0,
            activity: "",
            customer: "",
            _links: {
                self: { href: '' },
                customer: { href: '' },
                training: { href: '' }
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

    // ...existing code...
    const handleSave = async () => {
        // ensure training.date is a backend-friendly string (YYYY-MM-DD or ISO if time present)
        if (selectedDate) {
            setTraining(prev => ({ ...prev, date: selectedDate.format('YYYY-MM-DD') }));
        }

        // prefer stored self hrefs; selectedCustomer is not used when customer editing is disabled
        const customerHref = training._links?.customer?.href
            || TrainingRow._links?.customer?.href
            || training.customer;

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
            date: selectedDate ? selectedDate.format('YYYY-MM-DD') : training.date,
            customer: customerHref
        };

        try {
            // prefer the training self href for editing
            const url = training._links?.self?.href || TrainingRow._links?.self?.href;
            if (!url) throw new Error('No training URL to edit');

            await editTraining(url, payload);
            fetchTrainings();
            handleClose();
        } catch (err) {
            console.error('editTraining failed', err);
        }
    };

    {/* Customer shown as read-only */ }
    <TextField
        label="Customer"
        value={
            // prefer selectedCustomer label (if any), then TrainingRow.customer (mapped name), then try to match href -> label
            selectedCustomer?.label
            || (typeof TrainingRow.customer === 'string' && TrainingRow.customer)
            || customerOptions.find(c => c.href === (TrainingRow._links?.customer?.href ?? training.customer))?.label
            || training._links?.customer?.href
            || ''
        }
        margin="dense"
        fullWidth
        variant="standard"
        slotProps={{
            input: {
                readOnly: true,
                // hide caret and force default cursor
                style: { caretColor: 'transparent', cursor: 'default' },
                onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.blur()
            }
        }}
        sx={{ '& .MuiInputBase-input': { cursor: 'default' } }}
        helperText="Customer cannot be changed after creation"
    />

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            enableAccessibleFieldDOMStructure={false}
                            label="Date"
                            value={selectedDate}
                            onChange={(value) => {
                                setSelectedDate(value);
                                if (value) setTraining(prev => ({ ...prev, date: value.format('YYYY-MM-DD') }));
                                if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                            }}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    required: true,
                                    margin: "dense",
                                    fullWidth: true,
                                    variant: "standard",
                                    error: errors.date,
                                    helperText: errors.date ? "Date is required" : "",
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

                    {/* Customer shown as read-only (disable editing) */}
                    <TextField
                        label="Customer"
                        value={
                            selectedCustomer?.label
                            || (typeof TrainingRow.customer === 'string' && TrainingRow.customer)
                            || customerOptions.find(c => c.href === (TrainingRow._links?.customer?.href ?? training.customer))?.label
                            || training._links?.customer?.href
                            || ''
                        }
                        margin="dense"
                        fullWidth
                        variant="standard"
                        slotProps={{
                            input: {
                                readOnly: true,
                                // hide caret and force default cursor
                                style: { caretColor: 'transparent', cursor: 'default' },
                                onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.blur()
                            }
                        }}
                        // additional CSS to ensure hovering shows default cursor
                        sx={{ '& .MuiInputBase-input': { cursor: 'default' } }}
                        helperText="Customer cannot be changed after creation"
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