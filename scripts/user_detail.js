// 名前をクリックした時に、名前と関係をダイアログで表示する
// 名前のID
const name = document.getElementById("name");
// ダイアログのID
const dialog = document.querySelector("dialog");

// 閉じるボタン
const closeButton = document.getElementById("close");

// 名前をクリックした時の処理
name.addEventListener("click", () => {
    // ダイアログを表示
    dialog.showModal();
});

// 閉じるボタン
closeButton.addEventListener("click", () => {
    // ダイアログを閉じる
    dialog.close();
});