export const sellService = {
  getBeneficiaries: () => Promise.resolve([]),
  createBeneficiary: (payload) =>
    Promise.resolve({ id: `beneficiary-${Date.now()}`, ...payload }),
};

