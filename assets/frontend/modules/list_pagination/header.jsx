// Protected File. SPoC - Santosh Medarametla

import React from "react";

const TableHeader = (props) => {
    const { tableJSON, actionToDo, sortArrow } = props;

    return (
        <tr>
            {tableJSON.map((item) => {
                return (
                    <th
                        scope="col"
                        className="pl-3 align-middle" style={tableJSON.length >= 8 ? {width: "13%"} : {width: "15%"}}
                        onClick={() => (item.sort && actionToDo ? actionToDo("sort", item.key) : "")}>
                        {item.displayValue}
                        {item.sort && sortArrow && sortArrow(item.key)}
                    </th>
                );
            })}
        </tr>
    );
};
export default TableHeader;
