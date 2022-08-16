import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentsByClass } from "../../services";
import { LinkRoutes } from "../../utils";

interface Props {
  className: string;
}

interface Student {
  _id: string;
  name: string;
  amountPaid: number;
  tuition: number;
}

function ViewClass({ className }: Props) {
  const [students, setStudents] = useState<Student[]>(null!);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const cachedS = localStorage.getItem(className);

        if (!cachedS) {
          const s = await getStudentsByClass(className);
          setStudents(s);
          localStorage.setItem(className, JSON.stringify(s));
        } else {
          const cache = JSON.parse(cachedS);
          const s = await getStudentsByClass(className);
          if (JSON.stringify(s) === cachedS) {
            setStudents(cache);
          } else {
            localStorage.setItem(className, JSON.stringify(s));
            setStudents(s);
          }
        }
      } catch (err) {
        if (err === "Unauthorized") {
          navigate(LinkRoutes.LOGIN);
          window.location.reload();
        }
      }
    })();
  }, []);
  /**
   * if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
   */

  return (
    <div className="flex-col flex justify-center my-4">
      <h1 className="text-2xl font-bold">{className}</h1>
      <table className="text-center mb-5">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th>Student Name</th>
            <th>Amount Paid</th>
            <th>Total Tuition</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.amountPaid}</td>
              <td>{student.tuition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewClass;
