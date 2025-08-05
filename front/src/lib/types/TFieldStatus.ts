/*
    Статус поля для форм
*/
export type TFieldStatus = {
    name: string, // Input name
    message?: string, // Message for user
    status: 'error' | 'success' | 'default' // Status input
}