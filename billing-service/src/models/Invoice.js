class Invoice {
    constructor(schedule, customer) {
        this.schedule = schedule;
        this.customer = customer;
    }

    generateEmailContent() {
        return `Hello ${this.customer.name},\n\n` +
            `Your vehicle maintenance has been completed.\n` +
            `Total Cost: $500 \n` +
            `Thank you for choosing our service!`;
    }
}

module.exports = Invoice;
