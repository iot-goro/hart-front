// input
const input = document.querySelector('input');

// button
const button = document.querySelector('.send');

// ul
const ul = document.querySelector('ul');

// 追加ボタンを押した時の処理
button.addEventListener('click', () => {
    // inputの値を取得
    const inputValue = input.value;

    if (inputValue === '') {
        return;
    }

    // li要素を作成
    const li = document.createElement('li');

    // li要素にinputの値を入れる
    li.textContent = inputValue;

    // ul要素にli要素を追加
    ul.appendChild(li);

    // inputの値を空にする
    input.value = '';
});