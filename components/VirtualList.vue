<template>
  <div
    ref="containerRef"
    class="virtual-list-container overflow-auto"
    @scroll="onScroll"
  >
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    />
    <div
      class="virtual-list-content"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <slot
        v-for="item in visibleData"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    data: any[];
    itemHeight: number;
    bufferSize?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    bufferSize: 5,
  });

  const containerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const visibleData = ref<any[]>([]);
  const offset = ref(0);

  // 计算总高度
  const totalHeight = computed(() => props.data.length * props.itemHeight);

  // 计算可见区域的起始索引和结束索引
  const getVisibleRange = () => {
    if (!containerRef.value) return { start: 0, end: 0 };

    const container = containerRef.value;
    const { height: containerHeight } = container.getBoundingClientRect();

    // 计算可见区域的起始索引
    let start = Math.floor(scrollTop.value / props.itemHeight);
    // 计算可见区域的结束索引
    let end = Math.ceil((scrollTop.value + containerHeight) / props.itemHeight);

    // 添加缓冲区
    start = Math.max(0, start - props.bufferSize);
    end = Math.min(props.data.length, end + props.bufferSize);

    return { start, end };
  };

  // 更新可见数据
  const updateVisibleData = () => {
    const { start, end } = getVisibleRange();
    visibleData.value = props.data.slice(start, end);
    offset.value = start * props.itemHeight;
  };

  // 滚动事件处理
  const onScroll = () => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop;
      updateVisibleData();
    }
  };

  // 监听数据变化
  watch(
    () => props.data,
    () => {
      updateVisibleData();
    },
    { deep: true }
  );

  // 组件挂载后初始化
  onMounted(() => {
    updateVisibleData();
  });
</script>

<style scoped>
  .virtual-list-container {
    position: relative;
    height: 100%;
  }

  .virtual-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }

  .virtual-list-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    min-height: 100%;
  }
</style>
