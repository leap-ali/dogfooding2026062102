export interface Blog {
  id: string
  title: string
  content: string
  author: string
  createTime: number
}

export interface BlogFormData {
  title: string
  content: string
  author: string
}

export type BlogList = Blog[]
