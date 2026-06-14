import React from "react";

/* ── Design tokens (mirrors buy/sell flow) ─────────────────── */
const T = {
  blue:      "#1A6FFF",
  text2:     "#6B7A99",
  text3:     "#A8B4CC",
  border:    "#E8EEFF",
  blueLight: "#EEF3FF",
};

const STEPS = [
  { id: 1, label: "Swap Crypto" },
  { id: 2, label: "Preview Swap" },
  { id: 3, label: "Complete" },
];

export default function ConvertFlowBreadcrumbs({ currentStep, onStepClick, onClose }) {
  /* Determine which steps to show in the breadcrumb trail.
     Design spec: show Dashboard › [previous completed steps] › [current step].
     We only surface the steps up to and including the current one.  */
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
      {/* Dashboard link */}
      <span
        onClick={onClose}
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
            {/* Separator */}
            <span className="breadcrumb-item" style={{ color: T.text3, fontSize: 12, userSelect: "none" }}>›</span>

            {/* Step label */}
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
}
