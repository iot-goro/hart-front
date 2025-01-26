// ロード中にする
showLoading();

// ロード中のテキストを設定
setLoadText("読み込み中");

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

let toggle_status = "";
$(document).ready(function () {
    // トグルスイッチをクリックした時の処理
    $('.toggle_switch').on('click', function () {
        console.log('トグルスイッチがクリックされました'); // デバッグログ
        $(this).toggleClass('open');
        $(this).next('.toggle_contents').slideToggle();
    });

    // ドロワー内の選択項目をクリックした時の処理
    $('.toggle_contents p').on('click', async function () {
        const selectedCategory = $(this).text(); // 選択された項目のテキストを取得
        const toggleSwitch = $(this).closest('.toggle_wrap').find('.toggle_switch p');
        toggleSwitch.text(selectedCategory); // トグルスイッチに反映

        // トグルスイッチの状態を更新
        toggle_status = this.id;

        $(this).closest('.toggle_contents').slideUp(); // ドロワーを閉じる
        $(this).closest('.toggle_wrap').find('.toggle_switch').removeClass('open'); // 状態をリセット


        const authData = await GetSession();

        const req = await fetch("/app/userStatus/", {
            method: "POST",
            headers: {
                "Authorization": authData["token"],
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "profile": toggle_status
            })
        });

        const result = await req.json();
        console.log(result);
    });
});

const iot_qr = document.getElementById("iot_qr");
iot_qr.addEventListener("click", () => {
    window.location.href = IotURL;
})

async function Init() {
    try {
        // ステータス取得
        const status = await GetStatus();

        // 話している時
        if (status["TalkStatus"] == "talking") {
            // リダイレクト
            window.location.href = TalkingURL;
            return;
        };

        // 認証情報取得
        const authData = await GetSession();

        const req = await fetch("/app/userStatus/", {
            method: "GET",
            headers: {
                "Authorization": authData["token"],
            }
        });

        const result = await req.json();

        // トグルスイッチの状態を更新
        const toggleSwitch = document.querySelector('.toggle_wrap').querySelector('.toggle_switch p');
        
        try {
            // トグルスイッチの状態を更新
            toggleSwitch.textContent = document.getElementById(result["status"]["Status"]).textContent; // トグルスイッチに反映
        } catch (error) {
            console.error(error);
            // alert("読み取りに失敗しました");
            // ログインに飛ばす
            // window.location.href = LoginURL;
        }

        // ロード中を隠す
        hideLoading();
    } catch (error) {
        console.error(error);
        // alert("読み取りに失敗しました");
        // ログインに飛ばす
        // window.location.href = LoginURL;
    }
}

Init();
