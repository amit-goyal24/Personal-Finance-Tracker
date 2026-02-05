import Store from './Store.js';

/**
 * Model Class
 * Manages data, logic, and persistence.
 */
export default class Model {
    constructor() {
        this.store = new Store();
        this.transactions = this.store.getTransactions();
        // Separate key for budget to avoid conflicts
        this.budget = parseFloat(localStorage.getItem('finance_budget')) || 2000;
    }

    setBudget(amount) {
        this.budget = amount;
        localStorage.setItem('finance_budget', amount);
    }

    getBudget() {
        return this.budget;
    }

    getTotalExpense() {
        return this.transactions
            .filter(t => t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    }

    addTransaction(text, amount) {
        const transaction = {
            id: this._generateID(),
            text,
            amount: parseFloat(amount),
            date: new Date().toLocaleString()
        };

        this.transactions.push(transaction);
        this.store.saveTransactions(this.transactions);
    }

    deleteTransaction(id) {
        // using filter for immutability-like behavior
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.store.saveTransactions(this.transactions);
    }

    getBalance() {
        return this.transactions.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
    }

    getIncomeExpense() {
        const amounts = this.transactions.map(t => t.amount);

        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => acc + item, 0)
            .toFixed(2);

        const expense = (
            amounts
                .filter(item => item < 0)
                .reduce((acc, item) => acc + item, 0) * -1
        ).toFixed(2);

        return { income, expense };
    }

    /**
     * Prepares data for the Chart.
     * Groups expenses by common keywords or just returns raw data if complex.
     * For this demo, we'll categorize simply by Transaction Name.
     */
    getExpenseBreakdown() {
        const expenses = this.transactions.filter(t => t.amount < 0);
        return expenses.map(t => ({
            label: t.text,
            value: Math.abs(t.amount)
        }));
    }

    getMonthlyExpenses() {
        // Group expenses by "Month Year"
        const monthlyData = {};

        this.transactions.forEach(t => {
            if (t.amount < 0) {
                const date = new Date(t.date);
                // Handle invalid dates if any
                if (isNaN(date)) return;

                const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!monthlyData[key]) monthlyData[key] = 0;
                monthlyData[key] += Math.abs(t.amount);
            }
        });

        return {
            labels: Object.keys(monthlyData),
            values: Object.values(monthlyData)
        };
    }

    // A simple regex-based "AI" to parse natural language
    async queryAI(prompt) {
        // Simulate network delay for realism
        await new Promise(r => setTimeout(r, 600));

        const p = prompt.toLowerCase();

        if (p.includes('total') && (p.includes('spent') || p.includes('expense'))) {
            const total = this.transactions
                .filter(t => t.amount < 0)
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            return `You have spent a total of $${total.toFixed(2)} so far.`;
        }

        if (p.includes('income') || p.includes('earned')) {
            const total = this.transactions
                .filter(t => t.amount > 0)
                .reduce((acc, t) => acc + t.amount, 0);
            return `Your total income is $${total.toFixed(2)}.`;
        }

        if (p.includes('balance') || p.includes('left')) {
            return `Your current balance is $${this.getBalance()}.`;
        }

        if (p.includes('spent on') || p.includes('cost of')) {
            // Extract the noun after "on" or "of"
            // Simple split logic
            const words = p.split(' ');
            const onIndex = words.indexOf('on'); // find "on"
            if (onIndex !== -1 && words[onIndex + 1]) {
                const category = words[onIndex + 1];
                const total = this.transactions
                    .filter(t => t.amount < 0 && t.text.toLowerCase().includes(category))
                    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

                return `You've spent $${total.toFixed(2)} on "${category}".`;
            }
        }

        // Math Calculation Logic
        // Check if the prompt contains only numbers and operators (+, -, *, /, %)
        const mathRegex = /^[0-9+\-*/().\s%]+$/;
        if (mathRegex.test(p)) {
            try {
                // Using Function instead of eval for slightly better safety scope, though logic is simple
                const result = new Function('return ' + p)();
                return `The result is ${result}`;
            } catch (e) {
                return "I couldn't calculate that. Please check your math.";
            }
        }

        return "I'm still learning! Ask me about 'balance', 'total expenses', 'spent on [category]', or give me a math problem like '50 * 5'.";
    }

    generateCSV() {
        const headers = ['ID', 'Description', 'Amount', 'Date'];
        const rows = this.transactions.map(t => [
            t.id,
            `"${t.text}"`, // quote strings to handle commas
            t.amount,
            `"${t.date}"`
        ]);

        return [headers, ...rows].map(e => e.join(',')).join('\n');
    }

    _generateID() {
        return Math.floor(Math.random() * 100000000);
    }
}
