import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { EntryForm } from './components/EntryForm';
import { OrdersList } from './components/OrdersList';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { OrderEntry, MonthlyStatus, Tab } from './types';
import { STORAGE_KEY_ORDERS, STORAGE_KEY_STATUS } from './constants';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ENTRY);
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [statuses, setStatuses] = useState<MonthlyStatus[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Load data from local storage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    const savedStatuses = localStorage.getItem(STORAGE_KEY_STATUS);
    
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
    
    if (savedStatuses) {
      try {
        setStatuses(JSON.parse(savedStatuses));
      } catch (e) {
         console.error("Failed to parse statuses", e);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(statuses));
  }, [statuses]);

  const handleSaveOrder = (newOrderData: Omit<OrderEntry, 'id' | 'createdAt'>) => {
    const newOrder: OrderEntry = {
      ...newOrderData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setCurrentTab(Tab.ORDERS); // Switch to orders list after saving
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido e todas as suas pranchas?')) {
      setOrders(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleUpdateStatus = (monthKey: string, status: MonthlyStatus['status']) => {
    setStatuses(prev => {
      const existing = prev.find(s => s.monthKey === monthKey);
      if (existing) {
        return prev.map(s => s.monthKey === monthKey ? { ...s, status } : s);
      }
      return [...prev, { monthKey, status }];
    });
  };

  // Helper to export data
  const handleExportData = () => {
    const data = {
      orders,
      statuses,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gerdau_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 shadow-2xl relative border-x dark:border-slate-800">
        
        {currentTab === Tab.ENTRY && (
          <EntryForm 
            onSave={handleSaveOrder} 
          />
        )}

        {currentTab === Tab.ORDERS && (
          <OrdersList 
            orders={orders} 
            onDelete={handleDeleteOrder} 
          />
        )}
        
        {currentTab === Tab.DASHBOARD && (
          <Dashboard entries={orders} />
        )}

        {currentTab === Tab.HISTORY && (
          <History 
            entries={orders} 
            statuses={statuses} 
            onUpdateStatus={handleUpdateStatus}
            onExport={handleExportData}
            installPrompt={deferredPrompt}
            onInstall={handleInstallClick}
          />
        )}

        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      </main>
    </div>
  );
}

export default App;