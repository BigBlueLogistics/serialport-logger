import { IDataHistory } from "./types";

function DataHistory({ palletNo, status, message }: IDataHistory) {
  return (
    <div className="data-history">
      {palletNo ? (
        <>
          <h2>{palletNo}</h2>
          <p>{message}</p>
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default DataHistory;
