import type { Training } from "./types";

// date formatting imports
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const TRAINING_API_BASE = import.meta.env.VITE_API_TRAINING_URL as string;
if (!TRAINING_API_BASE) throw new Error('VITE_API_TRAINING_URL is not defined');

export function getTrainings() {
    // use the top-level TRAINING_API_BASE (case-sensitive) and correct endpoint
    return fetch(new URL('trainings', TRAINING_API_BASE).toString())
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching trainings: " + response.statusText);
            }
            return response.json();
        })
}

const CUSTOMER_API_BASE = import.meta.env.VITE_API_CUSTOMER_URL as string;
if (!CUSTOMER_API_BASE) throw new Error('VITE_API_CUSTOMER_URL is not defined');

export function getCustomers() {
    return fetch(new URL('customers', CUSTOMER_API_BASE).toString())
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching customers: " + response.statusText);
            }
            return response.json();
        })
}

export function getCustomerByUrl(href: string) {
    if (!href) throw new Error('getCustomerByUrl requires a href');
    return fetch(href)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching customer by url: " + response.statusText);
            }
            return response.json();
        })
}

export function editTraining(url: string, updatedTraining: Training) {
    return fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTraining)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when editing Customer");
            return response.json();
        });
}

export async function saveTraining(newTraining: Training) {
    const url = new URL('trainings', TRAINING_API_BASE).toString();

    // parse input using dayjs with common formats (same lib used in Traininglist)
    let dateToSend: string | undefined = newTraining.date;
    if (dateToSend) {
        const formats = [
            'DD.MM.YYYY HH:mm',
            'DD.MM.YYYY',
            'YYYY-MM-DDTHH:mm',
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss.SSSZ'
        ];
        let parsed = dayjs(dateToSend, formats, true); // strict parse with known formats
        if (!parsed.isValid()) {
            parsed = dayjs(dateToSend); // fallback to Date parsing
        }
        if (parsed.isValid()) {
            // send ISO if time present, otherwise yyyy-MM-dd which backend accepts
            dateToSend = dateToSend.includes(':') ? parsed.toISOString() : parsed.format('YYYY-MM-DD');
        }
    }

    const payload = {
        date: dateToSend,
        duration: newTraining.duration,
        activity: newTraining.activity,
        customer: newTraining.customer
    };

    console.log("saveTraining -> POST", url, payload);

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "<no body>");
        throw new Error(`Error when adding a Training: ${res.status} ${res.statusText} - ${body}`);
    }

    if (res.status === 204) return null;
    return res.json().catch(() => null);
}

export function deleteTraining(url: string) {
    return fetch(url, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting training: " + response.statusText);
            }
            // handle 204 No Content
            return response.status === 204 ? null : response.json();
        })
}