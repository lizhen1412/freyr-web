<!-- 
  OllamaTest1.vue
  这是一个基于 Vue 的聊天界面组件，用于与 Ollama AI 模型进行对话
  主要功能：
  1. 提供聊天界面，包括消息显示区域和输入区域
  2. 支持发送消息给 AI 模型并接收回复
  3. 支持查看模型信息
  4. 支持清除所有聊天记录
-->
<template>
  <!-- 主容器 -->
  <div id="app">
    <!-- 聊天窗口：使用 Element Plus 的 Card 组件 -->
    <el-card class="chat-window">
      <!-- 卡片头部：显示标题和清除按钮 -->
      <template #header>
        <div class="card-header">
          <span>聊天对话框</span>
          <!-- 查看模型信息按钮 -->
          <el-button type="primary" @click="showModel">获取模型</el-button>
        </div>
      </template>
      <!-- 使用 el-scrollbar 替换虚拟列表 -->
      <el-scrollbar class="chat-messages" ref="chatContainer" always>
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="message-wrapper"
          :class="message.role === 'user' ? 'message-wrapper-right' : 'message-wrapper-left'"
        >
          <el-avatar
            :class="message.role === 'user' ? 'user-avatar' : 'bot-avatar'"
            :size="40"
          >
            <el-icon v-if="message.role === 'user'">
              <Female />
            </el-icon>
            <el-icon v-else>
              <ChatDotRound />
            </el-icon>
          </el-avatar>
          <div class="message-bubble" :class="message.role === 'user' ? 'user-message' : 'bot-message'">
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <!-- 底部输入区域：包含输入框和操作按钮 -->
    <div class="input-container">
      <!-- 
        输入框：支持回车发送
        v-model 用于双向数据绑定
      -->
      <el-input v-model="inputMessage" placeholder="请输入你的问题" @keyup.enter="sendMessage"></el-input>
      <!-- 发送按钮 -->
      <el-button type="primary" @click="sendMessage">发送</el-button>
      <!-- 清除消息按钮：添加确认提示 -->
      <el-button 
        type="danger" 
        size="small" 
        @click="confirmClearMessages"
        :disabled="chatMessages.length === 0">
        清除消息
      </el-button>
    </div>

    <!-- 模型信息对话框 -->
    <el-dialog
      v-model="modelDialogVisible"
      title="模型信息"
      width="70%"
      :close-on-click-modal="false"
      class="model-info-dialog"
    >
      <div v-if="modelInfo" class="model-info">
        <el-tabs>
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息">
            <el-scrollbar height="400px" always>
              <div class="tab-content">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="模型名称">{{ modelInfo.details?.basename || 'llama3.1:8b' }}</el-descriptions-item>
                  <el-descriptions-item label="修改时间">
                    <el-tooltip
                      :content="formatDateTime(modelInfo.modified_at, true)"
                      placement="top"
                    >
                      <span>{{ formatDateTime(modelInfo.modified_at) }}</span>
                    </el-tooltip>
                  </el-descriptions-item>
                  <el-descriptions-item label="参数大小">{{ modelInfo.details.parameter_size }}</el-descriptions-item>
                  <el-descriptions-item label="量化级别">{{ modelInfo.details.quantization_level }}</el-descriptions-item>
                  <el-descriptions-item label="模型系列">{{ modelInfo.details.family }}</el-descriptions-item>
                  <el-descriptions-item label="格式">{{ modelInfo.details.format }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-scrollbar>
          </el-tab-pane>

          <!-- 详细信息 -->
          <el-tab-pane label="详细信息">
            <el-scrollbar height="400px" always>
              <div class="tab-content">
                <el-collapse v-model="activeCollapseNames">
                  <!-- 基础信息 -->
                  <el-collapse-item title="基础信息" name="1">
                    <el-descriptions :column="2" border>
                      <el-descriptions-item label="架构">{{ modelInfo.model_info['general.architecture'] }}</el-descriptions-item>
                      <el-descriptions-item label="基础名称">{{ modelInfo.model_info['general.basename'] }}</el-descriptions-item>
                      <el-descriptions-item label="文件类型">{{ modelInfo.model_info['general.file_type'] }}</el-descriptions-item>
                      <el-descriptions-item label="微调类型">{{ modelInfo.model_info['general.finetune'] }}</el-descriptions-item>
                      <el-descriptions-item label="支持语言">{{ modelInfo.model_info['general.languages'].join(', ') }}</el-descriptions-item>
                      <el-descriptions-item label="标签">{{ modelInfo.model_info['general.tags'].join(', ') }}</el-descriptions-item>
                    </el-descriptions>
                  </el-collapse-item>

                  <!-- 模型参数 -->
                  <el-collapse-item title="模型参数" name="2">
                    <el-descriptions :column="2" border>
                      <el-descriptions-item label="注意力头数">{{ modelInfo.model_info['llama.attention.head_count'] }}</el-descriptions-item>
                      <el-descriptions-item label="KV注意力头数">{{ modelInfo.model_info['llama.attention.head_count_kv'] }}</el-descriptions-item>
                      <el-descriptions-item label="层数">{{ modelInfo.model_info['llama.block_count'] }}</el-descriptions-item>
                      <el-descriptions-item label="上下文长度">{{ modelInfo.model_info['llama.context_length'] }}</el-descriptions-item>
                      <el-descriptions-item label="嵌入维度">{{ modelInfo.model_info['llama.embedding_length'] }}</el-descriptions-item>
                      <el-descriptions-item label="前馈网络维度">{{ modelInfo.model_info['llama.feed_forward_length'] }}</el-descriptions-item>
                      <el-descriptions-item label="词表大小">{{ modelInfo.model_info['llama.vocab_size'] }}</el-descriptions-item>
                    </el-descriptions>
                  </el-collapse-item>

                  <!-- 分词器信息 -->
                  <el-collapse-item title="分词器信息" name="3">
                    <el-descriptions :column="2" border>
                      <el-descriptions-item label="BOS Token ID">{{ modelInfo.model_info['tokenizer.ggml.bos_token_id'] }}</el-descriptions-item>
                      <el-descriptions-item label="EOS Token ID">{{ modelInfo.model_info['tokenizer.ggml.eos_token_id'] }}</el-descriptions-item>
                      <el-descriptions-item label="分词器模型">{{ modelInfo.model_info['tokenizer.ggml.model'] }}</el-descriptions-item>
                      <el-descriptions-item label="分词器前缀">{{ modelInfo.model_info['tokenizer.ggml.pre'] }}</el-descriptions-item>
                    </el-descriptions>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-scrollbar>
          </el-tab-pane>

          <!-- 许可证信息 -->
          <el-tab-pane label="许可证">
            <el-scrollbar height="400px" always>
              <div class="tab-content license-content">
                <pre>{{ modelInfo.license }}</pre>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else class="model-info-loading">
        <el-empty v-if="modelInfoError" :description="modelInfoError" />
        <el-empty v-else description="正在加载模型信息..." />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入 ollama 库，用于与 AI 模型通信
import ollama from 'ollama';
// 导入 Element Plus 图标
import { Female, ChatDotRound } from '@element-plus/icons-vue'

export default {
  name: 'App',
  // 注册组件
  components: {
    Female,
    ChatDotRound
  },
  // 组件数据定义
  data() {
    return {
      messageIdCounter: 0, // 用于生成消息的唯一ID
      // 存储用户当前输入的消息
      inputMessage: '',
      // 存储所有的聊天记录，包括用户消息和机器人回复
      chatMessages: [],
      // 模型信息对话框显示状态
      modelDialogVisible: false,
      // 存储模型信息
      modelInfo: null,
      // 存储模型信息加载错误
      modelInfoError: null,
      // 折叠面板展开的项
      activeCollapseNames: ['1', '2', '3']
    };
  },
  // 监听聊天消息的变化
  watch: {
    // 监听聊天消息数组的变化，当有新消息时自动滚动
    chatMessages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },
  methods: {
    /**
     * 滚动到底部方法
     * 功能：将聊天区域滚动到最新消息处
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const scrollbar = this.$refs.chatContainer;
        if (scrollbar) {
          // 使用 Element Plus scrollbar 的方法设置滚动位置
          scrollbar.setScrollTop(scrollbar.wrapRef.scrollHeight);
        }
      });
    },

    /**
     * 发送消息方法
     * 功能：
     * 1. 发送用户消息到 AI 模型
     * 2. 接收并处理 AI 模型的回复
     * 3. 更新聊天界面
     */
    async sendMessage() {
      // 检查消息是否为空
      if (!this.inputMessage) return;

      // 保存当前输入的消息
      const currentMessage = this.inputMessage;
      // 立即清空输入框，提升用户体验
      this.inputMessage = '';

      // 创建用户消息对象
      const userMessage = { 
        id: ++this.messageIdCounter, // 添加唯一ID
        role: 'user', 
        content: currentMessage 
      };
      // 将用户消息添加到聊天记录
      this.chatMessages.push(userMessage);

      try {
        // 调用 Ollama API 发送请求
        // model: 指定使用的 AI 模型
        // messages: 发送的消息内容
        // stream: 启用流式响应，实现实时返回
        const response = await ollama.chat({
          model: 'llama3.1:8b',
          messages: [userMessage],
          stream: true
        });

        // 用于存储完整的 AI 回复
        let fullResponse = '';
        // 通过 for await 循环处理流式响应
        // 将每个部分的回复累加到完整回复中
        for await (const part of response) {
          fullResponse += part.message.content;
        }

        // 创建并添加机器人回复到聊天记录
        const botMessage = { 
          id: ++this.messageIdCounter, // 添加唯一ID
          role: 'bot', 
          content: fullResponse 
        };
        this.chatMessages.push(botMessage);
      } catch (error) {
        // 错误处理：记录错误并向用户显示错误提示
        console.error('请求出错:', error);
        const errorMessage = { 
          id: ++this.messageIdCounter, // 添加唯一ID
          role: 'bot', 
          content: '请求出错，请稍后重试' 
        };
        this.chatMessages.push(errorMessage);
      }
    },

    /**
     * 显示模型信息方法
     * 功能：获取并显示当前 AI 模型的详细信息
     */
    async showModel() {
      // 显示对话框
      this.modelDialogVisible = true;
      // 重置状态
      this.modelInfo = null;
      this.modelInfoError = null;

      try {
        // 创建请求对象，指定要查询的模型
        const showRequest = {
          model: 'llama3.1:8b'
        };

        // 调用 API 获取模型信息
        const response = await ollama.show(showRequest);
        // 保存模型信息
        this.modelInfo = response;
      } catch (error) {
        console.error('获取模型信息失败:', error);
        this.modelInfoError = '获取模型信息失败，请稍后重试';
      }
    },

    /**
     * 确认清除消息
     * 功能：弹出确认对话框，询问用户是否确认清除所有聊天记录
     */
    confirmClearMessages() {
      // 使用 Element Plus 的确认对话框
      this.$confirm('确认要清除所有聊天记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.clearMessages();
          // 显示清除成功的提示
          this.$message({
            type: 'success',
            message: '聊天记录已清除'
          });
        })
        .catch(() => {
          // 用户取消清除操作，显示取消提示
          this.$message({
            type: 'info',
            message: '已取消清除操作'
          });
        });
    },

    /**
     * 清除消息方法
     * 功能：清除所有聊天记录
     */
    clearMessages() {
      this.chatMessages = [];
    },

    /**
     * 格式化日期时间
     * @param {string} dateString - ISO格式的日期字符串
     * @param {boolean} showDetail - 是否显示详细时间
     * @returns {string} 格式化后的日期时间字符串
     */
    formatDateTime(dateString, showDetail = false) {
      if (!dateString) return '暂无数据';
      
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      if (showDetail) {
        return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
      }
      return `${year}年${month}月${day}日`;
    }
  }
};
</script>

