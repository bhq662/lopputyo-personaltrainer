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

export function deleteCustomer(url: string) {
    return fetch(url, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting customer: " + response.statusText);
            }
            // handle 204 No Content
            return response.status === 204 ? null : response.json();
        })
}