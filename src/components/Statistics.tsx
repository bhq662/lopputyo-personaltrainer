import { useEffect, useState } from "react";
import { getTrainings } from "../trainingAPI";
// Add the Training type
import type { Training } from "../types";

// bar chart imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// mui imports
import { Box, Typography } from "@mui/material";

type ActivityDuration = { activity: string; duration: number };

export default function Statistics() {
    const [data, setData] = useState<ActivityDuration[]>([]);

    useEffect(() => {
        (async () => {
            const apiResponse = await getTrainings();
            const trainings: Training[] = apiResponse?._embedded?.trainings ?? [];

            // Accumulate total duration per activity
            const durations = trainings.reduce<Record<string, number>>((acc, training) => {
                const activity = training.activity;
                const duration = Number(training.duration);
                if (activity && Number.isFinite(duration)) {
                    acc[activity] = (acc[activity] ?? 0) + duration;
                }
                return acc;
            }, {});

            const chartData: ActivityDuration[] = Object.entries(durations)
                .map(([activity, duration]) => ({ activity, duration }))
                .sort((a, b) => a.activity.localeCompare(b.activity));

            setData(chartData);
        })();
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 4, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 900 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Booked minutes in total (per activity)
                </Typography>

                <ResponsiveContainer width="100%" aspect={14 / 7}>
                    <BarChart
                        data={data}
                        margin={{ top: 24, right: 32, left: 16, bottom: 24 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="activity"
                            tick={{ fontSize: 14 }}
                            tickMargin={8}
                        />
                        <YAxis
                            label={{ value: "Booked (min)", angle: -90, position: "insideLeft", offset: 10 }}
                            tick={{ fontSize: 14 }}
                            domain={[0, "auto"]}
                        />
                        <Tooltip formatter={(value: number) => `${value} min`} />
                        <Bar dataKey="duration" fill="#1976d2" barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}