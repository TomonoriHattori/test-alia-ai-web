// ページのDOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {

    // .slideIn1 クラスを持つすべての要素を取得
    const targets = document.querySelectorAll('.slideIn1');

    /**
     * 監視対象が画面に入ったり出たりしたときに実行されるコールバック関数
     * @param {IntersectionObserverEntry[]} entries - 監視対象のDOMリスト
     * @param {IntersectionObserver} observer - 監視インスタンス
     */
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // ターゲット（.slideIn1）が画面内（isIntersecting = true）か判定
            // 画面内なら 'is-visible' クラスを追加し、画面外なら削除する
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    };

    // Intersection Observer のオプション設定
    const observerOptions = {
        root: null, // ビューポート（画面）を基準にする
        rootMargin: '0px',
        threshold: 0.3 // 要素が30%表示されたらコールバックを実行
    };

    // Intersection Observer のインスタンスを作成
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 取得した .slideIn1 の各要素について監視を開始
    targets.forEach(target => observer.observe(target));

});