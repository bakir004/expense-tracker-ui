export const PaymentMethod =  {
    CASH: 'CASH',
    DEBIT_CARD: 'DEBIT_CARD',
    CREDIT_CARD: 'CREDIT_CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    MOBILE_PAYMENT: 'MOBILE_PAYMENT',
    PAYPAL: 'PAYPAL',
    CRYPTO: 'CRYPTO',
    OTHER: 'OTHER',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];