<style scoped>
/* 聊天窗口样式 */
.chat-window {
  height: 400px; /* 固定高度 */
  margin-bottom: 20px;
  background-color: #f5f5f5; /* 聊天背景色 */
}

/* 聊天消息容器样式 */
.chat-messages {
  height: 330px;
  padding: 16px;
  background-color: #f5f5f5;
}

/* 消息包装器样式 */
.message-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}

/* 右侧（用户）消息包装器 */
.message-wrapper-right {
  flex-direction: row-reverse;
}

/* 头像：使用 Element Plus 的 Avatar 组件 */
.avatar {
  display: none;
}

/* 用户头像样式 */
.user-avatar {
  background-color: #1890ff !important;
  margin-left: 12px;
  color: white !important;
}

/* 机器人头像样式 */
.bot-avatar {
  background-color: #52c41a !important;
  margin-right: 12px;
  color: white !important;
}

/* 头像图标样式 */
.el-icon {
  font-size: 20px;
}

/* 消息气泡基础样式 */
.message-bubble {
  padding: 10px 16px;
  border-radius: 16px;
  position: relative;
  max-width: calc(70% - 50px);
  word-wrap: break-word;
}

/* 用户消息气泡样式 */
.user-message {
  background-color: #1890ff;
  color: white;
  border-top-right-radius: 4px;
}

