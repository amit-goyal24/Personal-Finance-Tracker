import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Budget = () => {
    const { transactions } = useContext(GlobalContext);
    const [budget, setBudget] = useState(localStorage.getItem('budget') || 2000);
    const [isEditing, setIsEditing] = useState(false);

    const expenses = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const handleBudgetChange = (e) => {
        const val = e.target.value;
        setBudget(val);
        localStorage.setItem('budget', val);
    };

    const percent = Math.min((expenses / budget) * 100, 100);
    const isOverBudget = expenses > budget;

    return (
        <div className="budget-container">
            <div className="budget-header">
                <h4>Monthly Budget</h4>
                <span onClick={() => setIsEditing(!isEditing)} style={{ cursor: 'pointer' }}>
                    ${expenses.toFixed(2)} / ${budget} ✎
                </span>
            </div>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>

            {isEditing && (
                <input
                    type="number"
                    id="budget-input"
                    value={budget}
                    onChange={handleBudgetChange}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                />
            )}
        </div>
    )
}
