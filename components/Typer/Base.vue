<template>
  <div class="typer-container">
    <span class="typer-text">{{ state.displayText }}</span>
    <span class="typer-cursor blink"></span>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, onBeforeUnmount } from 'vue';
  import type { TyperProps, TyperState } from './Typer';
  import './Typer.css';

  const props = withDefaults(defineProps<TyperProps>(), {
    typingSpeed: 80,
    startDelay: 500,
  });

  const state = reactive<TyperState>({
    displayText: '',
    isTypingComplete: false,
    currentIndex: 0,
  });

  let animationFrame: number;
  let timeoutId: number;

  const typeText = () => {
    if (state.currentIndex < props.text.length) {
      state.currentIndex++;
      state.displayText = props.text.slice(0, state.currentIndex);

      // 使用 RAF 优化动画性能
      animationFrame = requestAnimationFrame(() => {
        timeoutId = window.setTimeout(typeText, props.typingSpeed);
      });
    } else {
      state.isTypingComplete = true;
    }
  };

  onMounted(() => {
    timeoutId = window.setTimeout(typeText, props.startDelay);
  });

  // 清理定时器和动画帧
  onBeforeUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>
