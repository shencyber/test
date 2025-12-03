// api.js - 前端API接口封装（ES6模块）- 仅分类相关

// 配置基础URL
// const BASE_URL = 'https://api.newhappybuy.store/index.php/front/'; // 根据你的实际后端地址修改
const BASE_URL = 'http://47.94.236.74:8000/index.php/front/'; // 根据你的实际后端地址修改

// 统一的请求函数
async function request(url, data = {}) {
    try {
        const fullUrl = `${BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API请求失败:', error);
        return {
            code: 500,
            msg: '网络请求失败',
            data: null
        };
    }
}

// 分类相关API
const categoryApi = {
    // 获取前台分类列表
    getCategoryList: async () => {
        return await request('category_list');
    },
    
    // 获取分类详情
    getCategoryInfo: async (id) => {
        return await request('category_info', { id });
    },
    
    // 获取分类下的品牌
    getCategoryBrands: async (categoryId,limit) => {
        return await request('category_brands', { 
            category_id: categoryId ,
            limit: limit 
        });
    },
    
    // 获取所有分类及品牌
    getAllCategoriesWithBrands: async () => {
        return await request('category_all_with_brands');
    }
};





// 产品相关API
const productApi = {
    // 获取前台分类列表
    getProductList: async (data ) => {
        return await request('product_list' , data);
    },
    
    // 获取分类详情
    getProductInfo: async (data) => {
        return await request('product_info', data);
    }
};




// 行为相关API
const trackApi = {
    // 获取前台分类列表
    sendTrack: async (data ) => {
        return await request('track' , data);
    }
};

// 设置为全局变量
window.categoryApi = categoryApi;
window.productApi = productApi;
window.trackApi = trackApi;