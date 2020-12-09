let pathnames = location.pathname.split('/');
if (location.origin != 'https://github.com' || pathnames[3] !== 'commits') {
  window.alert('このブックマークレットはGitHubのコミット一覧画面で実行してください');
  return;
}

let init_message = '差分を比較したいコミットのコピーボタンを2つクリックしてください。(最初に古い方、次に新しい方を選択)';
let commit_ids = [];
let copy_buttons = document.getElementsByTagName('clipboard-copy');
Object.keys(copy_buttons).forEach(key => {
  let copy_button = copy_buttons[key];
  copy_button.addEventListener('click', function(e) {
    let clipboard_copy_element = e.target;
    if (e.target.localName != 'clipboard-copy') {
      clipboard_copy_element = clipboard_copy_element.closest('clipboard-copy');
    }

    commit_ids.push(clipboard_copy_element.value);

    if (commit_ids.length == 2) {
      if (window.confirm(commit_ids.join('から') + 'の差分を表示します')) {
        location.href = location.href = location.origin + '/' + pathnames[1] + '/' + pathnames[2] + '/compare/' + commit_ids.join('...');
      } else {
        commit_ids = [];
        window.alert(init_message);
      }
    }
  });
});

window.alert(init_message);