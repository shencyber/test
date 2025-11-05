// NavComponent.js - 导航组件，包含内联样式（PC端样式保持原样：简单flex居中布局）
Vue.component('social-component', {
  template: `
    <div class="social-icons">
      <a href="https://t.me/+zQFcv5JPY-wxZTE1" class="social-icon telegram-icon" target="_blank" title="Join Telegram">
        <i class="fab fa-telegram-plane"></i>
      </a>
      <a href="https://wa.me/8617706270893" class="social-icon whatsapp-icon" target="_blank" title="Join WhatsApp">
        <i class="fab fa-whatsapp"></i>
      </a>
      <a href="https://www.tiktok.com/@qqww3968" class="social-icon tiktok-icon" target="_blank" title="Follow TikTok">
        <i class="fab fa-tiktok"></i>
      </a>
    </div>
  `,
  
  
  mounted() {
    // 动态注入样式（确保只注入一次）
    const styleId = 'social-component-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .social-icons {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  }

  .social-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }

  .telegram-icon { background-color: #0088cc; }
  .whatsapp-icon { background-color: #25D366; }
  .tiktok-icon { background-color: #000; }

  .social-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }


  @media (max-width: 480px) {
    .social-icon { width: 40px; height: 40px; font-size: 20px; }
    .social-icons { bottom: 15px; right: 15px; gap: 8px; }
  }

      `;
      document.head.appendChild(style);
    }

    
  }
});