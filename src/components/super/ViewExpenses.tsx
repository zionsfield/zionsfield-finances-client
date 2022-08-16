import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getExpenses, getTerms, newTerm } from "../../services";
import { useAppSelector } from "../../store/hooks";
import { Expense, LinkRoutes, Term } from "../../utils";

function ViewExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [count, setCount] = useState(0);
  const [sum, setSum] = useState(0);
  const [terms, setTerms] = useState<Term[]>([]);
  const [term, setTerm] = useState<Term>();
  const [pageNumber, setPageNumber] = useState(0);
  const user = useAppSelector((state) => state.users.user);

  const navigate = useNavigate();
  const loadExpenses = async (term: any, page: number) => {
    const n = toast.loading("Getting expenses");
    try {
      console.log(term);
      const { expenses, count, sum } = await getExpenses(term, page);
      toast.success("Got expenses", { id: n });
      setExpenses(expenses);
      setSum(sum);
      setCount(count);
      const data = {
        term,
        expenses,
        sum,
        count,
      };
      localStorage.setItem(
        `${user?._id} expenses` || "1 expenses",
        JSON.stringify(data)
      );
    } catch (err: any) {
      if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
      const { status, msg } = err;
      toast.error("An error occurred: " + msg, { id: n });
      // if (status !== 200) setErrorMessage(msg);
      console.log(err);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const data = localStorage.getItem(
          `${user?._id} expenses` || "1 expenses"
        );
        if (data) {
          const cache = JSON.parse(data);
          setCount(cache.count);
          setSum(cache.sum);
          setExpenses(cache.expenses);
          setTerm(cache.term);
        }
        setTerms(await getTerms());
      } catch (err: any) {
        if (err === "Unauthorized") {
          navigate(LinkRoutes.LOGIN);
          window.location.reload();
        }
        const { status, msg } = err;
        // if (status !== 200) setErrorMessage(msg);
        console.log(err);
      }
    })();
  }, []);

  const decPage = async () => {
    if (pageNumber === 0) return;
    setPageNumber((prev) => prev - 1);
    await loadExpenses(term, pageNumber - 1);
  };
  const incPage = async () => {
    console.log(count / 10);

    if (pageNumber === Math.ceil(count / 10) - 1) return;
    setPageNumber((prev) => prev + 1);
    console.log(term);

    await loadExpenses(term, pageNumber + 1);
  };

  return (
    <div className="flex-1 flex flex-col px-3 space-y-4 py-3">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <RefreshIcon
        className="w-6 h-6 fixed top-32 right-10 cursor-pointer"
        onClick={async () => await loadExpenses(term, pageNumber)}
      />
      <div className="flex space-x-3 items-center">
        <label className="flex items-center flex-1 space-x-3">
          <span className="flex-shrink-0">Choose term</span>
          <select
            className="flex-1 border rounded shadow ring-blue-400 
          px-4 py-3 w-full mt-1 outline-none focus:ring"
            onChange={async (e: any) => {
              console.log(e.target.value);
              setTerm(JSON.parse(e.target.value));
              await loadExpenses(JSON.parse(e.target.value), pageNumber);
            }}
          >
            <option value={JSON.stringify(term) || "Select Term"}>
              {term ? `${term.session} ${term.term}` : "Select"} Term
            </option>
            {terms.map(
              (termItem: any) =>
                JSON.stringify(termItem) !== JSON.stringify(term) && (
                  <option
                    key={`${termItem.session} ${termItem.term}`}
                    value={JSON.stringify(termItem)}
                  >
                    {termItem.session} {termItem.term} Term
                  </option>
                )
            )}
          </select>
        </label>
        <button
          className="bg-blue-500 text-white py-3 px-2 rounded-md"
          onClick={async () => await newTerm()}
        >
          New Term
        </button>
      </div>
      <div>Total Expenses for this term: ₦{sum}</div>
      {expenses?.length > 0 && (
        <table className="text-center">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="py-4">Expense Details</th>
              <th>Amount Paid</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense) => (
              <tr key={expense._id}>
                <td className="py-3">{expense.details}</td>
                <td>{expense.amountPaid}</td>
                <td>
                  {new Date(expense.date).toDateString()}{" "}
                  {new Date(expense.date).toLocaleTimeString()}
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      )}

      {/* {expenses?.map((expense) => (
        <div
          key={expense._id}
          className="flex justify-evenly items-center border-b border-gray-300 py-2 mb-3"
        >
          <h1 className="text-2xl font-semibold">{expense.details}</h1>
          <p>{expense.amountPaid}</p>
          <p>
            {new Date(expense.date).toDateString()}{" "}
            {new Date(expense.date).toLocaleTimeString()}
          </p>
        </div>
      ))} */}
      <div className="h-10"></div>
      <div className="fixed bottom-4 items-center flex w-full justify-evenly z-50">
        <ArrowLeftIcon
          className={`w-6 cursor-pointer ${
            pageNumber === 0 && "text-gray-300"
          }`}
          onClick={() => decPage()}
        />
        <span>Page: {pageNumber + 1}</span>
        <ArrowRightIcon
          className={`w-6 cursor-pointer ${
            pageNumber === Math.ceil(count / 10) - 1 && "text-gray-300"
          }`}
          onClick={() => incPage()}
        />
      </div>
    </div>
  );
}

export default ViewExpenses;
