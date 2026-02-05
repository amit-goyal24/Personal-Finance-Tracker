class MockTransaction {
    constructor(data) {
        this._id = Math.floor(Math.random() * 100000000).toString();
        this.text = data.text;
        this.amount = data.amount;
        this.createdAt = new Date();
    }

    static async find() {
        return global.mockTransactions || [];
    }

    static async create(data) {
        if (!global.mockTransactions) {
            global.mockTransactions = [];
        }
        const transaction = new MockTransaction(data);
        global.mockTransactions.push(transaction);
        return transaction;
    }

    static async findById(id) {
        if (!global.mockTransactions) return null;
        return global.mockTransactions.find(t => t._id === id);
    }

    async deleteOne() {
        if (global.mockTransactions) {
            global.mockTransactions = global.mockTransactions.filter(t => t._id !== this._id);
        }
    }
}

module.exports = MockTransaction;
