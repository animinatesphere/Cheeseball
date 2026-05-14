import React from "react";

/* ── Design tokens (mirrors sell flow) ─────────────────── */
const T = {
  blue:      "#1A6FFF",
  text2:     "#6B7A99",
  text3:     "#A8B4CC",
  border:    "#E8EEFF",
  blueLight: "#EEF3FF",
};

const STEPS = [
  { id: 1, label: "Buy Crypto" },
  { id: 2, label: "Price Preview" },
  { id: 3, label: "Wallet Address" },
  { id: 4, label: "Payment Method" },
  { id: 5, label: "Confirm Payment" },
  { id: 6, label: "Complete" },
];

const BuyCryptoBreadcrumbs = ({ currentStep, onStepClick, onBackToDashboard }) => {
  /* Determine which steps to show in the breadcrumb trail.
     Design spec: show Dashboard › [previous completed steps] › [current step].
     We only surface the steps up to and including the current one.  */
  const visibleSteps = STEPS.slice(0, currentStep);

  return (
    <nav
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
        onClick={onBackToDashboard}
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
            <span style={{ color: T.text3, fontSize: 12, userSelect: "none" }}>›</span>

            {/* Step label */}
            <span
              onClick={() => isCompleted && onStepClick?.(step.id)}
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

export default BuyCryptoBreadcrumbs;

