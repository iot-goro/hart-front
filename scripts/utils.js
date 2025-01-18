
async function GetStatus() {
    const authData = await GetSession();

    const req = await fetch("/app/status/",{
        method:"GET",
        headers : {
            "Authorization" : authData["token"],
        }
    });

    const result = await req.json();
    return result["status"];
}

async function GetUserInfo(userid) {
    const req = await fetch(`https://iot-hart.tail6cf7b.ts.net:8350/auth/info/${userid}`,{
        method:"GET",
    })

    const result = await req.json();
    return result["result"];
}