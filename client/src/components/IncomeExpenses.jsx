import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const IncomeExpenses = () => {
    const { transactions } = useContext(GlobalContext);

    const amounts = transactions.map(transaction => transaction.amount);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) *
        -1
    ).toFixed(2);

    return (
        <div className="stats-row">
            <div className="stat-card income">
                <h4>Income</h4>
                <p className="money">+${income}</p>
            </div>
            <div className="stat-card expense">
                <h4>Expense</h4>
                <p className="money">-${expense}</p>
            </div>
        </div>
    )
}
