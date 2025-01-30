// 話題をランダムなタイミングに流す
document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".scroll-item");
  
    items.forEach((item) => {
      const delay = Math.random() * 5; // 0秒〜5秒のランダム遅延
      const duration = Math.random() * 5 + 10; // 10秒〜15秒のランダム速度
      item.style.animation = `scroll ${duration}s linear infinite`;
      item.style.animationDelay = `${delay}s`;
    });
  });
  
  
  