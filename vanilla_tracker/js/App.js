import Model from './Model.js';
import View from './View.js';

/**
 * App Class
 * Acts as the Controller in the MVC pattern.
 */
class App {
    constructor() {
        this.model = new Model();
        this.view = new View();

        // Bind View events to Controller methods
        this.view.bindAddTransaction(this.handleAddTransaction.bind(this));
        this.view.bindDeleteTransaction(this.handleDeleteTransaction.bind(this));
        this.view.bindExportData(this.handleExportData.bind(this));
        this.view.bindAIChat(this.handleAIChat.bind(this));

        // Final Polish Bindings
        this.view.bindThemeToggle();
        this.view.bindNavbar();
        this.view.bindBudgetChange(this.handleBudgetChange.bind(this));

        // Initial Render
        this.onTransactionListChanged(this.model.transactions);
    }

    onTransactionListChanged = (transactions) => {
        this.view.displayTransactions(transactions);
        this.view.updateBalance(this.model.getBalance());
        this.view.updateIncomeExpense(this.model.getIncomeExpense());
        this.view.updateChart(this.model.getExpenseBreakdown());
        this.view.updateMonthlyChart(this.model.getMonthlyExpenses());
        // Update Budget UI
        this.view.updateBudgetUI(
            this.model.getTotalExpense().toFixed(2),
            this.model.getBudget()
        );
    };

    handleBudgetChange(amount) {
        this.model.setBudget(amount);
        this.onTransactionListChanged(this.model.transactions);
    }

    handleAddTransaction(text, amount) {
        this.model.addTransaction(text, amount);
        this.onTransactionListChanged(this.model.transactions);
    }

    handleDeleteTransaction(id) {
        this.model.deleteTransaction(id);
        this.onTransactionListChanged(this.model.transactions);
    }

    handleExportData() {
        const csvContent = this.model.generateCSV();
        this.view.downloadCSV(csvContent);
    }

    async handleAIChat(prompt) {
        // 1. Show User Message
        this.view.addMessage(prompt, true);

        // 2. Get AI Response
        const response = await this.model.queryAI(prompt);

        // 3. Show AI Response
        this.view.addMessage(response, false);
    }
}

// Initialize the App
const app = new App();
