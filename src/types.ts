export type Customer = {
    firstname: string;
    lastname: string;
    streetaddress: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
    _links: {
        self: {
            // A link to the customer's OWN information. (string)
            href: string;
        }
        customer: {
            // A link to the customer's information. (string)
            href: string;
        }
        trainings: {
            // A link to the customer's trainings. (string)
            href: string;
        }
    }
}