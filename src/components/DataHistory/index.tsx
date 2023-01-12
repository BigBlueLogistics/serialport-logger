import { IDataHistory } from "./types";

function DataHistory({ data }: IDataHistory) {
  return (
    <div className="data-history">
      {data.length ? (
        data.map((barcode, idx) => (
          <p key={idx}>{barcode.split(":").toString()}</p>
        ))
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default DataHistory;
