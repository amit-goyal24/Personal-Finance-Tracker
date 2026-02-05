/**
 * View Class
 * Handles all UI updates and Event Listeners.
 */
export default class View {
    constructor() {
        this.balance = document.getElementById('balance');
        this.money_plus = document.getElementById('money-plus');
        this.money_minus = document.getElementById('money-minus');
        this.list = document.getElementById('list');
        this.form = document.getElementById('transaction-form');
        this.text = document.getElementById('text');
        this.amount = document.getElementById('amount');
        this.exportBtn = document.getElementById('export-btn');

        // AI Sidebar Elements
        this.aiSidebar = document.getElementById('ai-sidebar');
        this.aiToggleBtn = document.getElementById('ai-toggle-btn');
        this.aiCloseBtn = document.getElementById('ai-close-btn');
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.chatOutput = document.getElementById('chat-output');

        // Chart Instances
        this.ctx = document.getElementById('expenseChart').getContext('2d');
        this.monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        this.chart = null;
        this.monthlyChart = null;

        // Final Polish Elements
        this.themeToggle = document.getElementById('theme-toggle');
        this.budgetVal = document.getElementById('budget-val');
        this.budgetProgress = document.getElementById('budget-progress');
        this.budgetInput = document.getElementById('budget-input');
    }

    displayTransactions(transactions) {
        this.list.innerHTML = '';
        transactions.forEach(transaction => {
            const sign = transaction.amount < 0 ? '-' : '+';
            const item = document.createElement('li');

            // Add class for styling
            item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

            item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" data-id="${transaction.id}">×</button>
      `;

            this.list.appendChild(item);
        });
    }

    updateBalance(balance) {
        this.balance.innerText = `$${balance}`;
    }

    updateIncomeExpense({ income, expense }) {
        this.money_plus.innerText = `+$${income}`;
        this.money_minus.innerText = `-$${expense}`;
    }



    updateMonthlyChart({ labels, values }) {
        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }

        this.monthlyChart = new Chart(this.monthlyCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: values,
                    backgroundColor: '#4f46e5',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Monthly Expense Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    updateBudgetUI(expense, budget) {
        this.budgetVal.innerText = `$${expense} / $${budget}`;
        const percent = Math.min((expense / budget) * 100, 100);
        this.budgetProgress.style.width = `${percent}%`;

        if (expense > budget) {
            this.budgetProgress.classList.add('over-budget');
        } else {
            this.budgetProgress.classList.remove('over-budget');
        }
    }

    // --- AI Chat UI Methods ---

    toggleSidebar() {
        this.aiSidebar.classList.toggle('open');
    }

    addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add(isUser ? 'user-msg' : 'ai-msg');
        msgDiv.innerText = text;
        this.chatOutput.appendChild(msgDiv);
        this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
    }

    getChatInput() {
        return this.chatInput.value;
    }

    clearChatInput() {
        this.chatInput.value = '';
    }

    downloadCSV(content) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- Event Bindings ---

    bindAddTransaction(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this.text.value.trim() === '' || this.amount.value.trim() === '') {
                alert('Please enter a description and amount');
                return;
            }

            handler(this.text.value, this.amount.value);
            this._resetInput();
        });
    }

    bindDeleteTransaction(handler) {
        this.list.addEventListener('click', event => {
            if (event.target.classList.contains('delete-btn')) {
                const id = parseInt(event.target.getAttribute('data-id'));
                handler(id);
            }
        });
    }

    bindExportData(handler) {
        this.exportBtn.addEventListener('click', () => {
            handler();
        });
    }

    bindAIChat(handler) {
        // Toggle Sidebar
        this.aiToggleBtn.addEventListener('click', () => this.toggleSidebar());
        this.aiCloseBtn.addEventListener('click', () => this.toggleSidebar());

        // Submit Chat
        this.chatForm.addEventListener('submit', event => {
            event.preventDefault();
            const prompt = this.getChatInput();
            if (prompt.trim() !== '') {
                handler(prompt);
                this.clearChatInput();
            }
        });
    }

    bindThemeToggle() {
        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            // Check if we are now in light mode
            const isLight = document.body.classList.contains('light-mode');
            this.themeToggle.innerText = isLight ? '🌙' : '☀️';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        // Default is dark. If saved is light, add class
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            this.themeToggle.innerText = '🌙';
        } else {
            // Ensure icons are correct for default dark
            this.themeToggle.innerText = '☀️';
        }
    }

    bindNavbar() {
        const hamburger = document.getElementById('hamburger-btn');
        const navLinks = document.getElementById('nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('toggle');
            });

            // Close nav when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('toggle');
                });
            });
        }
    }

    bindBudgetChange(handler) {
        this.budgetInput.addEventListener('change', (e) => {
            const val = parseFloat(e.target.value);
            if (val > 0) handler(val);
        });
    }

    _resetInput() {
        this.text.value = '';
        this.amount.value = '';
    }
}
