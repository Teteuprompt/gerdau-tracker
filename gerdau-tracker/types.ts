export interface BoardEntry {
  id: string;
  name?: string; // Nome da prancha
  positionCount: number;
}

export interface OrderEntry {
  id: string;
  date: string; // YYYY-MM-DD
  orderNumber: string; // Pedido
  subItem: string; // Item (Depreciado na UI, mantido por compatibilidade)
  internalId: string; // ID
  branch: string; // Filial
  region: string;
  boards: BoardEntry[]; // Individual boards
  totalPositions: number; // Sum of board positions
  observation?: string;
  createdAt: number;
}

export interface MonthlyStatus {
  monthKey: string; // YYYY-MM
  status: 'pending' | 'invoiced' | 'paid';
}

export enum Tab {
  ENTRY = 'ENTRY',
  ORDERS = 'ORDERS',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
}