import { TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, getStudentsByClass } from "../../services";
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
  const loadStudentsByClass = async () => {
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
  };
  useEffect(() => {
    (async () => {
      await loadStudentsByClass();
    })();
  }, []);
  /**
   * if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
   */

  return (
    <div className="flex-col flex justify-center my-4 overflow-scroll scrollbar-hide">
      <h1 className="text-2xl font-bold">{className}</h1>
      <table className="text-center mb-5 overflow-scroll min-w-[500px]">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th>Student Name</th>
            <th>Amount Paid</th>
            <th>Total Tuition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.amountPaid}</td>
              <td>{student.tuition}</td>
              <td className="flex justify-center">
                <TrashIcon
                  className="text-center text-gray-700 w-6 h-6 cursor-pointer"
                  onClick={async () => {
                    await deleteStudent(student._id);
                    await loadStudentsByClass();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewClass;
