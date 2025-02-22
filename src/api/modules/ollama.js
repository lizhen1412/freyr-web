import request from '../utils/request';

/**
 * 调用 Ollama 的 generate 接口
 * @param {string} model - 使用的模型名称
 * @param {string} prompt - 输入的提示信息
 * @param {boolean} stream - 是否开启流式输出
 * @returns {Promise} - 返回一个 Promise 对象
 */
export function generateResponse(model, prompt, stream) {
  const data = {
    model,
    prompt,
    stream,
  };
  return request({
    url: '/api/generate',
    method: 'post',
    data,
    // isStreamRequest: stream,  // Add stream flag to configure response type
  });
}
