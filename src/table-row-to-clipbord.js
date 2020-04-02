!function(d,f,s){s=d.createElement("script");s.src="//j.mp/1bPoAXq";s.onload=function(){f(jQuery.noConflict(1))};d.body.appendChild(s)}(document,function($){

  // CSS作成
  var style = document.createElement("style");
  document.head.appendChild(style);
  var sheet = style.sheet;
  sheet.insertRule("tr:first-child .table-row-to-clipbord-current { border-top: 2px solid rgba(242, 120, 75, 1) !important; }", 0);
  sheet.insertRule(".table-row-to-clipbord-current { background-color:rgba(242, 120, 75, 0.15) !important;border-right: 2px solid rgba(242, 120, 75, 1) !important;border-left: 2px solid rgba(242, 120, 75, 1) !important; }", 1);
  sheet.insertRule("tbody tr:last-child .table-row-to-clipbord-current { border-bottom: 2px solid rgba(242, 120, 75, 1) !important; }", 2);
  sheet.insertRule("thead ~ tbody tr:first-child .table-row-to-clipbord-current { border-top: inherit !important; }", 3);

  alert("テーブルのコピーしたい列をクリックしてください");

  // テーブルのセルをクリックしたときのコピー処理
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

    let textarea = document.createElement("textarea");
    textarea.value = clip_data.join('\r\n');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.parentElement.removeChild(textarea);
    alert("クリップボードにコピーしました");

    document.body.onclick = null;
    document.body.onmouseover = null;
    $(document).find('.table-row-to-clipbord-current').removeClass('table-row-to-clipbord-current');
  };

  // テーブルをマウスオーバーしたときのハイライト表示処理
  document.body.onmouseover = function(event) {
    let $target = $(event.target);
    if ($.inArray($target.prop('tagName'), ['TH', 'TD']) == -1) {
      return;
    }
    $table = $target.parents('table');
    let clicked_index = $target.index();
    $table.find('tr').each(function(tr_index, tr_element){
      $(tr_element).find('th,td').each(function(col_index, col_element){
        $(col_element).removeClass('table-row-to-clipbord-current');
        if (col_index == clicked_index) {
          $(col_element).addClass('table-row-to-clipbord-current');
        }
      });
    });
  };
});