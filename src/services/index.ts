import { deleteVerb, get, getWithQuery, post, put } from "../utils";

export const me = async () => {
  const res = await get("users/me");
  return res.data.user;
};

export const login = async (data: any) => {
  await post("auth/login", data);
};

export const getClasses = async () => {
  const res = await get("users/classes");
  return res.data.classes;
};

export const addStudent = async (data: any) => {
  const res = await post("students/add", data);
  return res.data.student;
};

export const addPayment = async (data: any) => {
  const res = await post("payments/add", data);
  return res.data.payment;
};

export const addExpense = async (data: any) => {
  const res = await post("expenses/add", data);
  return res.data.expense;
};

export const getStudentsByClass = async (className: string) => {
  const res = await get(`students/class?className=${className}&details=true`);
  return res.data.students;
};

export const getStudentNamesByClass = async (className: string) => {
  const res = await get(`students/class?className=${className}`);
  return res.data.students;
};

export const deleteStudent = async (_id: string) => {
  const res = await deleteVerb(`students/delete?_id=${_id}`);
  return res.data;
};

export const getTerms = async () => {
  const res = await get("users/terms");
  return res.data.terms;
};

export const getExpenses = async (term: any, page = 0) => {
  console.log(term.session);

  const res = await getWithQuery("expenses/all", {
    page,
    session: term.session,
    term: term.term,
  });
  console.log(res.data.expenses);

  return res.data;
};

export const getPayments = async (term: any, page = 0) => {
  console.log(term.session);

  const res = await getWithQuery("payments/all", {
    page,
    session: term.session,
    term: term.term,
  });
  console.log(res.data.expenses);

  return res.data;
};

export const newTerm = async () => {
  const res = await put("users/terms");
  return res.data;
};
