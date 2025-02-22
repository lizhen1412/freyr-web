<template>
  <div>
    <!-- 输入框，用于用户输入问题 -->
    <el-input v-model="inputMessage" placeholder="请输入你的问题" @keyup.enter="handleClick"></el-input>
    <el-button type="primary" @click="handleClick">发送请求</el-button>
    <!-- 对话框容器 -->
    <div class="chat-dialog">
      <!-- 显示用户输入的消息 -->
      <div v-if="inputMessage" class="user-message">{{ inputMessage }}</div>
      <!-- 显示 Ollama 的响应消息 -->
      <div v-if="responseText" class="bot-message">{{ responseText }}</div>
    </div>
  </div>
</template>

<script>
import ollama from 'ollama';

export default {
  name: 'OllamaTest1',
  data() {
    return {
      // 用于存储用户输入的消息
      inputMessage: '',
      // 用于存储 Ollama 的响应消息
      responseText: ''
    };
  },
  computed: {},
  methods: {
    async handleClick() {
      if (!this.inputMessage) {
        return; // 如果输入为空，不发送请求
      }
      try {
        const message = { role: 'user', content: this.inputMessage };
        const response = await ollama.chat({ model: 'llama3.1:8b', messages: [message], stream: true });
        let fullResponse = '';
        for await (const part of response) {
          fullResponse += part.message.content;
          this.responseText = fullResponse;
        }
      } catch (error) {
        console.error('请求出错:', error);
        this.responseText = '请求出错，请稍后重试';
      }
    }
  },
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  activated() {},
  deactivated() {},
  errorCaptured(err, instance, info) {
    return false;
  },
  renderTracked(event) {},
  renderTriggered(event) {}
};
</script>

<style scoped>
/* 对话框容器样式 */
.chat-dialog {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

/* 用户消息样式 */
.user-message {
  background-color: #e1f5fe;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  align-self: flex-start;
}

/* 机器人消息样式 */
.bot-message {
  background-color: #f1f8e9;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  align-self: flex-end;
}
</style>