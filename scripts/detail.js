// 話題の中身
const talk_wrap = document.getElementById("talk_wrap");

// 過去の話した内容を表示する
document.addEventListener("DOMContentLoaded", () => {

    // 配列からサンプルデータを全件取得
    const dataItem = [
        {
            id: 0,
            date: "2022年12月21日",
            time: "20:00",
            talk_time: "30分",
            theme: "ねこ",
            memo: "ねこを見た",
        },
        {
            id: 1,
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
        {
            id: 2,
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
        {
            id: "aa",
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
    ];

    dataItem.forEach(item => {
        // talk_listの要素を作成
        const talk_list = document.createElement("div");
        talk_list.classList.add("talk_list");

        // time_wrapの要素を作成
        const time_wrap = document.createElement("div");
        time_wrap.classList.add("time_wrap");

        // 日付と時間を表示
        const date = document.createElement("p");
        date.classList.add("date");
        date.textContent = item.date;

        const time = document.createElement("p");
        time.classList.add("time");
        time.textContent = item.time;

        const talk_time = document.createElement("p");
        talk_time.classList.add("talk_time");
        talk_time.textContent = item.talk_time;

        // time_wrapに日付と時間を追加
        time_wrap.appendChild(date);
        time_wrap.appendChild(time);
        time_wrap.appendChild(talk_time);

        // memo_wrapの要素を作成
        const memo_wrap = document.createElement("div");
        memo_wrap.classList.add("memo_wrap");

        // 話題を表示
        const theme_wrap = document.createElement("div");
        theme_wrap.classList.add("theme_wrap");

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = "話題：";

        const theme_text = document.createElement("div");
        theme_text.classList.add("theme_text");

        const theme = document.createElement("p");
        theme.classList.add("theme");
        theme.textContent = item.theme;

        theme_text.appendChild(theme);
        theme_wrap.appendChild(title);
        theme_wrap.appendChild(theme_text);

        // メモを表示
        const memo = document.createElement("p");
        memo.classList.add("memo");
        memo.textContent = item.memo;

        memo_wrap.appendChild(theme_wrap);
        memo_wrap.appendChild(memo);

        // talk_listに要素を追加
        talk_list.appendChild(time_wrap);
        talk_list.appendChild(memo_wrap);

        // talk_wrapにtalk_listを追加
        talk_wrap.appendChild(talk_list);

        // クリックイベント
        talk_list.addEventListener("click", () => {
            console.log(`${item.id} がクリックされました`);
        });
    });

});
