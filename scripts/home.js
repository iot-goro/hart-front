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

// $(document).ready(function () {
//     // トグルスイッチをクリックした時の処理
//     $('.toggle_switch').on('click', function () {
//         console.log('トグルスイッチがクリックされました'); // デバッグログ
//         $(this).toggleClass('open');
//         $(this).next('.toggle_contents').slideToggle();
//     });

//     // ドロワー内の選択項目をクリックした時の処理
//     $('.toggle_contents p').on('click', function () {
//         const selectedCategory = $(this).text(); // 選択された項目のテキストを取得
//         const toggleSwitch = $(this).closest('.toggle_wrap').find('.toggle_switch p');
//         toggleSwitch.text(selectedCategory); // トグルスイッチに反映
//         $(this).closest('.toggle_contents').slideUp(); // ドロワーを閉じる
//         $(this).closest('.toggle_wrap').find('.toggle_switch').removeClass('open'); // 状態をリセット
//     });
// });

document.querySelectorAll('.toggle_switch').forEach((toggle) => {
    toggle.addEventListener('click', function () {
        console.log('トグルスイッチがクリックされました');
        this.classList.toggle('open');
        const contents = this.nextElementSibling;
        if (contents) {
            contents.style.display = contents.style.display === 'block' ? 'none' : 'block';
        }
    });
});

document.querySelectorAll('.toggle_contents p').forEach((item) => {
    item.addEventListener('click', function () {
        const selectedCategory = this.textContent;
        const toggleSwitch = this.closest('.toggle_wrap').querySelector('.toggle_switch p');
        if (toggleSwitch) {
            toggleSwitch.textContent = selectedCategory;
        }
        const contents = this.closest('.toggle_contents');
        if (contents) {
            contents.style.display = 'none';
        }
        this.closest('.toggle_wrap').querySelector('.toggle_switch').classList.remove('open');
    });
});

const select_state = document.getElementById("select_state");
select_state.addEventListener("change",async () => {
    // トグルスイッチの状態を更新
    const authData = await GetSession();

    const req = await fetch("/app/userStatus/", {
        method: "POST",
        headers: {
            "Authorization": authData["token"],
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "profile": select_state.value
        })
    });

    const result = await req.json();
    console.log(result);
})

async function Init() {
    try {
        const authData = await GetSession();

        try {
            // ステータス取得
            const status = await GetStatus();

            // 話している時
            if (status["TalkStatus"] == "talking") {
                // リダイレクト
                window.location.href = TalkingURL;
                return;
            };
        } catch (ex) {
            console.error(ex);
        }


        try {
            const req = await fetch("/app/userStatus/", {
                method: "GET",
                headers: {
                    "Authorization": authData["token"],
                }
            });

            const result = await req.json();
            select_state.value = result["status"]["Status"] ? result["status"]["Status"] : "want_talk";

            // トグルスイッチの状態を更新
            // const toggleSwitch = document.querySelector('.toggle_wrap').querySelector('.toggle_switch p');
        
            // トグルスイッチの状態を更新
            // toggleSwitch.textContent = document.getElementById(result["status"]["Status"]).textContent; // トグルスイッチに反映
        } catch (error) {
            console.error(error);
        }

        // ロード中を隠す
        hideLoading();
    } catch (error) {
        console.error(error);
        // alert("読み取りに失敗しました");
        // ログインに飛ばす
        window.location.href = LoginURL;
    }
}

Init();
