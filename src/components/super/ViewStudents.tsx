import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getClasses, getStudentsByClass } from "../../services";
import { LinkRoutes } from "../../utils";
import ViewClass from "./ViewClass";

function ViewStudents() {
  const [classes, setClasses] = useState<string[]>(null!);
  const [students, setStudents] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const n = toast.loading("Getting students");
      try {
        const classes = await getClasses();
        setClasses(classes);
        classes.forEach((className: string) => {
          getStudents(className).then().catch();
        });
        console.log(students);

        toast.success("Got students", { id: n });
      } catch (err: any) {
        if (err === "Unauthorized") {
          navigate(LinkRoutes.LOGIN);
          window.location.reload();
        }
        const { status, msg } = err;
        // if (status !== 200) setErrorMessage(msg);
        console.log(err);
        toast.error(`Error: ${err.msg}`, {
          id: n,
        });
      }
    })();
  }, []);
  const getStudents = async (className: string) => {
    const s = await getStudentsByClass(className);

    setStudents((prev: any) => [...prev, { [className]: s }]);
  };
  return (
    <div className="flex-1 flex-col px-3 space-y-4">
      {classes?.map((className) => (
        <ViewClass key={className} className={className} />
      ))}
    </div>
  );
  /** 
   * <div key={className} className={`flex-col`}>
          <h1 className="text-2xl font-bold">{className}</h1>
          <div>
            /* {students
              ?.filter((student: any) => {
                console.log(student);
                console.log(className);
                console.log(student[className]);
                console.log(Object.keys(student)[0]);

                return Object.keys(student)[0] === className;
              })
              .map((student: any) => {
                console.log(student);
                console.log(className);
                console.log(student[className]);
                return student[className].map((s: any) => {
                  console.log(s);
                  return <p key={s._id}>{s.name}</p>;
                });
              })} */
  //</div>
  /* <div>{getStudents(className).then()}</div> */
  //*  </div>
}

export default ViewStudents;
