let pathnames = location.pathname.split('/');
if (location.origin != 'https://github.com' || pathnames[3] !== 'commits') {
  window.alert('このブックマークレットはGitHubのコミット一覧画面で実行してください');
  return;
}

// 2重起動防止
if (document.getElementById('bookmarklet-table')) {
  document.getElementById('bookmarklet-table').parentNode.remove();
}

// ブラウザバックでブックマークレットのguiが残るのを防止
window.onpopstate = (e) => {
  if (document.getElementById('bookmarklet-table')) {
    document.getElementById('bookmarklet-table').parentNode.remove();
  }
  return;
};

// 画面遷移の際にブックマークレットのguiが残るのを防止
window.onbeforeunload = (e) => {
  if (document.getElementById('bookmarklet-table')) {
    document.getElementById('bookmarklet-table').parentNode.remove();
  }
  return;
};

// ローカルストレージ取得（ストレージ名はアカウント名/リポジトリ名）
let local_storage_name = pathnames[1] + '/' + pathnames[2];
current_local_storage = localStorage.getItem(local_storage_name);

// コミットID配列（ローカルストレージにコピーボタンを選択した情報があればコミットID配列をオーバーライド）
let commit_ids = [];
if (current_local_storage != null) {
  commit_ids = JSON.parse(current_local_storage);
}

// GitHubのコミット一覧画面に存在するコピーボタン
let copy_buttons = document.getElementsByTagName('clipboard-copy');

// css作成
let bookmarklet_css = document.createElement("style");
document.head.appendChild(bookmarklet_css);
bookmarklet_css.sheet.insertRule(`
#bookmarklet-table {
  position:fixed;
  top:5px;
  right:5px;
  z-index:10000;
  background-color: rgba(242, 226, 220, 0.8) !important;
  border: solid 2px rgba(242, 120, 75, 0.8) !important;
  border-collapse: collapse;
  font-family:游ゴシック体,YuGothic,游ゴシック Medium,Yu Gothic Medium,游ゴシック,Yu Gothic,sans-serif;
}
`, 0);
bookmarklet_css.sheet.insertRule(`
#bookmarklet-table td {
  padding:2px 5px;
}
`, 1);
bookmarklet_css.sheet.insertRule(`
#bookmarklet-clear,
#bookmarklet-execute-compare {
  width:100%;
}
`, 2);

// html作成
let bookmarklet_gui_html = `
<table id='bookmarklet-table'>
  <tr>
    <td>比較元コミットID</td>
    <td colspan='2' width='300'>
      <small id='diff-base'></small>
    </td>
  </tr>
  <tr>
    <td>比較先コミットID</td>
    <td colspan='2'width='300'>
      <small id='diff-target'></small>
    </td>
  </tr>
  <tr>
    <td></td>
    <td width='150'>
      <input type='button' id='bookmarklet-clear' value='クリア' />
    </td>
    <td width='150'>
      <input type='button' id='bookmarklet-execute-compare' value='差分ページに遷移' />
    </td>
  </tr>
</table>
`;
let element = document.createElement("div");
element.innerHTML = bookmarklet_gui_html;
document.body.appendChild(element);

// ↑で追加したブックマーレクット上のUIの要素を取得
let diff_base_element = document.getElementById('diff-base');
if (commit_ids.length >= 1) {
  diff_base_element.innerText = commit_ids[0];
}
let diff_target_element = document.getElementById('diff-target');
if (commit_ids.length == 2) {
  diff_target_element.innerText = commit_ids[1];
}
let bookmarklet_clear_button = document.getElementById('bookmarklet-clear');
let bookmarklet_compare_button = document.getElementById('bookmarklet-execute-compare');
bookmarklet_clear_button.addEventListener('click', (e) => {
  commit_ids = [];
  localStorage.setItem(local_storage_name, JSON.stringify(commit_ids));
  diff_base_element.innerText = '';
  diff_target_element.innerText = '';
});
bookmarklet_compare_button.addEventListener('click', (e) => {
  if (commit_ids.length == 0) {
    alert('比較元と比較先のコミットIDを選択してください。');
  } else if (commit_ids.length == 1) {
    alert('比較先のコミットIDを選択してください。');
  } else if (commit_ids.length == 2) {
    location.href = location.href = location.origin + '/' + pathnames[1] + '/' + pathnames[2] + '/compare/' + commit_ids.join('...');
  }
});

// GitHubのコミット一覧のコピーボタンをクリックしたときの処理
Object.keys(copy_buttons).forEach(key => {
  let copy_button = copy_buttons[key];
  copy_button.addEventListener('click', (e) => {

    if (commit_ids.length == 2) {
      alert('比較元/比較先共にコミットIDがセットされています。一度クリアしてください。');
      return false;
    }

    let clipboard_copy_element = e.target;
    if (e.target.localName != 'clipboard-copy') {
      clipboard_copy_element = clipboard_copy_element.closest('clipboard-copy');
    }

    let commit_id = clipboard_copy_element.value;
    commit_ids.push(commit_id);
    localStorage.setItem(local_storage_name, JSON.stringify(commit_ids));

    if (commit_ids.length == 1) {
      diff_base_element.innerText = commit_id;
    } else if (commit_ids.length == 2) {
      diff_target_element.innerText = commit_id;
    }
  });
});
