export interface Term {
  session: string;
  term: string;
}

export interface UserState {
  _id: string;
  name: string;
  email: string;
  currentTerm: Term;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  _id: string;
  details: string;
  amountPaid: number;
  date: Date;
  currentTerm: Term;
}

export type Page =
  | "ADD_STUDENT"
  | "ADD_PAYMENT"
  | "ADD_EXPENSE"
  | "DASHBOARD"
  | "VIEW_STUDENTS"
  | "VIEW_EXPENSES"
  | "VIEW_PAYMENTS";
