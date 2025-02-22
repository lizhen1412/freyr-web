<template>
  <div id="app">
    <!-- 聊天窗口 -->
    <el-card class="chat-window">
      <template #header>
        <div>聊天对话框</div>
      </template>
      <div class="chat-messages">
        <!-- 显示历史消息 -->
        <div v-for="(message, index) in chatMessages" :key="index" :class="message.role === 'user' ? 'user-message' : 'bot-message'">
          {{ message.content }}
        </div>
      </div>
    </el-card>
    <!-- 输入框和发送按钮 -->
    <div class="input-container">
      <el-input v-model="inputMessage" placeholder="请输入你的问题" @keyup.enter="sendMessage"></el-input>
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import ollama from 'ollama';

export default {
  name: 'App',
  data() {
    return {
      inputMessage: '',
      chatMessages: []
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage) return;
      // 添加用户消息到聊天记录
      const userMessage = { role: 'user', content: this.inputMessage };
      this.chatMessages.push(userMessage);
      try {
        const response = await ollama.chat({
          model: 'llama3.1:8b',
          messages: [userMessage],
          stream: true
        });
        let fullResponse = '';
        for await (const part of response) {
          fullResponse += part.message.content;
        }
        // 添加机器人回复到聊天记录
        const botMessage = { role: 'bot', content: fullResponse };
        this.chatMessages.push(botMessage);
      } catch (error) {
        console.error('请求出错:', error);
        const errorMessage = { role: 'bot', content: '请求出错，请稍后重试' };
        this.chatMessages.push(errorMessage);
      }
      // 清空输入框
      this.inputMessage = '';
    }
  }
};
</script>

<style scoped>
.chat-window {
  height: 400px;
  margin-bottom: 20px;
}

.chat-messages {
  height: 330px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.user-message {
  background-color: #e1f5fe;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  align-self: flex-end;
  max-width: 70%;
  word-wrap: break-word;
}

.bot-message {
  background-color: #f1f8e9;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  align-self: flex-start;
  max-width: 70%;
  word-wrap: break-word;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-container el-input {
  flex: 1;
  margin-right: 10px;
}
</style>