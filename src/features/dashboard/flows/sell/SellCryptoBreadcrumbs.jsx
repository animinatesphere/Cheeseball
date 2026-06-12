import React from "react";
import { T } from "./SellFlowShared";

const STEPS = [
  { id: 1, label: "Sell Crypto" },
  { id: 2, label: "Confirm Details" },
  { id: 3, label: "Deposit" },
];

const SellCryptoBreadcrumbs = ({ currentStep, onStepClick, onBackToDashboard }) => {
  const visibleSteps = STEPS.slice(0, currentStep);

  return (
    <nav
      className="breadcrumb-nav"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 36,
      }}
    >
      <span
        onClick={onBackToDashboard}
        className="breadcrumb-item"
        style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }}
      >
        Dashboard
      </span>

      {visibleSteps.map((step, idx) => {
        const isLast = idx === visibleSteps.length - 1;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <span className="breadcrumb-item" style={{ color: T.text3, fontSize: 12, userSelect: "none" }}>›</span>
            <span
              onClick={() => isCompleted && onStepClick?.(step.id)}
              className="breadcrumb-item"
              style={{
                fontSize: 13,
                fontWeight: isLast ? 600 : 500,
                color: isLast ? T.blue : T.text2,
                cursor: isCompleted ? "pointer" : "default",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {step.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SellCryptoBreadcrumbs;
