export function getTrainings() {
    return fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching trainings: " + response.statusText);
            }
            return response.json();
        })
}

export function deleteTraining(url: string) {
    return fetch(url, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting training: " + response.statusText);
            }
            response.json()
        })
}