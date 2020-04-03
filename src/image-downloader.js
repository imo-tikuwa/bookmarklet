
// 外部jsライブラリ読み込み(初回のみ)
if (typeof JSZip == 'undefined') {
  var jszip = document.createElement("script"), jsziputil = document.createElement("script"), filesaver = document.createElement("script");
  jszip.src = "//cdnjs.cloudflare.com/ajax/libs/jszip/3.3.0/jszip.min.js";
  document.body.appendChild(jszip);
  jsziputil.src = "//cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js";
  document.body.appendChild(jsziputil);
  filesaver.src = "//cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js";
  document.body.appendChild(filesaver);
}

setTimeout(makezip, 100);
function makezip() {

  console.log("img-downloader start.");

  // 画像タグのリスト
  var imgs = Object.values(Array.from(document.body.querySelectorAll('img')).reduce(function(pre, curr) {
    if (!pre[curr.src]) pre[curr.src] = curr;
    return pre;
  }, {}));
  if (imgs.length <= 0) {
    alert("画像が見つかりませんでした。");
    document.body.removeChild(overlay);
    console.log("img-downloader end.");
    return false;
  }

  // zip生成
  var zip = new JSZip();
  for (let i = 0; i < imgs.length; i++) {
    let filename = imgs[i].src.match(".+/(.+?)([\?#;].*)?$")[1];
    // 第1引数がファイル名、第2引数が画像データ(無名関数内でJSZipUtilsで取得)
    zip.file(filename, (function(image_path){
      console.log(image_path);
      return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(image_path, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })(imgs[i].src), {binary:true});
  }
  zip.generateAsync({type:"blob"}).then(function (content) {
    saveAs(content, "images.zip");
  });

  console.log("img-downloader end.");
}
