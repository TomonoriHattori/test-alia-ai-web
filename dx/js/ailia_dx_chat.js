// ailia DX Chatbot

// ステート
var memory = {};
var processing = false;
var stream = false;
var stream_answer = "";
var chatlog = "";

// Chatの実行
function chat_api(url) {
	if (processing){
		return;
	}

	var prompt = document.getElementById("prompt").value;
	document.getElementById("prompt").value = "";

	api_call(url, prompt)
}

function scroll(){
	var objDiv = document.getElementById("logbody");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function chat_response(xhr) {
	// エラー
	if (xhr.status != 200){
		if (xhr.readyState === XMLHttpRequest.DONE){
			chatlog = chatlog + xhr.responseText;
			document.getElementById("chat").innerHTML = chatlog;
			processing = false;
		}
		return;
	}

	// スクロール
	scroll();
	
	// ストリーミング出力の受信
	if (xhr.readyState === xhr.LOADING && xhr.status === 200 && stream) {
		// EventStreamデータの分解
		results = xhr.responseText.split("\n\n");
		stream_answer = "";
		for (var i = 0; i < results.length - 1; i++){ // 改行が含まれていない最後のデータは未完成なので削除
			var lineText = results[i];
			if (!lineText.startsWith('data:')) { // EventStreamのデータかどうか
				continue;
			}
			lineText = lineText.substring(5).trim(); // data:の削除
			const jsonObj = JSON.parse(lineText);
			//console.log(jsonObj)
			if ("token" in jsonObj["data"]){
				var token = jsonObj["data"]["token"];
				stream_answer = stream_answer + token;
				document.getElementById("chat").innerHTML = chatlog + "<p class='ans'>" + stream_answer + "</p>";
			}
		}
	}

	// 通常出力の受信
	if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
		if (stream){
			results = xhr.responseText.split("\n\n");
			lineText = results[results.length - 2] // 最後のデータを取得 
			if (lineText.startsWith('data:')) {
				lineText = lineText.substring(5).trim();
			}
		}else{
			lineText = xhr.responseText;
		}
		stream_answer = "";
		const jsonObj = JSON.parse(lineText);
		//console.log(jsonObj)
		var answer = jsonObj["data"]["answer"];
		chatlog = chatlog + "<p class='ans'>" + answer + "</p>";
		document.getElementById("chat").innerHTML = chatlog;
		memory = jsonObj["data"]["memory"];
		processing = false;
	}
}

// API呼び出し
function api_call(url, prompt) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url + "/api/v1/chat", true);

	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = () => {
		chat_response(xhr);
	};

	var language = "ja";
	var asking = "問い合わせ中...";
	if (window.location.href.includes("/en/")){
		language = "en";
		var asking = "Inquiring...";
	}
	var topK = 1;
	var set_memory = memory;
	var data = {"data": {"prompt":prompt, "memory":set_memory, "language":language, "topK":topK}};

	stream = true;
	data["data"]["stream"] = stream;

	//data["data"]["model"] = "gpt-4";

	if (prompt != ""){
		prompt = prompt.replace("<", "＜");
		prompt = prompt.replace(">", "＞");
		chatlog = chatlog + "<p class='send'>" + prompt + "</p>";
		document.getElementById("chat").innerHTML = chatlog;
	}
	chatlog = chatlog + "<p class='call'>" + asking + "</p>";
	document.getElementById("chat").innerHTML = chatlog;

	scroll();
	
	processing = true;

	var json = JSON.stringify(data);
	xhr.send(json);
}

