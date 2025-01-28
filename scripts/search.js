let sample_json = {
    "user": []
}

async function Init() {
    try {
        showLoading();
        setLoadText("読み込み中");

        // 会話の履歴取得
        const talks = await GetTalkHistory();

        const users = [];

        for (let i = 0; i < talks.length; i++) {
            const talk = talks[i];
            const uinfo = await GetUserInfo(talk["TalkToID"]);

            let topic = "";
            // tags を回す
            for (let j = 0; j < talk["Tags"].length; j++) {
                const tag = talk["Tags"][j];
                topic += tag + " ";
            }

            let relationText = "";

            try {
                // リレーション取得
                const relation = await GetRelation(talk["TalkToID"]);

                relationText = relation["relation"]["relationDescription"];
            } catch (error) {
                console.error(error);
            }

            // ユーザー情報を格納した新しいサンプルJSONデータ
            const add_data = {
                "id": talk["TalkToID"],
                "name": uinfo["UserName"],
                "icon": GetIcon(talk["TalkToID"]),
                "relation": [relationText],
                "topic": topic
            };

            users.push(add_data);
        }

        sample_json = {
            "user": users
        };

        displayRecentContacts(); // 最近話した人を表示
        generateRelationCheckboxes(); // チェックボックスを生成

        // ロード中の画面を非表示
        hideLoading();
    } catch (error) {
        console.error(error);
        // alert("読み取りに失敗しました");

        // ログインに飛ばす
        // window.location.href = LoginURL;
    }
}

window.onload = async () => {
    await Init();
}

async function GetTalkHistory() {
    const authData = await GetSession();

    const req = await fetch("/app/talks", {
        method: "GET",
        headers: {
            "Authorization": authData["token"],
        }
    });

    const res = await req.json();
    return res["talks"];
}

// ユーザー情報を格納した新しいサンプルJSONデータ
// const sample_json = {
//     "user": [
//         {
//             "id": "6505b6fb-9522-41c5-8821-479dc02988ff",
//             "name": "あっちゃん",
//             "icon": "../images/icon.png",
//             "relation": [
//                 "中学校",
//                 "友達"
//             ],
//             "topic": "チャオチュール"
//         },
//         {
//             "id": "eb3b88b3-083b-49e5-9d5d-a45dd0d726ca",
//             "name": "いっちゃん",
//             "icon": "../images/icon.png",
//             "relation": [
//                 "高校",
//                 "友達"
//             ],
//             "topic": "チャオチュール"
//         },
//         {
//             "id": "2cf804ac-b782-4025-8647-eeff4d5e374e",
//             "name": "うっちゃん",
//             "icon": "../images/icon.png",
//             "relation": [
//                 "高校",
//                 "友達"
//             ],
//             "topic": "チャオチュール"
//         },
//         {
//             "id": "93b1fd25-71ab-4b1b-8b53-402eca7e4207",
//             "name": "えっちゃん",
//             "icon": "../images/icon.png",
//             "relation": [
//                 "大学",
//                 "友達"
//             ],
//             "topic": "チャオチュール"
//         },
//         {
//             "id": "a9b1fd25-71ab-4b1b-8b53-402eca7e4207",
//             "name": "おっちゃん",
//             "icon": "../images/icon.png",
//             "relation": [
//                 "大学",
//                 "友達"
//             ],
//             "topic": "チャオチュール"
//         }
//     ]
// };

// モーダルを表示する関数
function displayRelations() {
    const modal = document.getElementById("relationModal");
    modal.style.display = "flex"; // モーダルを表示
}

// モーダルを閉じる関数
function closeModal() {
    const modal = document.getElementById("relationModal");
    modal.style.display = "none"; // モーダルを非表示
}

