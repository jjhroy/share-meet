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
        :index="item.index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue';

  interface Props {
    data: any[];
    itemHeight: number;
    bufferSize?: number;
    overscan?: number;
    dynamicHeight?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    bufferSize: 5,
    overscan: 3,
    dynamicHeight: false,
  });

  const containerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const visibleData = ref<any[]>([]);
  const offset = ref(0);
  const itemHeights = ref<Map<string, number>>(new Map());
  const observer = ref<ResizeObserver | null>(null);

  // 计算总高度
  const totalHeight = computed(() => {
    if (props.dynamicHeight) {
      return Array.from(itemHeights.value.values()).reduce((sum, height) => sum + height, 0);
    }
    return props.data.length * props.itemHeight;
  });

  // 获取动态高度
  const getItemHeight = (index: number) => {
    if (!props.dynamicHeight) return props.itemHeight;
    const item = props.data[index];
    return itemHeights.value.get(item.id) || props.itemHeight;
  };

  // 计算可见区域的起始索引和结束索引
  const getVisibleRange = () => {
    if (!containerRef.value) return { start: 0, end: 0 };

    const container = containerRef.value;
    const { height: containerHeight } = container.getBoundingClientRect();

    let start = 0;
    let currentHeight = 0;

    // 找到起始索引
    while (start < props.data.length && currentHeight < scrollTop.value) {
      currentHeight += getItemHeight(start);
      start++;
    }

    // 找到结束索引
    let end = start;
    while (end < props.data.length && currentHeight < scrollTop.value + containerHeight) {
      currentHeight += getItemHeight(end);
      end++;
    }

    // 添加缓冲区
    start = Math.max(0, start - props.overscan);
    end = Math.min(props.data.length, end + props.overscan);

    return { start, end };
  };

  // 更新可见数据
  const updateVisibleData = () => {
    const { start, end } = getVisibleRange();
    visibleData.value = props.data.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
    }));

    // 计算偏移量
    let currentOffset = 0;
    for (let i = 0; i < start; i++) {
      currentOffset += getItemHeight(i);
    }
    offset.value = currentOffset;
  };

  // 设置动态高度
  const setItemHeight = (id: string, height: number) => {
    if (height !== itemHeights.value.get(id)) {
      itemHeights.value.set(id, height);
      nextTick(() => {
        updateVisibleData();
      });
    }
  };

  // 初始化 ResizeObserver
  const initResizeObserver = () => {
    if (!props.dynamicHeight) return;

    observer.value = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-item-id');
        if (id) {
          setItemHeight(id, entry.contentRect.height);
        }
      });
    });
  };

  // 滚动事件处理（使用防抖）
  const onScroll = useDebounce(() => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop;
      updateVisibleData();
    }
  }, 16); // 约60fps

  // 监听数据变化
  watch(
    () => props.data,
    () => {
      nextTick(() => {
        updateVisibleData();
      });
    },
    { deep: true }
  );

  // 组件挂载后初始化
  onMounted(() => {
    initResizeObserver();
    updateVisibleData();
  });

  // 组件卸载时清理
  onUnmounted(() => {
    observer.value?.disconnect();
    onScroll.cancel();
  });
</script>

<style scoped>
  .virtual-list-container {
    position: relative;
    height: 100%;
    will-change: transform;
    padding-right: 17px; /* 为滚动条预留空间 */
    overflow-y: scroll;
  }

  /* 隐藏滚动条但保持功能 */
  .virtual-list-container::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  .virtual-list-container::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .virtual-list-container::-webkit-scrollbar-track {
    background: transparent;
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
    will-change: transform;
  }
</style>
