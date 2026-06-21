import type { Blog, BlogList } from '../types/blog'

const STORAGE_KEY: string = 'ts_blog_list'

export function loadBlogList(): BlogList {
  const raw: string | null = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed as BlogList
  } catch {
    return []
  }
}

export function persistBlogList(list: BlogList): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function findBlogById(id: string): Blog | null {
  const list: BlogList = loadBlogList()
  const found: Blog | undefined = list.find((blog: Blog) => blog.id === id)
  return found ?? null
}

export function appendBlog(blog: Blog): void {
  const list: BlogList = loadBlogList()
  list.unshift(blog)
  persistBlogList(list)
}

export function modifyBlog(id: string, patch: Partial<Pick<Blog, 'title' | 'content' | 'author'>>): boolean {
  const list: BlogList = loadBlogList()
  const idx: number = list.findIndex((blog: Blog) => blog.id === id)
  if (idx === -1) {
    return false
  }
  list[idx] = { ...list[idx], ...patch }
  persistBlogList(list)
  return true
}

export function removeBlogById(id: string): boolean {
  const list: BlogList = loadBlogList()
  const filtered: BlogList = list.filter((blog: Blog) => blog.id !== id)
  if (filtered.length === list.length) {
    return false
  }
  persistBlogList(filtered)
  return true
}

export function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}
