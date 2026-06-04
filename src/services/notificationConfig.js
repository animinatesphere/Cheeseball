import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Send,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  Clock,
  FileCheck,
} from "lucide-react";

// Map notification types to icon, color, and label
export const notificationTypeConfig = {
  TRANSACTION_COMPLETED: {
    icon: CheckCircle2,
    color: "#00C48C",
    label: "Transaction Completed",
  },
  TRANSACTION_FAILED: {
    icon: AlertCircle,
    color: "#FF5252",
    label: "Transaction Failed",
  },
  DEPOSIT_RECEIVED: {
    icon: ArrowDownCircle,
    color: "#1A6FFF",
    label: "Deposit Received",
  },
  WITHDRAWAL_APPROVED: {
    icon: CheckCircle2,
    color: "#00C48C",
    label: "Withdrawal Approved",
  },
  WITHDRAWAL_REJECTED: {
    icon: AlertCircle,
    color: "#FF5252",
    label: "Withdrawal Rejected",
  },
  KYC_VERIFICATION_PENDING: {
    icon: Clock,
    color: "#FFA500",
    label: "KYC Pending",
  },
  KYC_VERIFICATION_APPROVED: {
    icon: FileCheck,
    color: "#00C48C",
    label: "KYC Approved",
  },
  KYC_VERIFICATION_REJECTED: {
    icon: AlertCircle,
    color: "#FF5252",
    label: "KYC Rejected",
  },
  REFERRAL_REWARD: {
    icon: Gift,
    color: "#FFB800",
    label: "Referral Reward",
  },
};

// Get config for a notification type, with fallback
export const getNotificationConfig = (type) => {
  return (
    notificationTypeConfig[type] || {
      icon: FileCheck,
      color: "#1A6FFF",
      label: type.replace(/_/g, " "),
    }
  );
};

// Reference type to route mapping for deep-linking
export const referenceTypeRoutes = {
  TRANSACTION: "/dashboard/transaction",
  DEPOSIT: "/dashboard/deposit",
  WITHDRAWAL: "/dashboard/withdrawal",
  KYC: "/dashboard/kyc",
  REFERRAL: "/dashboard/referral",
};

// Get route for deep-linking
export const getReferenceRoute = (referenceType, referenceId) => {
  const baseRoute = referenceTypeRoutes[referenceType];
  if (baseRoute) {
    return `${baseRoute}/${referenceId}`;
  }
  return null;
};
