export type Payment = {
    amount: number,
    id: string,
    targetId: string,
    type: string,
    userId: string | undefined
}