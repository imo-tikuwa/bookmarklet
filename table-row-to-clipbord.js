!function(d,f,s){s=d.createElement("script");s.src="//j.mp/1bPoAXq";s.onload=function(){f(jQuery.noConflict(1))};d.body.appendChild(s)}(document,function($){
  if (!navigator.clipboard) {
    alert("お使いのブラウザはこのブックマークレットに対応していません。。；；");
  }
  alert("テーブルのコピーしたい列をクリックしてください");
  document.body.onclick = function(event) {
    let $target = $(event.target);
    if ($.inArray($target.prop('tagName'), ['TH', 'TD']) == -1) {
      return;
    }
    $table = $target.parents('table');
    let clicked_index = $target.index();
    let clip_data = [];
    $table.find('tr').each(function(tr_index, tr_element){
      $(tr_element).find('th,td').each(function(col_index, col_element){
        if (col_index == clicked_index) {
          clip_data.push($(col_element).text());
        }
      });
    });
    navigator.clipboard.writeText(clip_data.join('\r\n'));
    alert("クリップボードにコピーしました");
  }
});