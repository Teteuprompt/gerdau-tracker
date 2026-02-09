import React, { useState } from 'react';
import { Save, Plus, X, Layers } from 'lucide-react';
import { OrderEntry, BoardEntry } from '../types';
import { BRANCH_OPTIONS, REGION_OPTIONS } from '../constants';

interface EntryFormProps {
  onSave: (entry: Omit<OrderEntry, 'id' | 'createdAt'>) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSave }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    orderNumber: '',
    internalId: '',
    branch: 'SC1',
    region: 'NORDESTE',
    observation: '',
  });

  const [boards, setBoards] = useState<BoardEntry[]>([]);
  const [currentBoardPositions, setCurrentBoardPositions] = useState('');
  const [currentBoardName, setCurrentBoardName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBoardPositions) return;
    
    const positions = parseInt(currentBoardPositions, 10);
    if (isNaN(positions) || positions <= 0) return;

    const newBoard: BoardEntry = {
      id: crypto.randomUUID(),
      name: currentBoardName.trim(), // Salva o nome da prancha
      positionCount: positions
    };

    setBoards(prev => [...prev, newBoard]);
    setCurrentBoardPositions('');
    setCurrentBoardName('');
  };

  const handleRemoveBoard = (id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
  };

  const handleFinalizeOrder = () => {
    if (!formData.orderNumber) {
        alert("Digite o número do pedido");
        return;
    }
    if (boards.length === 0) {
        alert("Adicione pelo menos uma prancha");
        return;
    }

    const totalPositions = boards.reduce((acc, b) => acc + b.positionCount, 0);

    onSave({
      date: formData.date,
      orderNumber: formData.orderNumber,
      subItem: '', 
      internalId: formData.internalId,
      branch: formData.branch,
      region: formData.region,
      boards: boards,
      totalPositions: totalPositions,
      observation: formData.observation,
    });

    // Reset Form
    setFormData({
      date: today,
      orderNumber: '',
      internalId: '',
      branch: 'SC1',
      region: 'NORDESTE',
      observation: '',
    });
    setBoards([]);
    setCurrentBoardPositions('');
    setCurrentBoardName('');
    alert("Pedido salvo com sucesso!");
  };

  const totalPositions = boards.reduce((acc, b) => acc + b.positionCount, 0);

  // Common input classes for consistency
  const inputClass = "w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors";
  const labelClass = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase";

  return (
    <div className="space-y-6 pb-24">
      <header className="bg-white dark:bg-slate-900 p-4 shadow-sm rounded-b-2xl border-b dark:border-slate-800 transition-colors">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Novo Pedido</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Adicione as pranchas e feche o pedido</p>
      </header>

      <div className="px-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 mb-4 transition-colors">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b dark:border-slate-700 pb-2 mb-2">Dados do Pedido</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Data</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Filial</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={inputClass}
              >
                {BRANCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1 col-span-1">
              <label className={labelClass}>Pedido</label>
              <input
                type="text"
                name="orderNumber"
                placeholder="4014..."
                value={formData.orderNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
             <div className="space-y-1 col-span-1">
              <label className={labelClass}>ID</label>
              <input
                type="text"
                name="internalId"
                placeholder="205..."
                value={formData.internalId}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1">
             <label className={labelClass}>Região</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={inputClass}
              >
                {REGION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
          </div>
          
           <div className="space-y-1">
            <label className={labelClass}>Observação</label>
            <textarea
              name="observation"
              rows={1}
              value={formData.observation}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Boards Section */}
        <div className="bg-blue-50 dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4 transition-colors">
           <div className="flex justify-between items-center">
             <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
               <Layers size={16} />
               Pranchas ({boards.length})
             </h3>
             <span className="text-sm font-bold text-blue-900 dark:text-blue-100 bg-blue-200 dark:bg-blue-900 px-2 py-1 rounded">
               Total: {totalPositions} pos
             </span>
           </div>

           <form onSubmit={handleAddBoard} className="flex gap-2">
             <div className="flex-[2]">
               {/* Explicitly setting bg-white to fix "black" issue, and dark mode colors */}
               <input
                 type="text"
                 placeholder="Nome da Prancha"
                 value={currentBoardName}
                 onChange={(e) => setCurrentBoardName(e.target.value)}
                 className="w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
               />
             </div>
             <div className="flex-1">
               <input
                 type="number"
                 inputMode="numeric"
                 placeholder="Qtd"
                 value={currentBoardPositions}
                 onChange={(e) => setCurrentBoardPositions(e.target.value)}
                 className="w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center placeholder:text-slate-400"
               />
             </div>
             <button 
               type="submit"
               disabled={!currentBoardPositions}
               className="bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
             >
               <Plus size={24} />
             </button>
           </form>

           {boards.length > 0 && (
             <div className="space-y-2 mt-2 max-h-48 overflow-y-auto no-scrollbar">
               {boards.map((board, index) => (
                 <div key={board.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-blue-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <span className="text-sm text-slate-700 dark:text-slate-200 font-semibold">{board.name || `Prancha ${index + 1}`}</span>
                   <div className="flex items-center gap-3">
                     <span className="font-bold text-slate-500 dark:text-slate-400 text-sm">{board.positionCount} pos</span>
                     <button onClick={() => handleRemoveBoard(board.id)} className="text-red-400 hover:text-red-500">
                       <X size={18} />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        <button
          onClick={handleFinalizeOrder}
          className="w-full mt-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Fechar Pedido
        </button>
      </div>
    </div>
  );
};