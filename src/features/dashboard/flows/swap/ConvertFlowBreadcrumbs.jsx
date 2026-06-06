import React from "react";
import { T, Ico } from "./ConvertFlowShared";

export default function ConvertFlowBreadcrumbs({ currentStep, totalSteps }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 32,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                i < currentStep
                  ? T.green
                  : i === currentStep - 1
                    ? T.blue
                    : T.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Sora',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color:
                i < currentStep
                  ? "#fff"
                  : i === currentStep - 1
                    ? "#fff"
                    : T.text3,
              transition: "all 0.3s",
            }}
          >
            {i < currentStep - 1 ? Ico.check("#fff") : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              style={{
                width: 24,
                height: 2,
                background: i < currentStep - 1 ? T.green : T.border,
                transition: "all 0.3s",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
