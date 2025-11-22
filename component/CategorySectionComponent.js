// CategorySectionComponent.js - 支持颜色选择区域左右滑动
Vue.component('category-section-component', {
  template: `
    <div class="category-section">
      <!-- <h2 class="category-title">{{categoryData.category}}</h2> -->
      <div class="product-container">
        <div class="product-inner">
          <div v-for="product in categoryData.plist" :key="product.id" class="product-card">
            <!-- 商品图片区域 -->
            <div class="product-image-wrapper">
              <img :src="getCurrentImage(product)" 
                   class="product-image" 
                   loading="lazy" 
                   :alt="product.title"> 
              
              <!-- 规格切换 - 可左右滑动 -->
              <div class="spec-options-wrapper" v-if="hasMultipleSpecs(product)">
                <div class="spec-options-scroll">
                  <div
                    v-for="spec in getDisplaySpecs(product)"
                    :key="spec.name"
                    class="spec-item"
                    :class="{ 
                      active: spec.type === 'spec' && getSelectedSpec(product) === spec.name
                    }"
                    @click="handleSpecClick(product, spec, $event)"
                  >
                    {{ spec.displayName }}
                  </div>
                </div>
              </div>
              
              <!-- 单规格显示 -->
              <div class="spec-options" v-else-if="getCurrentSpec(product)">
                <div class="spec-item active">
                  {{ getCurrentSpec(product) }}
                </div>
              </div>
            </div>
            
            <!-- 商品标题 - 支持换行 -->
            <div class="product-title">{{ product.title }}</div>
            
            <!-- 价格 -->
            <div class="product-price">{{'$'+ product.price_usa }}</div>

            <!-- 详情页按钮 - 使用纯链接，不添加任何事件监听 -->
            <a :href="'./detail.html?weidian_id=' + product.weidian_id" 
               class="detail-button">
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    categoryData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.injectStyles();
    console.log("this.categoryData", this.categoryData);
    
    this.categoryData.plist.forEach(product => {
      if (!product.selectedSpec && product.cover_image?.spec_name) {
        this.$set(product, 'selectedSpec', product.cover_image.spec_name);
      }
    });

    // iOS 专用修复：手动绑定点击事件
    this.fixIOSClicks();
  },
  methods: {
    // iOS 专用修复方法
    fixIOSClicks() {
      // 等待 DOM 更新完成
      this.$nextTick(() => {
        setTimeout(() => {
          // 为所有详情按钮添加原生事件监听
          const detailButtons = this.$el.querySelectorAll('.detail-button');
          detailButtons.forEach(button => {
            // 移除所有现有的事件监听器
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // 添加原生点击事件
            newButton.addEventListener('click', (e) => {
              console.log('iOS 详情按钮点击');
              e.preventDefault();
              const href = newButton.getAttribute('href');
              console.log('跳转到:', href);
              window.location.href = href;
            });
          });

          // 为规格选项添加原生事件监听
          const specItems = this.$el.querySelectorAll('.spec-item');
          specItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const productElement = newItem.closest('.product-card');
              const productIndex = Array.from(productElement.parentNode.children).indexOf(productElement);
              const product = this.categoryData.plist[productIndex];
              
              console.log('iOS 规格切换');
              const specName = newItem.textContent.trim();
              this.$set(product, 'selectedSpec', specName);
            });
          });

          console.log('iOS 点击修复完成');
        }, 100);
      });
    },

    // 处理规格点击（保留Vue逻辑作为备用）
    handleSpecClick(product, specItem, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      console.log('规格点击:', specItem.type, specItem.name);
      
      if (specItem.type === 'spec') {
        this.$set(product, 'selectedSpec', specItem.name);
        console.log('切换规格:', specItem.name);
      }
    },

    // 检查是否有多个规格（过滤掉空规格）
    hasMultipleSpecs(product) {
      if (!product.images || product.images.length <= 1) return false;
      
      const validSpecImages = product.images.filter(img => 
        img.spec_name && img.spec_name.trim() !== ''
      );
      
      return validSpecImages.length > 1;
    },
    
    // 获取当前规格
    getCurrentSpec(product) {
      return product.cover_image?.spec_name || '';
    },
    
    // 获取显示的规格选项（过滤空规格，现在返回所有有效规格）
    getDisplaySpecs(product) {
      const images = product.images || [];
      
      const validSpecImages = images.filter(img => 
        img.spec_name && img.spec_name.trim() !== ''
      );
      
      if (validSpecImages.length === 0) {
        return [];
      }
      
      // 直接返回所有有效规格，不需要"more"按钮
      return validSpecImages.map(img => ({
        type: 'spec',
        name: img.spec_name,
        displayName: this.formatSpecName(img.spec_name),
        image: img.url
      }));
    },

    // 格式化规格名称显示
    formatSpecName(specName) {
      if (specName.length > 6) {
        return specName.substring(0, 6) + '...';
      }
      return specName;
    },

    // 获取当前显示的图片
    getCurrentImage(product) {
      const selectedSpec = product.selectedSpec;
      const images = product.images || [];
      
      if (selectedSpec && images.length > 0) {
        const selectedImage = images.find(img => img.spec_name === selectedSpec);
        if (selectedImage) return selectedImage.url;
      }
      
      return product.cover_image?.url || './images/default-product.jpg';
    },

    // 获取选中的规格
    getSelectedSpec(product) {
      return product.selectedSpec || (product.cover_image?.spec_name || '');
    },

    injectStyles() {
      const styleId = 'category-section-component-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .category-section {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto 10px;
            text-align: center;
            padding: 0 15px;
          }

          .category-title {
            font-size: 1.2em;
            color: #2d3436;
            margin-bottom: 20px;
            font-weight: 500;
          }

          .product-container {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .product-inner {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
            width: 100%;
            max-width: 1280px;
          }

          .product-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: transform 0.4s cubic-bezier(0.25,0.8,0.25,1);
            display: flex;
            flex-direction: column;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
          }

          .product-image-wrapper {
            position: relative;
            display: inline-block;
            width: 100%;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
          }

          .product-image {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-bottom: 1px solid #f1f1f1;
            display: block;
            -webkit-user-select: none;
            user-select: none;
          }

          /* 新的可滚动规格选项容器 */
          .spec-options-wrapper {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 90%;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            padding: 3px 6px;
            border-radius: 6px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            overflow: hidden;
          }

          /* 可滚动的规格选项 */
          .spec-options-scroll {
            display: flex;
            gap: 4px;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            white-space: nowrap;
            padding-bottom: 2px;
            -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
          }

          /* 隐藏滚动条 */
          .spec-options-scroll::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }

          .spec-item {
            cursor: pointer;
            padding: 1px 4px;
            color: #666;
            font-size: 9px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.1px;
            transition: all 0.2s ease;
            border-radius: 2px;
            border: 1px solid transparent;
            flex-shrink: 0;
            min-width: 20px;
            text-align: center;
            background: transparent;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-user-select: none;
            user-select: none;
          }

          .spec-item.active {
            color: #409eff;
            font-weight: 600;
            background: rgba(64, 158, 255, 0.1);
            border: 1px solid rgba(64, 158, 255, 0.3);
          }

          /* 原有的单规格样式保持不变 */
          .spec-options {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 4px;
            margin: 0;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            padding: 3px 6px;
            border-radius: 6px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            white-space: nowrap;
            max-width: 90%;
            border: 1px solid rgba(255, 255, 255, 0.3);
            -webkit-tap-highlight-color: rgba(0,0,0,0);
          }

          .product-title {
            font-size: 14px;
            font-weight: 600;
            color: #2d3436;
            margin: 8px 0 4px 0;
            line-height: 1.4;
            /* 允许换行 */
            white-space: normal;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            /* 限制最大行数 */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: 40px; /* 为两行文字预留空间 */
            padding: 0 8px;
          }

          .product-price {
            margin: 6px 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #29252C;
            text-align: center;
            padding: 0 8px;
          }

          .detail-button {
            display: block;
            width: 90%;
            margin: 10px auto 6px auto;
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            cursor: pointer;
          }

          /* iOS 专用修复 */
          .detail-button:hover,
          .spec-item:hover {
            transform: none;
          }

          /* 响应式设计 */
          @media (max-width: 1200px) {
            .product-inner {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          @media (max-width: 768px) {
            .product-inner {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .product-title {
              font-size: 13px;
              min-height: 36px;
            }
          }

          @media (max-width: 480px) {
            .category-section {
              padding: 0 10px;
            }
            .product-inner {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .category-title { 
              font-size: 1.5em; 
            }
            .spec-options-wrapper,
            .spec-options {
              padding: 4px 8px;
            }
            .spec-item {
              font-size: 10px;
              padding: 2px 6px;
              min-width: 24px;
            }
            .product-title {
              font-size: 12px;
              min-height: 34px;
              margin: 6px 0 3px 0;
            }
            .product-price {
              font-size: 15px;
            }
            .detail-button {
              font-size: 11px;
              padding: 7px 14px;
            }
          }

          /* 超小屏幕优化 */
          @media (max-width: 360px) {
            .product-inner {
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            
            .spec-options-wrapper,
            .spec-options {
              padding: 3px 6px;
            }
            
            .spec-item {
              font-size: 9px;
              padding: 1px 4px;
              min-width: 22px;
            }
            
            .product-title {
              font-size: 11px;
              min-height: 32px;
            }
            
            .product-price {
              font-size: 14px;
            }
            
            .detail-button {
              font-size: 10px;
              padding: 6px 12px;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
});