import React, { useState } from 'react';
import { OrderEntry } from '../types';
import { PRICE_PER_POSITION } from '../constants';
import { Trash2, ChevronDown, ChevronUp, Layers, Calendar, MapPin, Hash } from 'lucide-react';

interface OrdersListProps {
  orders: OrderEntry[];
  onDelete: (id: string) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sort by created date descending
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6 pb-24">
      <header className="bg-white dark:bg-slate-900 p-4 shadow-sm rounded-b-2xl border-b dark:border-slate-800 transition-colors">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Meus Pedidos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Consulte os pedidos e pranchas executadas</p>
      </header>

      <div className="px-4 space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="text-center p-12 text-slate-400 dark:text-slate-600">
            <Layers className="mx-auto mb-2 opacity-30" size={48} />
            <p>Nenhum pedido registrado.</p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded">
                       {order.branch}
                     </span>
                     <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(order.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                       {order.totalPositions} pos
                     </span>
                     {expandedId === order.id ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <Hash size={14} className="text-slate-400" />
                   Pedido: {order.orderNumber}
                </h3>
                
                <div className="mt-1 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                   {order.internalId && <span>ID: {order.internalId}</span>}
                </div>
                 <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                   <MapPin size={12} />
                   {order.region}
                </div>
              </div>

              {expandedId === order.id && (
                <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-4 transition-colors">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex justify-between items-center">
                    <span>Detalhamento de Pranchas</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 rounded-full text-[10px]">{order.boards.length} un</span>
                  </h4>
                  <div className="space-y-2 mb-4">
                    {order.boards.map((board, idx) => (
                      <div key={board.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 text-sm transition-colors">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{board.name || `Prancha ${idx + 1}`}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                             R$ {(board.positionCount * PRICE_PER_POSITION).toFixed(2)}
                           </span>
                           <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{board.positionCount} pos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.observation && (
                    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-100 dark:border-yellow-900/50 text-xs text-yellow-800 dark:text-yellow-200 italic">
                      Obs: {order.observation}
                    </div>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(order.id);
                    }}
                    className="w-full py-2 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} /> Excluir Pedido
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};