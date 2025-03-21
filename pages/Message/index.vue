<template>
  <div class="flex flex-col h-full">
    <!-- 聊天消息区域 -->
    <div
      class="flex-1 overflow-y-auto p-4 space-y-4"
      ref="messageContainer"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="space-y-2"
      >
        <!-- 思考过程 -->
        <div
          v-if="message.type === 'reasoning'"
          class="text-gray-500 italic"
        >
          {{ message.content }}
        </div>
        <!-- 分隔线 -->
        <div
          v-else-if="message.type === 'separator'"
          class="border-t border-gray-200 my-4"
        ></div>
        <!-- 回答内容 -->
        <div
          v-else-if="message.type === 'answer'"
          class="text-gray-800"
        >
          {{ message.content }}
        </div>
        <!-- 错误信息 -->
        <div
          v-else-if="message.type === 'error'"
          class="text-red-500"
        >
          {{ message.message }}
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex space-x-2">
        <input
          v-model="question"
          type="text"
          placeholder="请输入您的问题..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
          @keyup.enter="handleSubmit"
        />
        <button
          @click="handleSubmit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || !question.trim()"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';

  const messages = ref([]);
  const question = ref('');
  const isLoading = ref(false);
  const messageContainer = ref(null);
  let eventSource = null;

  // 滚动到底部
  const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!question.value.trim() || isLoading.value) return;

    isLoading.value = true;
    messages.value = [];

    // 关闭之前的连接
    if (eventSource) {
      eventSource.close();
    }

    // 创建新的 EventSource 连接
    eventSource = new EventSource(
      `http://127.0.0.1:4396/api/private/chat/streamTest?question=${encodeURIComponent(
        question.value
      )}`
    );

    eventSource.onmessage = (event) => {
      console.log('onmessage', event.data);
    };

    // 监听连接错误
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      isLoading.value = false;
      messages.value.push({
        type: 'error',
        message: '连接失败，请稍后重试',
      });
      scrollToBottom();
    };
  };

  // 组件卸载时清理
  onUnmounted(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
</script>

<style scoped>
  /* 可以添加自定义样式 */
</style>
