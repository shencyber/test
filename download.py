import os
import requests
from urllib.parse import urlparse

def download_images(url_list, save_dir='download/6-119'):
    """
    下载图片并保持原始文件名
    
    参数：
        url_list : list of str
            图片链接列表
        save_dir : str
            保存目录，默认 'images'
    """
    # 创建保存目录（如果不存在）
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    for url in url_list:
        try:
            # 获取图片内容
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # 如果请求失败，会抛出异常
            
            # 获取原始文件名
            path = urlparse(url).path
            filename = os.path.basename(path)
            if not filename:  # 防止空文件名
                filename = 'unknown.jpg'
            
            filepath = os.path.join(save_dir, filename)
            
            # 写入文件
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"下载成功: {filename}")
        
        except Exception as e:
            print(f"下载失败: {url} 错误: {e}")

# 示例使用
if __name__ == "__main__":
    image_urls = [
            "https://si.geilicdn.com/pcitem901979398095-15a000000199d34fdd170a8133cc-unadjust_1235_1489.png",
            "https://si.geilicdn.com/pcitem901979398095-138d00000199d3507a2c0a2303ee-unadjust_1302_1460.png",
            "https://si.geilicdn.com/pcitem901979398095-07a500000199d350b9de0a20e273-unadjust_1269_1550.png",
            "https://si.geilicdn.com/pcitem901979398095-3fa200000199d385e32d0a2103bd_2019_2524.jpg",
            "https://si.geilicdn.com/pcitem901979398095-1ac400000199d385e7380a23037f_2904_3630.jpg",
            "https://si.geilicdn.com/pcitem901979398095-1eb400000199d385ef0a0a20e284_1776_2220.jpg",
            "https://si.geilicdn.com/pcitem901979398095-1e5900000199d385f2980a23038e_1882_2353.jpg",
            "https://si.geilicdn.com/pcitem901979398095-182400000199d385f7190a239846_1919_2399.jpg",
            "https://si.geilicdn.com/pcitem901979398095-144100000199d385fafb0a20e273_1832_2290.jpg",
            "https://si.geilicdn.com/pcitem901979398095-25a500000199d385ff830a2315ef_1200_1200.jpg",
            "https://si.geilicdn.com/pcitem901979398095-1a7400000199d38605f00a8134f0_1200_1200.jpg",
            "https://si.geilicdn.com/pcitem901979398095-123c00000199d351bfd80a20e284_5712_4284.jpg",
            "https://si.geilicdn.com/pcitem901979398095-0e5700000199d351b71a0a23037f_5712_4284.jpg",
            "https://si.geilicdn.com/pcitem901979398095-333d00000199d351ae350a2103bd_5712_4284.jpg",
            "https://si.geilicdn.com/pcitem901979398095-07f100000199d351c7e00a20e273-unadjust_425_165.png"
        ]
    download_images(image_urls)
