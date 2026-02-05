import React, { useContext, useEffect, useState, useRef } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
    const { transactions, getTransactions, addTransaction } = useContext(GlobalContext);
    const [filter, setFilter] = useState('all');
    const fileInputRef = useRef(null);

    useEffect(() => {
        getTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'income') return t.amount > 0;
        if (filter === 'expense') return t.amount < 0;
        return true;
    });

    const downloadCSV = () => {
        const headers = ['Description', 'Amount', 'Date'];
        const rows = transactions.map(t => [
            `"${t.text}"`,
            t.amount,
            `"${new Date(t.createdAt).toLocaleDateString()}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const csvData = evt.target.result;
            const lines = csvData.split(/\r?\n/);
            const startIndex = lines[0].toLowerCase().includes('amount') ? 1 : 0;

            const transactionsToImport = [];

            // 1. Parse all valid lines first
            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                if (parts.length >= 2) {
                    let text = parts[0].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                    const amount = parseFloat(parts[1].trim());

                    if (text && !isNaN(amount)) {
                        transactionsToImport.push({
                            id: Math.floor(Math.random() * 100000000),
                            text,
                            amount
                        });
                    }
                }
            }

            // 2. Import sequentially to avoid flooding the backend
            if (transactionsToImport.length > 0) {
                if (confirm(`Found ${transactionsToImport.length} transactions. Import them now?`)) {
                    let successCount = 0;
                    for (const transaction of transactionsToImport) {
                        try {
                            await addTransaction(transaction);
                            successCount++;
                        } catch (err) {
                            console.error("Failed to import transaction:", transaction, err);
                        }
                    }
                    alert(`Successfully imported ${successCount} out of ${transactionsToImport.length} transactions.`);
                }
            } else {
                alert('No valid transactions found in file.');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>History</h3>
                <div className="filter-controls">
                    <button
                        className={`btn-sm ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}>All</button>
                    <button
                        className={`btn-sm ${filter === 'income' ? 'active' : ''}`}
                        onClick={() => setFilter('income')}>Income</button>
                    <button
                        className={`btn-sm ${filter === 'expense' ? 'active' : ''}`}
                        onClick={() => setFilter('expense')}>Expense</button>
                </div>
            </div>

            <ul className="transaction-list">
                {filteredTransactions.map(transaction => (<Transaction key={transaction._id} transaction={transaction} />))}
            </ul>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={downloadCSV} style={{ flex: 1 }}>
                    Export CSV
                </button>

                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button className="btn btn-primary" onClick={() => fileInputRef.current.click()} style={{ flex: 1 }}>
                    Import CSV
                </button>
            </div>
        </>
    )
}
