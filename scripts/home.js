document.addEventListener('DOMContentLoaded', () => {
    // スクロールコンテンツのクローン作成
    const scrollContent = document.querySelector('.scroll-content');
    if (scrollContent) {
        const firstSlide = scrollContent.firstElementChild.cloneNode(true);
        scrollContent.appendChild(firstSlide);
    } else {
        console.error('.scroll-content 要素が見つかりません');
    }
});

$(document).ready(function () {
    // トグルスイッチをクリックした時の処理
    $('.toggle_switch').on('click', function () {
        console.log('トグルスイッチがクリックされました'); // デバッグログ
        $(this).toggleClass('open');
        $(this).next('.toggle_contents').slideToggle();
    });

    // ドロワー内の選択項目をクリックした時の処理
    $('.toggle_contents p').on('click', function () {
        const selectedCategory = $(this).text(); // 選択された項目のテキストを取得
        const toggleSwitch = $(this).closest('.toggle_wrap').find('.toggle_switch p');
        toggleSwitch.text(selectedCategory); // トグルスイッチに反映
        $(this).closest('.toggle_contents').slideUp(); // ドロワーを閉じる
        $(this).closest('.toggle_wrap').find('.toggle_switch').removeClass('open'); // 状態をリセット
    });
});
