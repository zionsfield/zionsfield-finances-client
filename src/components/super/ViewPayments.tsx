import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deletePayment, getPayments, getTerms, newTerm } from "../../services";
import { useAppSelector } from "../../store/hooks";
import { LinkRoutes, Term } from "../../utils";

function ViewPayments() {
  const user = useAppSelector((state) => state.users.user);
  const [payments, setPayments] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [sum, setSum] = useState(0);
  const [terms, setTerms] = useState<Term[]>([]);
  const [term, setTerm] = useState<Term>(user!.currentTerm);
  const [pageNumber, setPageNumber] = useState(0);
  const navigate = useNavigate();

  const loadPayments = async (term: any, page: number) => {
    const n = toast.loading("Getting payments");
    try {
      const { payments, count, sum } = await getPayments(term, page);
      console.log(payments);
      setPayments(payments);
      setSum(sum);
      setCount(count);
      setTerm(term);
      console.log(term);
      setTerms(await getTerms());

      toast.success("Got payments", { id: n });
    } catch (err: any) {
      if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
      const { msg } = err;
      toast.error("An error occurred: " + msg, { id: n });
      // if (status !== 200) setErrorMessage(msg);
      console.log(err);
    }
  };
  useEffect(() => {
    (async () => {
      {
        /* {term ? `${term.session} ${term.term}` : "Select"} Term */
      }
      await loadPayments(term, pageNumber);
    })();
    // eslint-disable-next-line
  }, []);

  const decPage = async () => {
    if (pageNumber === 0) return;
    setPageNumber((prev) => prev - 1);
    await loadPayments(term, pageNumber - 1);
  };
  const incPage = async () => {
    console.log(count / 10);

    if (pageNumber === Math.ceil(count / 10) - 1) return;
    setPageNumber((prev) => prev + 1);
    console.log(term);

    await loadPayments(term, pageNumber + 1);
  };

  return (
    <div className="flex-1 flex flex-col px-3 space-y-4 py-3">
      <h1 className="text-2xl font-bold">Payments</h1>
      <RefreshIcon
        className="w-6 h-6 fixed top-32 right-10 cursor-pointer"
        onClick={async () => await loadPayments(term, pageNumber)}
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
              await loadPayments(JSON.parse(e.target.value), pageNumber);
            }}
          >
            {/* <option value={JSON.stringify(user?.currentTerm) || "Select Term"}>
              {term ? `${term.session} ${term.term}` : "Select"} Term
            </option> */}
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
      <div>Total Payments for this term: ₦{sum}</div>
      {payments?.length > 0 && (
        <table className="text-center">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="py-4">Student Name</th>
              <th>Amount Paid</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment._id}>
                <td className="py-3">{payment.studentId.name}</td>
                <td>{payment.amountPaid}</td>
                <td>
                  {new Date(payment.createdAt).toDateString()}{" "}
                  {new Date(payment.createdAt).toLocaleTimeString()}
                </td>
                <td>
                  <TrashIcon
                    className="text-center text-gray-700 w-6 h-6 cursor-pointer"
                    onClick={async () => {
                      await deletePayment(payment._id);
                      await loadPayments(term, pageNumber);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* {payments?.map((payment) => (
        // <div
        //   key={payment._id}
        //   className="flex justify-evenly items-center border-b border-gray-300 py-2 mb-3"
        // >
        //   <h1 className="text-2xl font-semibold">{payment.studentId.name}</h1>
        //   <p>{payment.amountPaid}</p>
        //   <p>
        //     {new Date(payment.date).toDateString()}{" "}
        //     {new Date(payment.date).toLocaleTimeString()}
        //   </p>
        // </div>
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

export default ViewPayments;
