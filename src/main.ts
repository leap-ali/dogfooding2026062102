import type { Blog, BlogFormData, BlogList } from './types/blog'
import {
  fetchAllBlogs,
  publishBlog,
  updateBlog,
  deleteBlog,
  fetchBlogById,
  formatTimestamp,
  validateForm
} from './services/blogService'

const authorInput: HTMLInputElement | null = document.querySelector('#authorInput')
const titleInput: HTMLInputElement | null = document.querySelector('#titleInput')
const contentInput: HTMLTextAreaElement | null = document.querySelector('#contentInput')
const publishBtn: HTMLButtonElement | null = document.querySelector('#publishBtn')
const blogListEl: HTMLDivElement | null = document.querySelector('#blogList')
const emptyTip: HTMLDivElement | null = document.querySelector('#emptyTip')

const viewModal: HTMLDivElement | null = document.querySelector('#viewModal')
const viewTitle: HTMLHeadingElement | null = document.querySelector('#viewTitle')
const viewAuthor: HTMLSpanElement | null = document.querySelector('#viewAuthor')
const viewTime: HTMLSpanElement | null = document.querySelector('#viewTime')
const viewContent: HTMLDivElement | null = document.querySelector('#viewContent')

const editModal: HTMLDivElement | null = document.querySelector('#editModal')
const editAuthorInput: HTMLInputElement | null = document.querySelector('#editAuthorInput')
const editTitleInput: HTMLInputElement | null = document.querySelector('#editTitleInput')
const editContentInput: HTMLTextAreaElement | null = document.querySelector('#editContentInput')
const saveEditBtn: HTMLButtonElement | null = document.querySelector('#saveEditBtn')

let currentEditId: string = ''

function escapeHtml(text: string): string {
  const div: HTMLDivElement = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function renderBlogList(): void {
  if (!blogListEl || !emptyTip) return

  const blogs: BlogList = fetchAllBlogs()

  if (blogs.length === 0) {
    blogListEl.innerHTML = ''
    emptyTip.style.display = 'block'
    return
  }

  emptyTip.style.display = 'none'
  blogListEl.innerHTML = blogs.map((blog: Blog) => `
    <div class="blog-item" data-id="${blog.id}">
      <div class="blog-item-header">
        <div class="blog-item-title" data-action="view">${escapeHtml(blog.title)}</div>
      </div>
      <div class="blog-item-meta">
        <span class="blog-item-author">${escapeHtml(blog.author || '匿名')}</span>
        <span class="blog-item-time">${formatTimestamp(blog.createTime)}</span>
      </div>
      <div class="blog-item-summary">${escapeHtml(blog.content)}</div>
      <div class="blog-item-actions">
        <button class="btn btn-primary btn-small" data-action="view">查看</button>
        <button class="btn btn-secondary btn-small" data-action="edit">编辑</button>
        <button class="btn btn-danger btn-small" data-action="delete">删除</button>
      </div>
    </div>
  `).join('')
}

function handlePublish(): void {
  if (!authorInput || !titleInput || !contentInput) return

  const formData: BlogFormData = {
    author: authorInput.value,
    title: titleInput.value,
    content: contentInput.value
  }

  const error: string | null = validateForm(formData)
  if (error) {
    alert(error)
    return
  }

  publishBlog(formData)
  authorInput.value = ''
  titleInput.value = ''
  contentInput.value = ''
  renderBlogList()
}

function handleView(id: string): void {
  const blog: Blog | null = fetchBlogById(id)
  if (!blog || !viewModal || !viewTitle || !viewAuthor || !viewTime || !viewContent) return

  viewTitle.textContent = blog.title
  viewAuthor.textContent = `作者：${blog.author || '匿名'}`
  viewTime.textContent = formatTimestamp(blog.createTime)
  viewContent.textContent = blog.content
  viewModal.classList.add('active')
}

function handleEdit(id: string): void {
  const blog: Blog | null = fetchBlogById(id)
  if (!blog || !editModal || !editAuthorInput || !editTitleInput || !editContentInput) return

  currentEditId = id
  editAuthorInput.value = blog.author || ''
  editTitleInput.value = blog.title
  editContentInput.value = blog.content
  editModal.classList.add('active')
}

function handleSaveEdit(): void {
  if (!editAuthorInput || !editTitleInput || !editContentInput) return

  const formData: BlogFormData = {
    author: editAuthorInput.value,
    title: editTitleInput.value,
    content: editContentInput.value
  }

  const error: string | null = validateForm(formData)
  if (error) {
    alert(error)
    return
  }

  const success: boolean = updateBlog(currentEditId, formData)
  if (success) {
    closeModal('editModal')
    renderBlogList()
  }
}

function handleDelete(id: string): void {
  const blog: Blog | null = fetchBlogById(id)
  if (!blog) return

  const author = blog.author || '匿名'
  const confirmed: boolean = confirm(`确定要删除「${author}」的文章「${blog.title}」吗？`)
  if (!confirmed) return

  deleteBlog(id)
  renderBlogList()
}

function closeModal(modalId: string): void {
  const modal: HTMLElement | null = document.querySelector(`#${modalId}`)
  if (modal) {
    modal.classList.remove('active')
  }
}

function closeAllModals(): void {
  closeModal('viewModal')
  closeModal('editModal')
}

function initEvents(): void {
  if (publishBtn) {
    publishBtn.addEventListener('click', handlePublish)
  }

  if (blogListEl) {
    blogListEl.addEventListener('click', (e: MouseEvent) => {
      const target: HTMLElement = e.target as HTMLElement
      const blogItem: HTMLElement | null = target.closest('.blog-item')
      const actionEl: HTMLElement | null = target.closest('[data-action]')

      if (!blogItem || !actionEl) return

      const id: string = blogItem.dataset.id || ''
      const action: string = actionEl.dataset.action || ''

      if (action === 'view') {
        handleView(id)
      } else if (action === 'edit') {
        handleEdit(id)
      } else if (action === 'delete') {
        handleDelete(id)
      }
    })
  }

  document.querySelectorAll('.close-btn, [data-modal]').forEach((el: Element) => {
    el.addEventListener('click', (e: Event) => {
      const target: HTMLElement = e.currentTarget as HTMLElement
      const modalId: string = target.dataset.modal || ''
      if (modalId) {
        closeModal(modalId)
      }
    })
  })

  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', handleSaveEdit)
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeAllModals()
    }
  })

  document.querySelectorAll('.modal').forEach((modal: Element) => {
    modal.addEventListener('click', (e: Event) => {
      if (e.target === modal) {
        closeAllModals()
      }
    })
  })
}

function init(): void {
  initEvents()
  renderBlogList()
}

init()
