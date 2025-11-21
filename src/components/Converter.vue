<template>
  <div class="converter">
    <!-- 转换模式选择 -->
    <el-card class="mode-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>转换模式</span>
        </div>
      </template>
      <el-radio-group v-model="conversionMode" @change="handleModeChange">
        <el-radio label="local">本地转换</el-radio>
        <el-radio label="ai">AI转换</el-radio>
      </el-radio-group>

      <!-- AI转换配置 -->
      <div v-if="conversionMode === 'ai'" class="ai-config">
        <el-form :model="aiConfig" label-width="100px" style="margin-top: 20px">
          <el-form-item label="API地址">
            <el-input
              v-model="aiConfig.apiUrl"
              placeholder="请输入API地址，例如：https://api.openai.com/v1"
            />
          </el-form-item>
          <el-form-item label="API Key">
            <el-input
              v-model="aiConfig.apiKey"
              type="password"
              placeholder="请输入API Key"
              show-password
            />
          </el-form-item>
          <el-form-item label="模型">
            <el-input
              v-model="aiConfig.model"
              placeholder="请输入模型名称"
              style="width: 200px; margin-right: 10px"
            />
            <el-button type="primary" @click="fetchModels">获取模型</el-button>
          </el-form-item>
          <el-form-item v-if="models.length > 0" label="选择模型">
            <el-select
              v-model="aiConfig.model"
              placeholder="请选择模型"
              style="width: 300px"
            >
              <el-option
                v-for="model in models"
                :key="model.id"
                :label="model.id"
                :value="model.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 输出格式选择 -->
    <el-card class="format-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>输出格式</span>
        </div>
      </template>
      <el-select
        v-model="outputFormat"
        placeholder="请选择输出格式"
        style="width: 100%"
        @change="handleFormatChange"
      >
        <el-option label="LunaTV/MoonTV" value="lunatv" />
        <el-option label="Omnibox" value="omnibox" />
      </el-select>
    </el-card>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧：待转换格式 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待转换格式</span>
              <el-button
                type="primary"
                size="small"
                @click="fetchFromUrl"
                :icon="Document"
              >
                从URL获取
              </el-button>
            </div>
          </template>
          <el-input
            v-model="inputJson"
            type="textarea"
            :rows="20"
            placeholder="请输入或粘贴JSON格式数据，或点击上方按钮从URL获取"
            @input="handleInputChange"
          />
          <div class="action-buttons">
            <el-button
              type="primary"
              :disabled="!canConvert"
              @click="convertJson"
              :icon="Refresh"
            >
              转换
            </el-button>
            <el-button @click="clearInput" :icon="Delete">清空</el-button>
            <el-button @click="formatInput" :icon="Document">格式化</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：转换后格式 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>转换后格式</span>
              <el-button
                type="success"
                size="small"
                @click="copyOutput"
                :icon="DocumentCopy"
              >
                复制
              </el-button>
            </div>
          </template>
          <el-input
            v-model="outputJson"
            type="textarea"
            :rows="20"
            placeholder="转换后的JSON格式将显示在这里"
            readonly
          />
          <div class="action-buttons">
            <el-button @click="clearOutput" :icon="Delete">清空</el-button>
            <el-button @click="formatOutput" :icon="Document">格式化</el-button>
            <el-button @click="downloadOutput" :icon="Download">下载</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- URL输入对话框 -->
    <el-dialog v-model="urlDialogVisible" title="从URL获取" width="500px">
      <el-input
        v-model="urlInput"
        placeholder="请输入JSON数据的URL地址"
        style="margin-bottom: 10px"
      />
      <template #footer>
        <el-button @click="urlDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmFetchUrl">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Refresh,
  Delete,
  DocumentCopy,
  Download
} from '@element-plus/icons-vue'
import { convertToLunaTV, convertToOmnibox } from '../utils/converter'
import { fetchModelsFromAPI, convertWithAI } from '../utils/aiService'
import axios from 'axios'

const conversionMode = ref('local')
const outputFormat = ref('lunatv')
const inputJson = ref('')
const outputJson = ref('')
const urlDialogVisible = ref(false)
const urlInput = ref('')

// AI配置
const aiConfig = ref({
  apiUrl: '',
  apiKey: '',
  model: ''
})
const models = ref([])

// 是否可以转换
const canConvert = computed(() => {
  if (!inputJson.value.trim()) return false
  if (conversionMode.value === 'ai') {
    return (
      aiConfig.value.apiUrl &&
      aiConfig.value.apiKey &&
      aiConfig.value.model
    )
  }
  return true
})

