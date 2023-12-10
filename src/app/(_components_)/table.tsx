import React, { useState } from 'react'
import Button from './button'

interface TableProps {
    data: Array<Array<string | React.ReactNode>>
    headers: Array<string>
    displayCheckboxes?: boolean
    className?: string
}

const Table = ({
    data,
    headers,
    displayCheckboxes = false,
    className
}: TableProps) => {
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const isSameLength = (row: Array<string | React.ReactNode>) =>
        row.length === headers.length

    if (!data.every(isSameLength)) {
        return <div>Row and Column mis match</div>
    }

    const toggleCheckbox = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter((index) => index !== rowIndex))
        } else {
            setSelectedRows([...selectedRows, rowIndex])
        }
    }

    return (
        <div className={`mx-auto ${className}`}>
            <div className='flex flex-col'>
                <div className='overflow-x-auto'>
                    <div className='inline-block min-w-full align-middle'>
                        <div className='border dark:border-b-dark h-96 overflow-auto'>
                            <table className='w-full text-left text-sm'>
                                <thead className='border-2 px-6 py-4 font-black uppercase dark:border-b-dark'>
                                    <tr className=''>
                                        {displayCheckboxes && <th className='px-6 py-2'></th>}
                                        {headers.map((header, index) => (
                                            <th
                                                key={index}
                                                className='px-6 py-3 text-center font-medium dark:bg-th-dark'
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={`bg-transparent from-primary-light hover:bg-gradient-to-r dark:from-primary-dark dark:hover:bg-gradient-to-r ${
                                                selectedRows.includes(rowIndex)
                                                    ? 'bg-blue-100'
                                                    : ''
                                            }`}
                                        >
                                            {displayCheckboxes && (
                                                <td
                                                    className={`w-8 border-b border-b-light px-6 py-4 dark:border-b-dark`}
                                                >
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedRows.includes(
                                                            rowIndex
                                                        )}
                                                        onChange={() =>
                                                            toggleCheckbox(rowIndex)
                                                        }
                                                        className='h-5 w-5 rounded-lg border border-gray-300'
                                                    />
                                                </td>
                                            )}
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className={`border-b border-b-light px-6 py-4 text-center dark:border-b-dark`}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table