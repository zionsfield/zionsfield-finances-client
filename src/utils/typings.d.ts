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

export interface Student {
  _id: string;
  name: string;
  amountPaid: number;
  tuition: number;
}

export interface Payment {
  _id: string;
  amountPaid: number;
  currentTerm: Term;
  studentId: Student;
  classId: string;
  createdAt: Date;
}

export interface Expense {
  _id: string;
  details: string;
  amountPaid: number;
  date: Date;
  currentTerm: Term;
  createdAt: Date;
}

export interface EditPayment {
  amountPaid: number;
}

export interface EditExpense {
  details: string;
  amountPaid: number;
}

export type Page =
  | "ADD_STUDENT"
  | "ADD_PAYMENT"
  | "ADD_EXPENSE"
  | "DASHBOARD"
  | "VIEW_STUDENTS"
  | "VIEW_EXPENSES"
  | "VIEW_PAYMENTS";
