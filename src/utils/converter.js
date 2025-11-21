/**
 * 将输入数据转换为LunaTV/MoonTV格式
 */
export function convertToLunaTV(inputData) {
  const result = []

  // 如果输入是数组
  if (Array.isArray(inputData)) {
    inputData.forEach((item) => {
      result.push(convertItemToLunaTV(item))
    })
  } else if (typeof inputData === 'object' && inputData !== null) {
    // 如果输入是单个对象
    result.push(convertItemToLunaTV(inputData))
  } else {
    throw new Error('输入数据必须是对象或数组')
  }

  return result
}

/**
 * 将单个项目转换为LunaTV/MoonTV格式
 */
function convertItemToLunaTV(item) {
  return {
    name: item.name || item.title || item.label || '',
    key: item.key || item.id || item.code || '',
    api: item.api || item.url || item.endpoint || '',
    detail: item.detail || item.description || item.desc || '',
    disabled: item.disabled !== undefined ? item.disabled : false,
    is_adult: item.is_adult !== undefined ? item.is_adult : item.isAdult || false
  }
}

/**
 * 将输入数据转换为Omnibox格式
 */
export function convertToOmnibox(inputData) {
  const result = []

  // 如果输入是数组
  if (Array.isArray(inputData)) {
    inputData.forEach((item, index) => {
      result.push(convertItemToOmnibox(item, index))
    })
  } else if (typeof inputData === 'object' && inputData !== null) {
    // 如果输入是单个对象
    result.push(convertItemToOmnibox(inputData, 0))
  } else {
    throw new Error('输入数据必须是对象或数组')
  }

  return result
}

/**
 * 将单个项目转换为Omnibox格式
 */
function convertItemToOmnibox(item, index) {
  const now = new Date().toISOString()

  return {
    id: item.id || item.key || `item_${index}`,
    key: item.key || item.id || item.code || '',
    name: item.name || item.title || item.label || '',
    api: item.api || item.url || item.endpoint || '',
    type: item.type !== undefined ? item.type : 2,
    isActive: item.isActive !== undefined ? item.isActive : item.is_active !== undefined ? item.is_active : 1,
    time: item.time || item.timestamp || now,
    isDefault: item.isDefault !== undefined ? item.isDefault : item.is_default !== undefined ? item.is_default : 0,
    remark: item.remark || item.note || item.description || item.desc || '',
    tags: Array.isArray(item.tags) ? item.tags : item.tag ? [item.tag] : [],
    priority: item.priority !== undefined ? item.priority : 0
  }
}

