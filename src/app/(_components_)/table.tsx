import React, { useState } from "react";
import Button from "./button";
import { IoMdArrowDropdown } from "react-icons/io";
interface TableProps {
  data: Array<Array<string | React.ReactNode>>;
  headers: Array<string>;
  displayCheckboxes?: boolean;
  className?: string;
  title?: string;
  start?: string;
  end?: string;
  state?: number;
  setStart?: any;
  setEnd?: any;
}

const Table = ({
  title,
  data,
  start,
  end,
  setStart,
  setEnd,
  headers,
  state,
  displayCheckboxes = false,
  className,
}: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<Array<number>>([]);
  const isSameLength = (row: Array<string | React.ReactNode>) =>
    row.length === headers.length;
  const [show, setShow] = useState(false);
  if (!data.every(isSameLength)) {
    return <div>Row and Column mis match</div>;
  }

  const toggleCheckbox = (rowIndex: number) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((index) => index !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  return (
    <div className={`mx-auto ${className}`}>
      <div className="flex">
        <button
          onClick={() => setShow(!show)}
          className={`h-8 scale-150 ${!show && " -rotate-90"}`}
        >
          <IoMdArrowDropdown />
        </button>
        <div className=" mt-1 ml-4 font-extrabold">{title}</div>
      </div>
      {show && (
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="h-96 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-2 px-6 py-4 font-black uppercase dark:border-b-dark">
                    <tr className="">
                      {displayCheckboxes && <th className="px-6 py-2"></th>}
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-center font-medium dark:bg-th-dark"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => {
                      let obj: any = {};
                      for (let i = 0; i < headers.length; i++) {
                        obj[headers[i]] = row[i];
                      }
                      obj = JSON.stringify(obj, Object.keys(obj).sort());
                      return (
                        <tr
                          key={obj}
                          onClick={() => {
                            state ? setEnd(obj) : setStart(obj);
                          }}
                          className={`${
                            obj === start
                              ? "bg-green-950"
                              : obj === end
                                ? "bg-red-950"
                                : "bg-transparent"
                          } cursor-pointer from-primary-dark hover:bg-gradient-to-r ${
                            selectedRows.includes(rowIndex) ? "bg-blue-100" : ""
                          }`}
                        >
                          {displayCheckboxes && (
                            <td
                              className={`w-8 border-b px-6 py-4 border-b-dark`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(rowIndex)}
                                onChange={() => toggleCheckbox(rowIndex)}
                                className="h-5 w-5 rounded-lg border border-gray-300"
                              />
                            </td>
                          )}
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`border-b px-6 py-4 text-center border-b-dark`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
