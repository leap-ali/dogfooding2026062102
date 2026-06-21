import type { Blog, BlogFormData, BlogList } from '../types/blog'
import {
  loadBlogList,
  appendBlog,
  modifyBlog,
  removeBlogById,
  findBlogById,
  createId
} from '../utils/storage'
import { validateFormData, type ValidationResult } from '../utils/validator'

/**
 * 获取所有博客列表（按创建时间倒序）
 */
export function fetchAllBlogs(): BlogList {
  const list: BlogList = loadBlogList()
  return list.sort((a: Blog, b: Blog) => b.createTime - a.createTime)
}

/**
 * 根据ID获取博客详情
 */
export function fetchBlogById(id: string): Blog | null {
  return findBlogById(id)
}

/**
 * 发布新博客
 */
export function publishBlog(formData: BlogFormData): Blog {
  const blog: Blog = {
    id: createId(),
    title: formData.title.trim(),
    content: formData.content.trim(),
    author: formData.author.trim(),
    createTime: Date.now()
  }
  appendBlog(blog)
  return blog
}

/**
 * 更新博客内容
 */
export function updateBlog(id: string, formData: BlogFormData): boolean {
  return modifyBlog(id, {
    title: formData.title.trim(),
    content: formData.content.trim(),
    author: formData.author.trim()
  })
}

/**
 * 删除博客
 */
export function deleteBlog(id: string): boolean {
  return removeBlogById(id)
}

/**
 * 格式化时间戳为可读字符串
 */
export function formatTimestamp(ts: number): string {
  const d: Date = new Date(ts)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * 校验表单数据（使用独立的校验模块）
 */
export function validateForm(data: BlogFormData): ValidationResult {
  return validateFormData(data.author, data.title, data.content)
}
