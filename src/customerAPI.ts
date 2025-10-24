export function getCustomers() {
    return fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
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
            response.json()
        })
}