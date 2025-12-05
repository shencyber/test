// 从URL获取weidian_id参数
const getWeidianIdFromUrl = () => new URLSearchParams(window.location.search).get('weidian_id');

// 发送跟踪数据（每次都生成新指纹）
const sendTrack = async (data) => {
    try {
        const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v3/esm.min.js');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        window.trackApi.sendTrack({
            ...data,
            visitor_id: result.visitorId
        });
    } catch (error) {
        console.error('跟踪失败:', error);
    }
};







/**
 * 获取网站访问来源
 * @returns {Object} 包含来源URL、来源类型、域名等信息
 */
function getPageReferrer() {
  const referrer = document.referrer;
  let referrerType = 'unknown';
  let referrerDomain = '';

  // 无来源的情况
  if (!referrer) {
    referrerType = 'direct'; // 直接访问（地址栏/书签等）
  } else {
    try {
      // 解析来源URL的域名
      const referrerUrl = new URL(referrer);
      referrerDomain = referrerUrl.hostname;

      // 判断来源类型
      const currentDomain = window.location.hostname;
      if (referrerDomain === currentDomain) {
        referrerType = 'internal'; // 站内跳转
      } else {
        referrerType = 'external'; // 外部链接跳转
      }
    } catch (e) {
      // 解析URL失败（极少数异常情况）
      referrerType = 'invalid';
    }
  }

  return {
    fullReferrer: referrer, // 完整来源URL（空则为直接访问）
    referrerType: referrerType,     // 来源类型：direct/internal/external/invalid/unknown
    referrerDomain: referrerDomain  // 来源域名（无则为空）
  };
}


let referrerData = getPageReferrer()
// console.log("referrerData",Object.assign({} , referrerData , {event_type: 'view', weidian_id: getWeidianIdFromUrl()}))

// 页面浏览跟踪
if(window.location.href=='https://newhappybuy.store/' )
{
  console.log( Object.assign({} , referrerData , {event_type: 'view'}) )
  sendTrack(  Object.assign({} , referrerData , {event_type: 'view'})  );
}
else
  sendTrack(  Object.assign({} , referrerData , {event_type: 'view', weidian_id: getWeidianIdFromUrl()})  );

// 点击事件跟踪
document.addEventListener('click', (e) => {
    if (e.target.id === 'buy-btn' || e.target.closest('#buy-btn')) {
        sendTrack({ event_type: 'click', weidian_id: getWeidianIdFromUrl() });
    }
});