import { Button } from "./Button";

export const Ui = ({
  wheatSeeds,
  tomatoSeeds,
  riceSeeds,
  riceSupply,
}: {
  wheatSeeds: number;
  tomatoSeeds: number;
  riceSeeds: number;
  riceSupply: number;
}) => {
  return (
    <div
      style={{
        background: "#555",
        color: "white",
        padding: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "50%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Button disabled={wheatSeeds === 0}>Plant Wheat</Button>
            <Button disabled={tomatoSeeds === 0}>Plant Tomato</Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Button disabled={riceSeeds === 0}>Plant Rice</Button>
            <Button disabled={riceSupply === 0}>Donate Rice</Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <div>Wheat Seeds: {wheatSeeds}</div>
          <div>Tomato Seeds: {tomatoSeeds}</div>
          <div>Rice Seeds: {riceSeeds}</div>
          <div>Rice Supply: {riceSupply}</div>
        </div>
      </div>
    </div>
  );
};
