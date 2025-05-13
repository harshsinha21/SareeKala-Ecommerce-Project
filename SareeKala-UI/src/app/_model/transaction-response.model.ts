export interface TransactionResponse {
  transactionId: string;
  clientSecret: string | null;
  currency: string;
  amount: string;
}
