/**
 * 输入校验工具模块
 * 提供严格的输入验证规则，防止无效数据
 */

// 校验规则配置
const VALIDATION_RULES = {
  author: {
    minLength: 1,
    maxLength: 50,
    fieldName: '作者名称'
  },
  title: {
    minLength: 2,
    maxLength: 100,
    fieldName: '文章标题'
  },
  content: {
    minLength: 5,
    maxLength: 10000,
    fieldName: '文章内容'
  }
} as const

/**
 * 检查字符串是否为纯数字
 */
function isOnlyDigits(str: string): boolean {
  return /^\d+$/.test(str)
}

/**
 * 检查字符串是否为日期时间格式（如 2024-01-01, 2024/01/01, 12:30 等）
 */
function isDateTimeFormat(str: string): boolean {
  const patterns = [
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,           // 2024-01-01 或 2024/01/01
    /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/,           // 01-01-2024 或 01/01/2024
    /^\d{1,2}:\d{2}$/,                          // 12:30
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}$/, // 2024-01-01 12:30
    /^\d{4}年\d{1,2}月\d{1,2}日?$/              // 2024年1月1日
  ]
  return patterns.some(pattern => pattern.test(str.trim()))
}

/**
 * 检查字符串是否只包含特殊字符
 */
function isOnlySpecialChars(str: string): boolean {
  return /^[^\w\u4e00-\u9fa5]+$/.test(str)
}

/**
 * 校验结果接口
 */
export interface ValidationResult {
  valid: boolean
  error: string | null
}

/**
 * 校验作者名称
 */
export function validateAuthor(author: string): ValidationResult {
  const trimmed = author.trim()
  const rules = VALIDATION_RULES.author

  // 空值检查
  if (trimmed.length === 0) {
    return { valid: false, error: `${rules.fieldName}不能为空` }
  }

  // 长度检查
  if (trimmed.length > rules.maxLength) {
    return { valid: false, error: `${rules.fieldName}不能超过${rules.maxLength}个字符` }
  }

  // 纯数字检查
  if (isOnlyDigits(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能只包含数字` }
  }

  // 日期时间格式检查
  if (isDateTimeFormat(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能是日期时间格式` }
  }

  // 纯特殊字符检查
  if (isOnlySpecialChars(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能只包含特殊字符` }
  }

  return { valid: true, error: null }
}

/**
 * 校验文章标题
 */
export function validateTitle(title: string): ValidationResult {
  const trimmed = title.trim()
  const rules = VALIDATION_RULES.title

  // 空值检查
  if (trimmed.length === 0) {
    return { valid: false, error: `${rules.fieldName}不能为空` }
  }

  // 最小长度检查
  if (trimmed.length < rules.minLength) {
    return { valid: false, error: `${rules.fieldName}至少需要${rules.minLength}个字符` }
  }

  // 最大长度检查
  if (trimmed.length > rules.maxLength) {
    return { valid: false, error: `${rules.fieldName}不能超过${rules.maxLength}个字符` }
  }

  // 纯数字检查
  if (isOnlyDigits(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能只包含数字` }
  }

  // 日期时间格式检查
  if (isDateTimeFormat(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能是日期时间格式` }
  }

  // 纯特殊字符检查
  if (isOnlySpecialChars(trimmed)) {
    return { valid: false, error: `${rules.fieldName}不能只包含特殊字符` }
  }

  return { valid: true, error: null }
}

/**
 * 校验文章内容
 */
export function validateContent(content: string): ValidationResult {
  const trimmed = content.trim()
  const rules = VALIDATION_RULES.content

  // 空值检查
  if (trimmed.length === 0) {
    return { valid: false, error: `${rules.fieldName}不能为空` }
  }

  // 最小长度检查
  if (trimmed.length < rules.minLength) {
    return { valid: false, error: `${rules.fieldName}至少需要${rules.minLength}个字符` }
  }

  // 最大长度检查
  if (trimmed.length > rules.maxLength) {
    return { valid: false, error: `${rules.fieldName}不能超过${rules.maxLength}个字符` }
  }

  return { valid: true, error: null }
}

/**
 * 校验表单数据（作者、标题、内容）
 */
export function validateFormData(author: string, title: string, content: string): ValidationResult {
  // 按顺序校验，返回第一个错误
  const authorResult = validateAuthor(author)
  if (!authorResult.valid) return authorResult

  const titleResult = validateTitle(title)
  if (!titleResult.valid) return titleResult

  const contentResult = validateContent(content)
  if (!contentResult.valid) return contentResult

  return { valid: true, error: null }
}
