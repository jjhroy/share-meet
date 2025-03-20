<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- 主内容区域 -->
    <div class="h-full mx-auto w-[95%] md:w-600px">
      <VirtualList
        :data="moments"
        :item-height="180"
        :buffer-size="5"
      >
        <template #default="{ item }">
          <div class="bg-white rounded-lg mb-4 p-4 shadow-sm">
            <!-- 用户信息 -->
            <div class="flex items-start">
              <img
                :src="item.avatar"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="ml-3 flex-1">
                <div class="text-[#576b95] font-bold">{{ item.username }}</div>
                <div class="text-gray-800 mt-2 text-sm leading-normal">{{ item.content }}</div>

                <!-- 图片区域 -->
                <div
                  v-if="item.images && item.images.length"
                  class="mt-3 grid grid-cols-3 gap-2"
                >
                  <div
                    v-for="(img, imgIndex) in item.images"
                    :key="imgIndex"
                    class="cursor-pointer relative"
                    @click="openPreview(item.images, imgIndex)"
                  >
                    <img
                      :src="img"
                      class="w-full h-24 object-cover rounded-md"
                    />
                  </div>
                </div>

                <!-- 时间和操作区域 -->
                <div class="mt-3 flex items-center justify-between text-gray-400 text-xs">
                  <span>{{ item.time }}</span>
                  <div class="flex items-center space-x-4">
                    <button class="flex items-center">
                      <Icon
                        name="mdi:thumb-up-outline"
                        class="mr-1 w-4 h-4"
                      />
                      <span>{{ item.likes }}</span>
                    </button>
                    <button class="flex items-center">
                      <Icon
                        name="mdi:chat-outline"
                        class="mr-1 w-4 h-4"
                      />
                      <span>{{ item.comments }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>

    <!-- 图片预览弹窗 -->
    <div
      v-if="previewVisible"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click="closePreview"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <img
          :src="currentImages[currentImageIndex]"
          class="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <!-- 上一张/下一张按钮 -->
        <button
          v-if="currentImages.length > 1 && currentImageIndex > 0"
          class="absolute left-4 text-white p-2 text-2xl"
          @click.stop="prevImage"
        >
          <Icon
            name="mdi:chevron-left"
            class="w-8 h-8"
          />
        </button>
        <button
          v-if="currentImages.length > 1 && currentImageIndex < currentImages.length - 1"
          class="absolute right-4 text-white p-2 text-2xl"
          @click.stop="nextImage"
        >
          <Icon
            name="mdi:chevron-right"
            class="w-8 h-8"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // 生成更多的测试数据
  const generateMoments = (count: number) => {
    const baseData = [
      {
        username: '张三',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        content: '今天天气真不错，和朋友去爬山了！🏃‍♂️',
        images: [
          'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=500&h=500&fit=crop',
        ],
        time: '1小时前',
        likes: 12,
        comments: 6,
      },
      {
        username: '李四',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        content: '分享一个美食推荐，这家店的点心真的很赞！推荐大家去尝尝 🍜',
        images: [
          'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&h=500&fit=crop',
        ],
        time: '2小时前',
        likes: 18,
        comments: 8,
      },
    ];

    return Array.from({ length: count }, (_, index) => ({
      ...baseData[index % 2],
      id: index, // 添加唯一id用于虚拟列表的key
      time: `${Math.floor(Math.random() * 24)}小时前`,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
    }));
  };

  const moments = ref(generateMoments(100));

  // 图片预览相关状态
  const previewVisible = ref(false);
  const currentImages = ref<string[]>([]);
  const currentImageIndex = ref(0);

  // 打开预览
  const openPreview = (images: string[], index: number) => {
    currentImages.value = images;
    currentImageIndex.value = index;
    previewVisible.value = true;
  };

  // 关闭预览
  const closePreview = () => {
    previewVisible.value = false;
  };

  // 上一张图片
  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };

  // 下一张图片
  const nextImage = () => {
    if (currentImageIndex.value < currentImages.value.length - 1) {
      currentImageIndex.value++;
    }
  };
</script>