// 处理模式切换
const handleModeChange = () => {
  outputJson.value = ''
}

// 处理格式切换
const handleFormatChange = () => {
  outputJson.value = ''
}

// 处理输入变化
const handleInputChange = () => {
  // 可以在这里添加实时验证
}

// 从URL获取
const fetchFromUrl = () => {
  urlDialogVisible.value = true
  urlInput.value = ''
}

// 确认从URL获取
const confirmFetchUrl = async () => {
  if (!urlInput.value.trim()) {
    ElMessage.warning('请输入URL地址')
    return
  }

  try {
    const response = await axios.get(urlInput.value)
    if (typeof response.data === 'string') {
      inputJson.value = response.data
    } else {
      inputJson.value = JSON.stringify(response.data, null, 2)
    }
    ElMessage.success('获取成功')
    urlDialogVisible.value = false
  } catch (error) {
    ElMessage.error('获取失败：' + error.message)
  }
}

// 获取模型列表
const fetchModels = async () => {
  if (!aiConfig.value.apiUrl || !aiConfig.value.apiKey) {
    ElMessage.warning('请先填写API地址和API Key')
    return
  }

  try {
    const fetchedModels = await fetchModelsFromAPI(
      aiConfig.value.apiUrl,
      aiConfig.value.apiKey
    )
    models.value = fetchedModels
    ElMessage.success(`获取到 ${fetchedModels.length} 个模型`)
  } catch (error) {
    ElMessage.error('获取模型失败：' + error.message)
  }
}

// 转换JSON
const convertJson = async () => {
  if (!inputJson.value.trim()) {
    ElMessage.warning('请输入待转换的JSON数据')
    return
  }

  try {
    // 验证输入JSON格式
    const inputData = JSON.parse(inputJson.value)

    if (conversionMode.value === 'ai') {
      // AI转换
      const prompt = generateConversionPrompt(inputData, outputFormat.value)
      const converted = await convertWithAI(
        aiConfig.value.apiUrl,
        aiConfig.value.apiKey,
        aiConfig.value.model,
        prompt
      )
      outputJson.value = converted
    } else {
      // 本地转换
      let converted
      if (outputFormat.value === 'lunatv') {
        converted = convertToLunaTV(inputData)
      } else if (outputFormat.value === 'omnibox') {
        converted = convertToOmnibox(inputData)
      }
      outputJson.value = JSON.stringify(converted, null, 2)
    }

    ElMessage.success('转换成功')
  } catch (error) {
    ElMessage.error('转换失败：' + error.message)
  }
}

// 生成转换提示词
const generateConversionPrompt = (inputData, format) => {
  const formatDescription =
    format === 'lunatv'
      ? `LunaTV/MoonTV格式，每个对象包含字段：name, key, api, detail, disabled, is_adult`
      : `Omnibox格式，每个对象包含字段：id, key, name, api, type, isActive, time, isDefault, remark, tags, priority`

  return `请将以下JSON数据转换为${formatDescription}格式。要求：
1. 保持数据的核心信息
2. 根据输入数据自动填充所有必需字段
3. 返回有效的JSON数组格式

输入数据：
${JSON.stringify(inputData, null, 2)}

请直接返回转换后的JSON数组，不要包含任何其他文字说明。`
}

// 格式化输入
const formatInput = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('格式化成功')
  } catch (error) {
    ElMessage.error('格式化失败：' + error.message)
  }
}

// 格式化输出
const formatOutput = () => {
  try {
    const parsed = JSON.parse(outputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('格式化成功')
  } catch (error) {
    ElMessage.error('格式化失败：' + error.message)
  }
}

// 清空输入
const clearInput = () => {
  inputJson.value = ''
}

// 清空输出
const clearOutput = () => {
  outputJson.value = ''
}

// 复制输出
const copyOutput = () => {
  if (!outputJson.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  navigator.clipboard.writeText(outputJson.value).then(
    () => {
      ElMessage.success('复制成功')
    },
    () => {
      ElMessage.error('复制失败')
    }
  )
}

// 下载输出
const downloadOutput = () => {
  if (!outputJson.value) {
    ElMessage.warning('没有可下载的内容')
    return
  }

  const blob = new Blob([outputJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted_${outputFormat.value}_${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('下载成功')
}
</script>

<style scoped>
.converter {
  max-width: 1400px;
  margin: 0 auto;
}

.mode-card,
.format-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-config {
  margin-top: 10px;
}

.main-content {
  margin-top: 20px;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.el-textarea {
  font-family: 'Courier New', monospace;
}
</style>