// 名前検索を行う関数
function searchUser() {
    // ローカルストレージをクリア
    localStorage.clear(); // すべてのローカルストレージをクリア
    displaySelectedRelations(); // 表示を更新

    const searchInput = document.getElementById("searchInput").value.trim();
    const recentDiv = document.getElementById("recentContacts");
    recentDiv.innerHTML = ""; // 最近話した人のリストをクリア

    // 名前でユーザー情報をフィルタリング
    const results = sample_json.user.filter(user => user.name.includes(searchInput));

    // 検索結果を表示
    if (results.length > 0) {
        results.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "recent_list"; // CSSクラスを追加

            const nameWrap = document.createElement("div");
            nameWrap.className = "name_wrap";

            const nameElement = document.createElement("p");
            nameElement.className = "name";
            nameElement.textContent = user.name; // textContentを使用してXSS対策

            const iconElement = document.createElement("img");
            iconElement.src = user.icon;
            iconElement.alt = "アイコン";
            iconElement.className = "icon";

            nameWrap.appendChild(nameElement);
            nameWrap.appendChild(iconElement);

            const themeWrap = document.createElement("div");
            themeWrap.className = "theme_wrap";

            const relationElement = document.createElement("div");
            relationElement.className = "theme";
            const relationText = document.createElement("p");
            relationText.textContent = "関係：";
            relationElement.appendChild(relationText);

            user.relation.forEach(rel => {
                const relElement = document.createElement("p");
                relElement.textContent = rel; // textContentを使用してXSS対策
                relationElement.appendChild(relElement);
            });

            const topicElement = document.createElement("p");
            topicElement.className = "theme";
            topicElement.textContent = user.topic; // textContentを使用してXSS対策

            themeWrap.appendChild(relationElement);
            themeWrap.appendChild(topicElement);

            userDiv.appendChild(nameWrap);
            userDiv.appendChild(themeWrap);

            recentDiv.appendChild(userDiv); // 最近話した人リストに追加
        });
    } else {
        recentDiv.innerHTML = "<p>該当するユーザーが見つかりませんでした。</p>";
    }
}

// チェックボックスで選択した関係で検索する関数
function submitRelations() {
    // ローカルストレージをクリア
    localStorage.removeItem('selectedRelations');

    const checkedRelations = Array.from(document.querySelectorAll('input[name="relation"]:checked')).map(checkbox => checkbox.value);
    const recentDiv = document.getElementById("recentContacts");
    recentDiv.innerHTML = ""; // 最近話した人のリストをクリア

    // 選択された関係に基づいてユーザー情報をフィルタリング
    const results = sample_json.user.filter(user =>
        user.relation.some(rel => checkedRelations.includes(rel))
    );

    // 検索結果を表示
    if (results.length > 0) {
        results.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "recent_list"; // CSSクラスを追加

            const nameWrap = document.createElement("div");
            nameWrap.className = "name_wrap";

            const nameElement = document.createElement("p");
            nameElement.className = "name";
            nameElement.textContent = user.name; // XSS対策

            const iconElement = document.createElement("img");
            iconElement.src = user.icon;
            iconElement.alt = "アイコン";
            iconElement.className = "icon";

            nameWrap.appendChild(nameElement);
            nameWrap.appendChild(iconElement);

            const themeWrap = document.createElement("div");
            themeWrap.className = "theme_wrap";

            const relationElement = document.createElement("div");
            relationElement.className = "theme";

            const relationText = document.createElement("p");
            relationText.textContent = "関係："; // XSS対策
            relationElement.appendChild(relationText);

            // relationを表示
            user.relation.forEach(rel => {
                const relElement = document.createElement("p");
                relElement.textContent = rel; // XSS対策
                relationElement.appendChild(relElement);
            });

            const topicElement = document.createElement("p");
            topicElement.className = "theme";
            topicElement.textContent = user.topic; // XSS対策

            themeWrap.appendChild(relationElement);
            themeWrap.appendChild(topicElement);

            userDiv.appendChild(nameWrap);
            userDiv.appendChild(themeWrap);

            recentDiv.appendChild(userDiv); // 最近話した人リストに追加
        });

        // ローカルストレージに保存
        localStorage.setItem('selectedRelations', JSON.stringify(checkedRelations));
    } else {
        recentDiv.innerHTML = "";
    }

    // search_resultに表示
    displaySelectedRelations();
    closeModal(); // モーダルを閉じる
}


