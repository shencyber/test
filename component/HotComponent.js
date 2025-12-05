Vue.component('hot-component', {
  template: `
    <div class="hot-component-wrapper featured-card">
      <div class="featured-label">Best</div>

      <div class="featured-image-wrapper">
        <img :src="currentImage" class="featured-image" alt="Supreme SpongeBob x Jeff Hamilton SS Week 11 Collaboration  Best-Quality Jacket">
      </div>

      <div class="color-selector">
        <div class="hot-spec-options-scroll">
          <div
            v-for="color in colors"
            :key="color.name"
            class="hot-spec-item"
            :class="{ active: selectedColor === color.name }"
            @click="selectColor(color)"
            

          >
            {{ color.name }}
          </div>
        </div>
      </div>

      <div class="featured-info">
        <div class="featured-title">Supreme SpongeBob x Jeff Hamilton SS Week 11 Collaboration  Best-Quality Jacket</div>
        <div class="featured-price">$105.8</div>
        <a href="./detail.html?weidian_id=7615692677" class="featured-button">View Details</a>
      </div>
    </div>
  `,
  data() {
    return {
      colors: [
        { name: 'White', url: 'https://si.geilicdn.com/pcitem901979398095-48600000019ab9c2990f0a8133cc_1263_1028.jpg.webp?w=640&h=640' },
        { name: 'Black', url: 'https://si.geilicdn.com/pcitem901979398095-48930000019ab9c297710a23041a_1215_1000.jpg.webp?w=640&h=640' }
      ],
      selectedColor: 'White'
    };
  },
  computed: {
    currentImage() {
      const colorObj = this.colors.find(c => c.name === this.selectedColor);
      return colorObj ? colorObj.url : this.colors[0].url;
    }
  },
  methods: {
    selectColor(color) {
      this.selectedColor = color.name;
    },
    injectStyles() {
      if (document.getElementById('hot-component-styles')) return;
      const style = document.createElement('style');
      style.id = 'hot-component-styles';
      style.textContent = `
        .hot-component-wrapper.featured-card {
          position: relative;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          width: 90%;
          max-width: 360px;
          margin: 0 auto 20px auto;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .hot-component-wrapper .featured-label {
          position: absolute;
          top: 8px;
          left: 8px;
          background: linear-gradient(135deg, #F7D34B 0%, #F1C40F 100%);
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 14px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.25);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          z-index: 2;
        }

        .hot-component-wrapper .featured-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 85%;
          overflow: hidden;
        }
        .hot-component-wrapper .featured-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* 颜色选择器 */
        .hot-component-wrapper .color-selector {
          padding: 6px 12px;
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .hot-component-wrapper .hot-spec-options-scroll {
          display: flex;
          gap: 4px;
        }
        .hot-component-wrapper .hot-spec-item {
          cursor: pointer;
          padding: 2px 6px;
          font-size: 10px;
          color: #666;
          font-weight: 400;
          text-transform: uppercase;
          text-align: center;
          border-radius: 2px; /* 小圆角 */
          border: 1px solid transparent;
          background: transparent;
          flex-shrink: 0;
          min-width: 24px;
          transition: all 0.2s ease;
          user-select: none;
        }
        .hot-component-wrapper .hot-spec-item.active {
          color: #409eff;
          font-weight: 600;
          background: rgba(64,158,255,0.1);
          border: 1px solid rgba(64,158,255,0.3);
        }

        .hot-component-wrapper .featured-info {
          padding: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hot-component-wrapper .featured-title {
          font-size: 15px;
          font-weight: 600;
          color: #1c1c1c;
        }
        .hot-component-wrapper .featured-price {
          font-size: 17px;
          font-weight: 700;
          color: #333;
        }
        .hot-component-wrapper .featured-button {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(135deg, #F7D34B 0%, #F1C40F 100%);
          color: #fff;
          font-weight: 600;
          font-size: 13px;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(247,211,75,0.35);
          transition: all 0.3s ease;
        }
        .hot-component-wrapper .featured-button:hover {
          background: linear-gradient(135deg, #FBE45D 0%, #F6D515 100%);
          box-shadow: 0 6px 14px rgba(247,211,75,0.5);
          transform: translateY(-2px);
        }
      `;
      document.head.appendChild(style);
    }
  },
  mounted() {
    this.injectStyles();
  }
});
