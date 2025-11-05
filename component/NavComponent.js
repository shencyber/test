// NavComponent.js - 导航组件，包含内联样式（PC端样式保持原样：简单flex居中布局）
Vue.component('nav-component', {
  template: `
    <div class="nav-wrapper">
      <!-- 桌面端导航（PC端） -->
      <div class="nav-container-desktop">
        <a :class="['nav-link', isActive('./index.html') ? 'nav-link-active' : '']" href="./index.html">Home</a>
        <a :class="['nav-link', isActive('./all.html?categoryId=1') ? 'nav-link-active' : '']" href="./all.html?categoryId=1">Coats</a>
        <a :class="['nav-link', isActive('./all.html?categoryId=2') ? 'nav-link-active' : '']" href="./all.html?categoryId=2">Hoodies</a>
        <a :class="['nav-link', isActive('./all.html?categoryId=3') ? 'nav-link-active' : '']" href="./all.html?categoryId=3">T-shirts</a>
      </div>

      <!-- 移动端汉堡菜单 -->
      <div class="nav-mobile">
        <button class="hamburger" @click="toggleMenu">
          <span></span><span></span><span></span>
        </button>
        <div class="mobile-menu" :class="{ active: isMenuOpen }">
          <a href="./index.html" class="mobile-link" :class="{ active: isActive('./index.html') }">Home</a>
          <a href="./all.html?categoryId=1" class="mobile-link" :class="{ active: isActive('./all.html?categoryId=1') }">Coats</a>
          <a href="./all.html?categoryId=2" class="mobile-link" :class="{ active: isActive('./all.html?categoryId=2') }">Hoodies</a>
          <a href="./all.html?categoryId=3" class="mobile-link" :class="{ active: isActive('./all.html?categoryId=3') }">T-shirts</a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      // 更新汉堡按钮的active类（用于动画）
      const hamburger = this.$el.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.toggle('active');
      }
    },
    isActive(path) {
      const currentPath = window.location.pathname.split('/').pop();
      const currentSearch = window.location.search;
      const targetPath = path.split('/').pop().split('?')[0];
      console.log("path" , path)
      // 对于Home，特殊处理（无查询参数）
      // 对于Home，特殊处理（无查询参数），支持根路径 '/' 或 'index.html'
      if (path === './index.html') {
        return (currentPath === 'index.html' || currentPath === '' || currentPath === '/') && !currentSearch;
      }
      // 检查路径匹配和查询参数包含
      const searchPart = currentSearch.replace('?', '');
      return currentPath === targetPath && path.includes(searchPart);
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

        /* PC端导航样式（保持不变：简单flex居中布局，无额外hover效果，除非原CSS指定） */
        .nav-container-desktop {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px; /* 原样：链接间距 */
          padding: 10px 0; /* 原样：上下内边距 */
        }

        .nav-link {
          text-decoration: none;
          color: #2d3436; /* 原样：默认颜色 */
          font-weight: 500;
          font-size: 16px;
          padding: 8px 16px; /* 原样：内边距 */
          border-radius: 6px; /* 原样：圆角 */
          transition: all 0.3s ease; /* 原样：过渡 */
          position: relative;
        }

        .nav-link-active {
          color: #ff7f00; /* 原样：激活颜色 */
          background: rgba(255, 127, 0, 0.1); /* 原样：激活背景 */
        }

        .nav-link:hover {
          color: #ff7f00; /* 原样：悬停颜色 */
          background: rgba(255, 127, 0, 0.1); /* 原样：悬停背景 */
        }

        /* 移动端汉堡菜单容器（使用提供的旧样式） */
        .nav-mobile {
          display: none;
          position: relative;
          padding: 4px 0; /* 减少padding以紧凑 */
          text-align: right; /* 确保汉堡菜单靠右对齐 */
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
          margin-left: auto; /* 确保汉堡图标靠右对齐 */
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

        /* 弹出菜单：紧贴汉堡图标下方 */
        .mobile-menu {
          position: absolute;
          top: 44px; /* 减少间隙：40px 按钮 + 4px 间距 */
          right: 0; /* 关键：right: 0，紧贴父容器右边缘 */
          background: #fff;
          min-width: 180px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          padding: 8px 0; /* 减少padding以紧凑 */
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
          display: block;
          padding: 10px 20px; /* 减少padding以紧凑 */
          color: #2d3436;
          text-decoration: none;
          font-size: 14px; /* 减少字体大小 */
          font-weight: 500;
          transition: background 0.2s;
        }

        .mobile-link:hover {
          background: #f1f1f1;
        }

        .mobile-link.active {
          color: #ff7f00;
          font-weight: 600;
        }

        /* 响应式：切换显示（PC端默认显示，移动端隐藏PC） */
        @media (max-width: 480px) {
          .nav-container-desktop { 
            display: none !important; 
          }
          .nav-mobile { 
            display: block; 
          }
        }
      `;
      document.head.appendChild(style);
    }

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