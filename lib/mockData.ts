export type TransactionKind = "income" | "expense";

export interface TransactionRecord {
  id: string;
  title: string;
  amount: number;
  kind: TransactionKind;
  category: string;
  date: string;
}

export interface TargetRecord {
  id: string;
  name: string;
  saved: number;
  total: number;
  date: string;
}

export const transactionData: TransactionRecord[] = [
  {
    id: "t1",
    title: "Freelance work",
    amount: 350,
    kind: "income",
    category: "Work",
    date: "Today",
  },
  {
    id: "t2",
    title: "School fees",
    amount: 250,
    kind: "expense",
    category: "Education",
    date: "Yesterday",
  },
  {
    id: "t3",
    title: "Food & meals",
    amount: 45.5,
    kind: "expense",
    category: "Food",
    date: "Yesterday",
  },
  {
    id: "t4",
    title: "Gift",
    amount: 50,
    kind: "income",
    category: "Other",
    date: "May 19",
  },
];

export const targetData: TargetRecord[] = [
  { id: "bike", name: "Buy a bike", saved: 1000, total: 3000, date: "20 Jun" },
  {
    id: "laptop",
    name: "New laptop",
    saved: 1200,
    total: 3000,
    date: "05 Aug",
  },
  {
    id: "travel",
    name: "Travel trip",
    saved: 750,
    total: 3000,
    date: "18 Dec",
  },
];
