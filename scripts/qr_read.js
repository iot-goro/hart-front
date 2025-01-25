window.onload = (e) => {

    let video = document.createElement("video");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let msg = document.getElementById("msg");

    let captureButton = document.getElementById("captureButton");
    let reloadButton = document.getElementById("reloadButton");
    let isPaused = false;

    const userMedia = { video: { facingMode: "environment" } };
    navigator.mediaDevices.getUserMedia(userMedia).then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        startTick();
    });

    function startTick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA && !isPaused) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
            if (code) {
                isPaused = true; // 一時停止
                drawRect(code.location); // Rect
                msg.innerText = code.data; // Data
                captureButton.style.display = "block"; // ボタン表示
                reloadButton.style.display = "block"; // ボタン表示
            } else {
                msg.innerText = "QRコードをかざしてください";
            }
        }
        setTimeout(startTick, 250);
    }

    function drawRect(location) {
        drawLine(location.topLeftCorner, location.topRightCorner);
        drawLine(location.topRightCorner, location.bottomRightCorner);
        drawLine(location.bottomRightCorner, location.bottomLeftCorner);
        drawLine(location.bottomLeftCorner, location.topLeftCorner);
    }

    function drawLine(begin, end) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    // 読み取るボタンの処理
    captureButton.onclick = async () => {
        // ロード中にする
        setLoadText("マッチング中");
        showLoading();

        await Matching(msg.innerText);

        // ローカルストレージのデータ削除
        window.localStorage.removeItem("talk_memo");

        // リダイレクト
        window.location.href = TalkingURL;
    };

    // 再読み込みボタンの処理
    reloadButton.onclick = () => {
        isPaused = false; // 再開
        captureButton.style.display = "none"; // ボタン非表示
        reloadButton.style.display = "none"; // ボタン非表示
        video.play(); // ビデオ再生
        startTick(); // 再スタート
    };
}

async function Matching(token) {
    const authData = await GetSession();

    const req = await fetch("/app/matching/",{
        method:"POST",
        headers : {
            "Authorization" : authData["token"],
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "token" : token
        })
    });

    const result = await req.json();
    console.log(result);
}


async function Init() {
    try {
        const status = await GetStatus();

        // 話しているとき
        if (status["TalkStatus"] == "talking") {
            // リダイレクト
            window.location.href = TalkingURL;
        };

        
    } catch (ex) {
        // エラー処理
        console.error(ex);
        // alert("読み取りに失敗しました");

        // ログインに飛ばす
        // window.location.href = LoginURL;
    }
}

Init();