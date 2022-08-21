import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, editStudent, getStudentsByClass } from "../../services";
import { LinkRoutes, Student } from "../../utils";

interface Props {
  className: string;
}

function ViewClass({ className }: Props) {
  const [students, setStudents] = useState<Student[]>(null!);
  const [editable, setEditable] = useState<any>("");
  const [editingS, setEditingS] = useState<any>({
    name: "",
    tuition: "",
    amountPaid: "",
  });
  const [save, setSave] = useState(false);
  const navigate = useNavigate();
  const loadStudentsByClass = async (reload?: boolean) => {
    try {
      const cachedS = localStorage.getItem(className);

      if (!cachedS || reload) {
        const s = await getStudentsByClass(className);

        setStudents(s);
        console.log(reload);

        localStorage.setItem(className, JSON.stringify(s));
      } else {
        const cache = JSON.parse(cachedS);
        const s = await getStudentsByClass(className);
        if (JSON.stringify(s) === cachedS) {
          console.log("cache");

          setStudents(cache);
        } else {
          console.log("not cache");

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
  }, [save]);
  /**
   * if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
   */

  return (
    <div className="flex-col flex justify-center my-4 overflow-scroll scrollbar-hide">
      <h1 className="text-2xl font-bold">{className}</h1>
      <table className="text-center border border-gray-600 mb-5 overflow-scroll min-w-[500px]">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th>Student Name</th>
            <th>Amount Paid</th>
            <th>Total Tuition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student, index) => (
            <tr key={student._id} className="border border-gray-600">
              <td className="flex px-2 space-x-5 py-2">
                <span>{index + 1}</span>
                {editable === student ? (
                  <input
                    type="text"
                    className="bg-white"
                    autoFocus
                    defaultValue={student.name}
                    onChange={(e) =>
                      setEditingS((prev: any) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <span>{student.name}</span>
                )}
              </td>
              <td>
                {editable === student ? (
                  <input
                    type="number"
                    className="bg-white"
                    defaultValue={student.amountPaid}
                    onChange={(e) =>
                      setEditingS((prev: any) => ({
                        ...prev,
                        amountPaid: parseInt(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <span>{student.amountPaid}</span>
                )}
              </td>
              <td>
                {editable === student ? (
                  <input
                    type="number"
                    defaultValue={student.tuition}
                    className="bg-white"
                    onChange={(e) =>
                      setEditingS((prev: any) => ({
                        ...prev,
                        tuition: parseInt(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <span>{student.tuition}</span>
                )}
              </td>
              <td className="flex justify-center items-center py-1">
                {editable === student ? (
                  <CheckIcon
                    className="text-blue-600 w-6 h-6 cursor-pointer"
                    onClick={async () => {
                      const updatedStudent = {
                        name: editingS.name || student.name,
                        amountPaid: editingS.amountPaid || student.amountPaid,
                        tuition: editingS.tuition || student.tuition,
                        _id: student._id,
                      };
                      setEditable("");
                      editStudent(student._id, updatedStudent);
                      console.log("Load");

                      await loadStudentsByClass(true);
                      setEditingS({
                        name: "",
                        tuition: "",
                        amountPaid: "",
                      });
                      setSave((prev) => !prev);
                    }}
                  />
                ) : (
                  <PencilIcon
                    className="text-gray-400 w-6 h-6 cursor-pointer"
                    onClick={async () => {
                      setEditable(student);
                    }}
                  />
                )}
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
