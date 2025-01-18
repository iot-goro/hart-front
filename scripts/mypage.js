const icon = document.getElementById("icon");
const name = document.getElementById("name");

async function Init() {
    try {
        // 認証情報取得
        const authData = await GetSession();

        icon.src = GetIcon(authData["record"]["id"]);
        name.textContent = authData["record"]["name"];
    } catch (ex) {
        console.error(ex);
    }
}

// 初期化
Init();