// 最近話した人を表示する機能
function displayRecentContacts() {
    const recentDiv = document.getElementById("recentContacts");
    console.log(sample_json.user);
    sample_json.user.forEach(user => {
        const recentDivItem = document.createElement("div");
        recentDivItem.className = "recent_list"; // CSSクラスを追加

        const nameWrap = document.createElement("div");
        nameWrap.className = "name_wrap";

        const nameElement = document.createElement("p");
        nameElement.className = "name";
        nameElement.textContent = user.name; // XSS対策

        const iconElement = document.createElement("img");
        iconElement.src = user.icon;
        iconElement.alt = "アイコン";
        iconElement.className = "icon";

        nameWrap.appendChild(nameElement);
        nameWrap.appendChild(iconElement);

        const themeWrap = document.createElement("div");
        themeWrap.className = "theme_wrap";

        const relationElement = document.createElement("div");
        relationElement.className = "theme";

        const relationText = document.createElement("p");
        relationText.textContent = "関係："; // XSS対策
        relationElement.appendChild(relationText);

        // relationを表示
        user.relation.forEach(rel => {
            const relElement = document.createElement("p");
            relElement.textContent = rel; // XSS対策
            relationElement.appendChild(relElement);
        });

        const topicElement = document.createElement("p");
        topicElement.className = "theme";
        topicElement.textContent = user.topic; // XSS対策

        themeWrap.appendChild(relationElement);
        themeWrap.appendChild(topicElement);

        recentDivItem.appendChild(nameWrap);
        recentDivItem.appendChild(themeWrap);

        recentDiv.appendChild(recentDivItem); // 最近話した人リストに追加

        recentDivItem.addEventListener("click", () => {
            console.log("クリックされました");
            console.log(user.id);
            window.location.href = `./detail.html?uid=${user.id}`;
        })
    });
}

// ユーザー情報から関係の種類を抽出してチェックボックスを生成する関数
function generateRelationCheckboxes() {
    const relationSet = new Set(); // 重複を除くためのセット
    sample_json.user.forEach(user => {
        user.relation.forEach(rel => {
            relationSet.add(rel); // セットに追加して重複を排除
        });
    });

    const relationForm = document.getElementById("relationForm");
    relationForm.innerHTML = ""; // 既存のチェックボックスをクリア（検索ボタンは残すために別処理）

    relationSet.forEach(rel => {
        const label = document.createElement("label");

        // チェックボックスを作成
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "relation";
        checkbox.value = rel; // XSS対策として、textContentを使って表示しない

        // チェックボックスのラベル部分を作成
        const labelText = document.createTextNode(rel); // XSS対策

        // ラベルにチェックボックスとテキストを追加
        label.appendChild(checkbox);
        label.appendChild(labelText);

        // フォームにラベルを追加
        relationForm.appendChild(label);
        relationForm.appendChild(document.createElement("br")); // 改行を追加

    });

    // 検索ボタンを再追加
    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.innerText = "検索";
    searchButton.onclick = submitRelations; // 検索ボタンに関数を関連付け
    relationForm.appendChild(searchButton);
}

// ローカルストレージから選択した関係を取得して表示する関数
function displaySelectedRelations() {
    const searchResultDiv = document.getElementById('search_result');
    const selectedRelations = JSON.parse(localStorage.getItem('selectedRelations')) || [];

    // 結果をクリア
    searchResultDiv.innerHTML = '';

    if (selectedRelations.length > 0) {
        const ul = document.createElement('ul');
        selectedRelations.forEach(relation => {
            const li = document.createElement('li');
            li.textContent = relation; // リストアイテムに関係名を設定
            ul.appendChild(li); // ULにLIを追加
        });
        searchResultDiv.appendChild(ul); // search_resultにULを追加
    } else {
        searchResultDiv.innerHTML = '';
    }
}
