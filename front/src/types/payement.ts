export type PaymentTypes = {
    amount: number,
    id: string,
    targetId: string,
    type: string,
    userId: string | undefined,
    inactive: string | boolean,
    customerId: string,
    rest: any
}