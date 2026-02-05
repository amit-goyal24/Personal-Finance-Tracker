/**
 * Store Class
 * Handles all LocalStorage interactions securely.
 */
export default class Store {
    constructor(key = 'finance_tracker_v2') {
        this.key = key;
    }

    getTransactions() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading from storage", error);
            return [];
        }
    }

    saveTransactions(transactions) {
        try {
            localStorage.setItem(this.key, JSON.stringify(transactions));
        } catch (error) {
            console.error("Error saving to storage", error);
        }
    }
}
