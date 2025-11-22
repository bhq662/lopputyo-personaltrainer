import type { Customer } from "./types";

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

export function saveCustomer(newCustomer: Customer) {
    const url = new URL('customers', CUSTOMER_API_BASE).toString();
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when adding a Customer: " + response.statusText);
            }
            // handle APIs that return no JSON body
            if (response.status === 204) return null;
            return response.json().catch(() => null);
        });
}

export function deleteCustomer(url: string) {
    return fetch(url, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting customer: " + response.statusText);
            }
            // Handle 204 No Content
            return response.status === 204 ? null : response.json();
        })
}