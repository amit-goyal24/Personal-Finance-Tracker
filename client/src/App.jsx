import React from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { Chart } from './components/Chart';
import { MonthlyChart } from './components/MonthlyChart';
import { Budget } from './components/Budget';
import { AISidebar } from './components/AISidebar';
import { GlobalProvider } from './context/GlobalState';

import './index.css';

function App() {
  return (
    <GlobalProvider>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <AISidebar />

      <main className="glass-container">
        <header className="header">
          <Header />
          <p className="subtitle">MERN Stack Finance Tracker</p>
        </header>

        <div className="dashboard-grid">
          <section className="overview-panel">
            <Balance />
            <IncomeExpenses />
            <Budget />
            <Chart />
            <MonthlyChart />
          </section>

          <section className="transaction-panel">
            <AddTransaction />
            <TransactionList />
          </section>
        </div>
      </main>
    </GlobalProvider>
  );
}

export default App;
