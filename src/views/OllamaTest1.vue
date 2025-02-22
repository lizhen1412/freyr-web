<template>
  <div>
    <el-input v-model="prompt" placeholder="Enter prompt" :clearable="true" />

    <el-button type="primary" @click="generateResponse">
      Generate Response
    </el-button>

   
  </div>
</template>

<script>
import { generateResponse } from '../api/modules/ollama';

export default {
  name: 'OllamaTest1',
  data() {
    return {
      prompt: '',
      loading: false,
      streamResponse: '',
      finalResponse: '',
      error: null,
    };
  },

  // 定义 方法
  methods: {
    async generateResponse() {
      try {
        console.log(this.prompt);
        const response = await generateResponse('llama3.1:8b', this.prompt, true);
        console.log(response);
        this.finalResponse = response;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

  },

};

</script>

<style scoped></style>