import { IDataHistory } from "./types";
import "./styles.scss";

function DataHistory({ palletNo, status, message }: IDataHistory) {
  const bgClass = status;
  console.log("bgClass", status);
  return (
    <div className={`data-history ${bgClass}`}>
      {palletNo ? (
        <>
          <div className="pallet-no text-shadow">{palletNo}</div>
          <div className="message text-shadow">{message}</div>
        </>
      ) : (
        <p className="no-data">No barcode read.</p>
      )}
    </div>
  );
}

export default DataHistory;
