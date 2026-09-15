export interface FeeCalculationResult {
  batchYear: string;
  isEligibleForDiscount: boolean;
  feeAmount: number;
}


export function calculateRegistrationFee(
  studentId: string,
  isContinuing26: boolean = false
): FeeCalculationResult {
  const cleanId = studentId.trim();
  const batchYear = cleanId.length >= 2 ? cleanId.substring(0, 2) : '';

  if (batchYear === '26') {
    return {
      batchYear,
      isEligibleForDiscount: true,
      feeAmount: 50,
    };
  }

  if (batchYear === '25') {
    if (isContinuing26) {
      return {
        batchYear,
        isEligibleForDiscount: true,
        feeAmount: 50,
      };
    }
    return {
      batchYear,
      isEligibleForDiscount: false,
      feeAmount: 100,
    };
  }

  // All other batches
  return {
    batchYear,
    isEligibleForDiscount: false,
    feeAmount: 100,
  };
}