!function(d,f,s){s=d.createElement("script");s.src="//j.mp/1bPoAXq";s.onload=function(){f(jQuery.noConflict(1))};d.body.appendChild(s)}(document,function imageDownloader($){


  // 外部jsライブラリ読み込み(初回のみ読み込み)
  console.log($(document).find("script[src*=jszip]").length);
  if ($(document).find("script[src*=jszip]").length == 0) {
    var jszip = document.createElement("script"), filesaver = document.createElement("script");
    jszip.src = "//cdnjs.cloudflare.com/ajax/libs/jszip/3.3.0/jszip.min.js";
    document.body.appendChild(jszip);
    filesaver.src = "//cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js";
    document.body.appendChild(filesaver);
    return imageDownloader($);
  }

  console.log("img-downloader start.");
  $("body").append("<div id='tkw-overlay'></div>");

  // CSS作成
  var style = document.createElement("style");
  document.head.appendChild(style);
  var sheet = style.sheet;
  var overlay_height = $(document).height() + 'px';
  sheet.insertRule("#tkw-overlay { background-color: #777 !important;opacity: 0.2;position: absolute;z-index: 9999;top: 0;left: 0;width: 100%;height: " + overlay_height + " }", 0);

  var zip = new JSZip();
  var deferreds = $.Deferred();
  var promise = deferreds;

  $(document).find('img').each(function(idx, obj){
    console.log($(obj).attr('src'));

    promise = promise.then(function() {
      var new_promise = new $.Deferred();

      // 画像を読み込んでzipにレスポンスデータを追加
      let image_path = $(obj).attr('src');
      var xhr = new XMLHttpRequest();
      xhr.open('GET', image_path, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(e) {
        if (this.status == 200) {
          zip.file(image_path.match(".+/(.+?)([\?#;].*)?$")[1], xhr.response);
          new_promise.resolve();
        }
      };
      xhr.send();

      return new_promise;
    });
  });

  promise.then(function(){
    zip.generateAsync({type:"blob"}).then(function (content) {
      saveAs(content, "images.zip");
    });
  });
  deferreds.resolve();

  $("body").find("#tkw-overlay").remove();
  console.log("img-downloader end.");
});