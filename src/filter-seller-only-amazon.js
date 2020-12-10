if (location.origin != 'https://www.amazon.co.jp' || location.pathname != '/s') {
  alert("このブックマークレットはAmazon.co.jpの検索結果一覧で実行してください");
  exit;
}

if (window.confirm('Amazon.co.jpから出品されている商品のみを表示します')) {
  let query = location.search,
  regex = /rh=(.*?)(&|$)/,
  filter = 'rh=p_6:AN1VRQENFRJN5';
  if (query.match(regex)) {
    query = query.replace(regex, filter + '&');
  } else {
    query += '&' + filter;
  }
  location.href = location.origin + location.pathname + query;
}
