export interface ResponseData<T> {
  current_page: number
  data: T
  first_page_url: string
  from: number
  last_page_url: string
  last_page: number
  links: any[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