/* 机器人消息气泡样式 */
.bot-message {
  background-color: white;
  color: #333;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 消息内容样式 */
.message-content {
  font-size: 14px;
  line-height: 1.6;
}

/* 输入区域容器样式 */
.input-container {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 12px;
  border-top: 1px solid #e8e8e8;
}

/* 输入框样式 */
.input-container el-input {
  flex: 1;
  margin-right: 12px;
}

/* 按钮样式优化 */
.el-button {
  margin-left: 8px;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  background-color: white;
}

/* 模型信息对话框样式 */
:deep(.model-info-dialog .el-dialog__body) {
  padding: 0 20px 20px;
}

/* 模型信息内容样式 */
.model-info {
  padding: 10px;
}

.tab-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

/* 许可证内容样式 */
.license-content {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.license-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: monospace;
  padding: 16px;
}

/* 自定义滚动条样式 */
:deep(.el-scrollbar__bar) {
  opacity: 0.3;
  z-index: 100;
}

:deep(.el-scrollbar__bar:hover) {
  opacity: 0.5;
}

/* 标签页样式优化 */
:deep(.el-tabs__content) {
  overflow: visible;
}

/* 折叠面板样式优化 */
:deep(.el-collapse-item__content) {
  padding: 20px 0;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}

/* 描述列表样式优化 */
:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: bold;
}

:deep(.el-descriptions__content) {
  word-break: break-word;
}
</style>