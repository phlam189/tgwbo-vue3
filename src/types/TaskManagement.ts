export interface TaskManagement {
    id: number
    client_id: number
    count: number
    created_at: Date
    date_sync: Date
    status: number
    task_name: string
    updated_at: Date
    client_name?: string
}