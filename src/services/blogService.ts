import type { Blog, BlogFormData, BlogList } from '../types/blog'
import {
  loadBlogList,
  appendBlog,
  modifyBlog,
  removeBlogById,
  findBlogById,
  createId
} from '../utils/storage'

export function fetchAllBlogs(): BlogList {
  const list: BlogList = loadBlogList()
  return list.sort((a: Blog, b: Blog) => b.createTime - a.createTime)
}

export function fetchBlogById(id: string): Blog | null {
  return findBlogById(id)
}

export function publishBlog(formData: BlogFormData): Blog {
  const blog: Blog = {
    id: createId(),
    title: formData.title.trim(),
    content: formData.content.trim(),
    createTime: Date.now()
  }
  appendBlog(blog)
  return blog
}

export function updateBlog(id: string, formData: BlogFormData): boolean {
  return modifyBlog(id, {
    title: formData.title.trim(),
    content: formData.content.trim()
  })
}

export function deleteBlog(id: string): boolean {
  return removeBlogById(id)
}

export function formatTimestamp(ts: number): string {
  const d: Date = new Date(ts)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function validateForm(data: BlogFormData): string | null {
  if (!data.title.trim()) {
    return '文章标题不能为空'
  }
  if (data.title.trim().length > 100) {
    return '文章标题不能超过100个字符'
  }
  if (!data.content.trim()) {
    return '文章内容不能为空'
  }
  return null
}
