import axios from 'axios'

/**
 * 从API获取模型列表
 */
export async function fetchModelsFromAPI(apiUrl, apiKey) {
  try {
    // 尝试OpenAI格式的API
    const modelsUrl = apiUrl.endsWith('/v1')
      ? `${apiUrl}/models`
      : `${apiUrl}/v1/models`

    const response = await axios.get(modelsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    // 处理OpenAI格式的响应
    if (response.data && response.data.data) {
      return response.data.data.map((model) => ({
        id: model.id,
        object: model.object,
        created: model.created
      }))
    }

    // 处理其他格式的响应
    if (Array.isArray(response.data)) {
      return response.data
    }

    throw new Error('无法解析模型列表响应')
  } catch (error) {
    // 如果获取模型列表失败，返回一些常见模型
    if (error.response && error.response.status === 404) {
      // API可能不支持/models端点，返回空数组
      return []
    }
    throw error
  }
}

/**
 * 使用AI进行JSON转换
 */
export async function convertWithAI(apiUrl, apiKey, model, prompt) {
  try {
    const chatUrl = apiUrl.endsWith('/v1')
      ? `${apiUrl}/chat/completions`
      : `${apiUrl}/v1/chat/completions`

    const response = await axios.post(
      chatUrl,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的JSON格式转换助手。请严格按照要求返回JSON格式数据，不要包含任何其他文字说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // 提取AI返回的内容
    let content = response.data.choices[0].message.content.trim()

    // 尝试解析JSON
    // 如果返回的内容包含代码块，提取JSON部分
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      content = jsonMatch[1]
    }

    // 尝试直接解析
    try {
      const parsed = JSON.parse(content)
      // 如果解析成功，格式化返回
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      // 如果解析失败，尝试提取数组部分
      const arrayMatch = content.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0])
        return JSON.stringify(parsed, null, 2)
      }
      throw new Error('AI返回的内容不是有效的JSON格式')
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API请求失败: ${error.response.status} - ${error.response.data?.error?.message || error.message}`
      )
    }
    throw error
  }
}

