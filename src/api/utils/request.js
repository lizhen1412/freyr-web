import axios from 'axios';

// Ensure we are getting VITE_API_BASE_URL correctly from .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Provide a fallback in case the env variable is missing

// 创建 axios 实例
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 10000 // 请求超时时间
});

// 使用服务的拦截器来配置请求
service.interceptors.request.use(
    (config) => {
        if (config.isStreamRequest) {
            config.responseType = 'stream'; // Set response type to 'stream' if required
        }
        return config;
    },
    (error) => {
        console.error('请求拦截器出错:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        if (response.config.isStreamRequest) {
            // Handle streaming response here
            return handleStreamResponse(response);
        }
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to handle streaming NDJSON response
const handleStreamResponse = (response) => {
    const reader = response.data.getReader();
    const decoder = new TextDecoder();
    let streamData = '';
    let done = false;

    return new Promise((resolve, reject) => {
        reader.read().then(function processText({ done, value }) {
            if (done) {
                // Once done, resolve the final response
                const finalResult = JSON.parse(streamData);
                resolve(finalResult);
                return;
            }

            // Append data (NDJSON chunk)
            streamData += decoder.decode(value, { stream: true });

            // Split the streamData by newlines, as NDJSON is newline-delimited JSON
            const responseParts = streamData.split('\n');
            responseParts.forEach(part => {
                if (part) {
                    try {
                        const json = JSON.parse(part);
                        if (json.done) {
                            resolve(json); // Resolve final response
                        } else {
                            // Keep appending to ongoing stream response
                            resolve({ response: json.response });
                        }
                    } catch (e) {
                        // Handle incomplete data
                    }
                }
            });

            // Continue reading next chunk
            reader.read().then(processText);
        }).catch(reject);
    });
};

export default service;
