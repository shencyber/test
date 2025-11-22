// NavComponent.js - 导航组件，动态加载分类并使用接口返回的图标
Vue.component('nav-component', {
  template: `
    <div class="nav-wrapper">
      <!-- 桌面端导航（PC端） -->
      <div class="nav-container-desktop">
        <!-- 首页 -->
        <a :class="['nav-link', isActive('./index.html') ? 'nav-link-active' : '']" href="./index.html">
          <i class="fas fa-home nav-icon"></i>
          Home
        </a>
        
        <!-- 分类链接 -->
        <a 
          v-for="category in categories" 
          :key="category.id"
          :class="['nav-link', isActive('./all.html?categoryId=' + category.id) ? 'nav-link-active' : '']" 
          :href="'./all.html?categoryId=' + category.id + '&categoryName=' + encodeURIComponent(category.name)"
        >
          <span class="nav-icon-unicode">{{ category.icon_unicode }}</span>
          {{ category.name }}
        </a>
      </div>

      <!-- 移动端汉堡菜单 -->
      <div class="nav-mobile">
        <button class="hamburger" @click="toggleMenu">
          <span></span><span></span><span></span>
        </button>
        <div class="mobile-menu" :class="{ active: isMenuOpen }">
          <!-- 首页 -->
          <a href="./index.html" class="mobile-link" :class="{ active: isActive('./index.html') }">
            <i class="fas fa-home nav-icon"></i>
            Home
          </a>
          
          <!-- 分类链接 -->
          <a 
            v-for="category in categories" 
            :key="category.id"
            :href="'./all.html?categoryId=' + category.id + '&categoryName=' + encodeURIComponent(category.name)"
            class="mobile-link" 
            :class="{ active: isActive('./all.html?categoryId=' + category.id) }"
          >
            <span class="nav-icon-unicode">{{ category.icon_unicode }}</span>
            {{ category.name }}
          </a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isMenuOpen: false,
      categories: [], // 存储分类数据
      loading: false,
      error: null
    };
  },
  methods: {
    // 加载分类数据
    async loadCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await categoryApi.getCategoryList();
        console.log('导航组件加载分类API响应:', result);
        
        if (result.code === 200) {
          this.categories = result.data || [];
          console.log('导航组件分类加载成功，数量:', this.categories.length);
          console.log('分类数据详情:', this.categories);
        } else {
          this.error = result.msg || '获取分类列表失败';
          console.error('导航组件加载分类失败:', this.error);
        }
      } catch (error) {
        console.error('导航组件加载分类数据失败:', error);
        this.error = '网络请求失败，请检查网络连接';
        // API调用失败时，categories保持为空数组，只显示首页
      } finally {
        this.loading = false;
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      const hamburger = this.$el.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.toggle('active');
      }
    },

    isActive(path) {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      // 提取目标路径的基本文件名（不含查询参数）
      const targetFileName = path.split('/').pop().split('?')[0];
      
      // 提取当前路径的基本文件名
      const currentFileName = currentPath.split('/').pop();
      
      // 特殊处理首页：当在/category路径时，不应该激活首页
      if (path === './index.html') {
        // 只有在根路径或index.html时才激活首页
        return currentPath === '/' || 
               currentPath === '/index.html' || 
               currentFileName === 'index.html';
      }
      
      // 处理all.html页面：检查categoryId参数
      if (path.startsWith('./all.html')) {
        const targetParams = new URLSearchParams(path.split('?')[1] || '');
        const currentParams = new URLSearchParams(currentSearch);
        
        // 如果当前路径是/category，不应该激活all.html链接
        if (currentFileName === 'category') {
          return false;
        }
        
        // 检查路径和参数匹配
        return currentFileName === 'all.html' && 
               currentParams.get('categoryId') === targetParams.get('categoryId');
      }
      
      // 默认情况：简单文件名匹配
      return currentFileName === targetFileName;
    },

    closeMenu() {
      this.isMenuOpen = false;
      const hamburger = this.$el.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.remove('active');
      }
    }
  },
  mounted() {
    // 动态注入样式（确保只注入一次）
    const styleId = 'nav-component-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* 导航系统（通用） */
        .nav-wrapper {
          width: 100%;
          max-width: 1280px;
          position: relative;
        }

        /* PC端导航样式 */
        .nav-container-desktop {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          padding: 10px 0;
          flex-wrap: wrap; /* 允许换行 */
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #2d3436;
          font-weight: 500;
          font-size: 16px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap; /* 防止文字换行 */
        }

        .nav-link-active {
          color: #ff7f00;
          background: rgba(255, 127, 0, 0.1);
        }

        .nav-link:hover {
          color: #ff7f00;
          background: rgba(255, 127, 0, 0.1);
        }

        /* 导航图标样式 */
        .nav-icon {
          font-size: 14px;
          width: 16px;
          text-align: center;
        }

        /* Unicode图标样式 */
        .nav-icon-unicode {
          font-size: 16px;
          width: 20px;
          text-align: center;
          display: inline-block;
        }

        /* 移动端汉堡菜单容器 */
        .nav-mobile {
          display: none;
          position: relative;
          padding: 4px 0;
          text-align: right;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
          margin-left: auto;
        }

        .hamburger span {
          width: 26px;
          height: 2px;
          background: #2d3436;
          margin: 3px auto;
          transition: all 0.3s ease;
          border-radius: 1px;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* 弹出菜单 */
        .mobile-menu {
          position: absolute;
          top: 44px;
          right: 0;
          background: #fff;
          min-width: 200px;
          max-height: 400px;
          overflow-y: auto;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .mobile-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          color: #2d3436;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .mobile-link:hover {
          background: #f1f1f1;
        }

        .mobile-link.active {
          color: #ff7f00;
          font-weight: 600;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .nav-container-desktop { 
            display: none !important; 
          }
          .nav-mobile { 
            display: block; 
          }
        }

        /* 小屏幕PC端适配 */
        @media (max-width: 1024px) and (min-width: 769px) {
          .nav-container-desktop {
            gap: 20px;
          }
          .nav-link {
            font-size: 14px;
            padding: 6px 12px;
          }
          .nav-icon {
            font-size: 12px;
            width: 14px;
          }
          .nav-icon-unicode {
            font-size: 14px;
            width: 18px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // 加载分类数据
    this.loadCategories();

    // 监听点击关闭菜单（全局点击外部关闭）
    document.addEventListener('click', (e) => {
      const hamburger = this.$el.querySelector('.hamburger');
      const mobileMenu = this.$el.querySelector('.mobile-menu');
      if (!hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // 移动链接点击关闭菜单
    this.$el.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }
});