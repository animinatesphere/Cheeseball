import React from "react";
import { ChevronRight, Check, Home } from "lucide-react";

const STEPS = [
  { id: 1, label: "Choose Asset" },
  { id: 2, label: "Price Preview" },
  { id: 3, label: "Wallet Address" },
  { id: 4, label: "Payment Method" },
  { id: 5, label: "Confirm Payment" },
  { id: 6, label: "Complete" },
];

const BuyCryptoBreadcrumbs = ({ currentStep, onStepClick, onBackToDashboard }) => {
  return (
    <div className="w-full mb-8">
      {/* Mobile view: Simple current step indicator */}
      <div className="lg:hidden flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToDashboard}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Home className="w-5 h-5 text-slate-500" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-sm font-bold text-slate-900">
            Step {currentStep}: {STEPS.find(s => s.id === currentStep)?.label}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {currentStep}/{STEPS.length}
        </span>
      </div>

      {/* Desktop view: Full breadcrumb trail */}
      <div className="hidden lg:flex items-center flex-wrap gap-y-4">
        {/* Dashboard Link */}
        <div className="flex items-center">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Dashboard
          </button>
          <ChevronRight className="w-4 h-4 mx-3 text-slate-300" />
        </div>

        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={`flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive 
                    ? "text-slate-900" 
                    : isCompleted 
                      ? "text-blue-600 cursor-pointer hover:text-blue-700" 
                      : "text-slate-400"
                }`}
                onClick={() => isCompleted && onStepClick(step.id)}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border
                  ${isActive 
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                    : isCompleted 
                      ? "bg-blue-50 text-blue-600 border-blue-100" 
                      : "bg-white text-slate-400 border-slate-200"}
                `}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                </div>
                <span className={`${isActive ? "font-bold" : "font-medium"}`}>
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <ChevronRight className={`w-4 h-4 mx-3 ${isUpcoming ? "text-slate-200" : "text-slate-300"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar (Global) */}
      <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BuyCryptoBreadcrumbs;
