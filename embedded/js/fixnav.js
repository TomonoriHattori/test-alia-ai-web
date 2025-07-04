//フローティングナビゲーションの動きをヘッダーに合わせる

document.addEventListener('DOMContentLoaded', function() {
    const linkElement = document.getElementById('head02');
    let lastScrollY = 0; // 前回のスクロール位置を記録する変数

    // レスポンシブな設定値
    const desktopSettings = {
        initialTop: 60,
        scrollThreshold: 100, // デスクトップ時のスクロールしきい値
        // heightもJSで制御する場合はここに設定
        // height: 60
    };
    const mobileSettings = {
        initialTop: 45,
        scrollThreshold: 50, // モバイル時のスクロールしきい値 (小さめに設定することも多い)
        // height: 45
    };

    let currentSettings = desktopSettings; // 現在適用される設定

    // ウィンドウサイズに基づいて設定を更新する関数
    function updateResponsiveSettings() {
        if (window.innerWidth <= 768) { // モバイルと見なすブレークポイント
            currentSettings = mobileSettings;
        } else {
            currentSettings = desktopSettings;
        }

        // 初期状態で正しいtop値を設定 (JSでtopを制御する場合)
        // スクロール位置がしきい値以下の場合にのみ初期topを適用
        if (window.scrollY <= currentSettings.scrollThreshold) {
            if (linkElement) {
                linkElement.style.top = currentSettings.initialTop + 'px';
            }
        }
        // ここでheightもJSで制御する場合は追加
        // if (linkElement && currentSettings.height) {
        //     linkElement.style.height = currentSettings.height + 'px';
        //     linkElement.style.lineHeight = currentSettings.height + 'px'; // テキスト中央揃え用
        // }
    }

    // 初期ロード時とリサイズ時に設定を更新
    updateResponsiveSettings();
    window.addEventListener('resize', updateResponsiveSettings);

    // linkElement が存在するか確認
    if (linkElement) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            // スクロール量がしきい値を超えている場合のみ処理を開始
            if (currentScrollY > currentSettings.scrollThreshold) {
                // スクロールが下方向か？
                if (currentScrollY > lastScrollY) {
                    // 下にスクロールしている間は top: 0px にする
                    linkElement.style.top = '0px';
                }
                // スクロールが上方向か？
                else if (currentScrollY < lastScrollY) {
                    // 上にスクロールしている間は現在のinitialTopに戻す
                    linkElement.style.top = currentSettings.initialTop + 'px';
                }
            } else {
                // スクロール量がしきい値以下の場合は常に currentSettings.initialTop に戻す
                linkElement.style.top = currentSettings.initialTop + 'px';
            }

            // 現在のスクロール位置を次回のために保存
            lastScrollY = currentScrollY;
        });
    } else {
        console.warn("ID 'link' を持つ要素が見つかりませんでした。");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // アニメーションを適用する要素と設定を定義
    const animations = [
        {
            selector: '.anim01',
            triggerPercent: 10, // 要素の80%が画面に入ったらアニメーション開始
            speed: '1.0s'      // アニメーション速度 (例: '0.5s', '1.0s', '2s')
        },
        {
            selector: '.anim02',
            triggerPercent: 20, // 要素の60%が画面に入ったらアニメーション開始
            speed: '1.0s'
        },
        {
            selector: '.caption',
            triggerPercent: 70, // 要素の70%が画面に入ったらアニメーション開始
            speed: '1.0s'
        }
    ];

    const observerOptions = {
        root: null, // ビューポートをルートとする
        rootMargin: '0px',
        threshold: [] // 各要素のトリガー閾値を個別に設定するため、最初は空にする
    };

    // 各アニメーション設定に対してIntersection Observerをセットアップ
    animations.forEach(animation => {
        const elements = document.querySelectorAll(animation.selector);
        if (elements.length === 0) return; // 要素が存在しない場合はスキップ

        // 個別の閾値を計算
        const threshold = animation.triggerPercent / 100;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transition = `opacity ${animation.speed} ease-in-out`;
                    observer.unobserve(entry.target); // 一度表示されたら監視を停止
                }
            });
        }, {
            root: observerOptions.root,
            rootMargin: observerOptions.rootMargin,
            threshold: threshold // 個別の閾値を適用
        });

        elements.forEach(element => {
            element.style.opacity = 0; // 初期状態では非表示
            element.style.transition = 'opacity 0s'; // 初期ロード時のトランジションを無効にする
            observer.observe(element);
        });
    });
});


//トップイメージアニメーション
document.addEventListener("DOMContentLoaded", function() {
  const topImg = document.getElementById("TopImg");
  if (topImg) {
    // ページが完全に読み込まれた後に、少し遅れてフェードインを開始
    setTimeout(() => {
      topImg.classList.add("fade-in");
    }, 100); // 100ミリ秒後にフェードイン開始 (任意で調整)
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const topImg = document.getElementById("TopImg");
  if (topImg) {
    // ページが完全に読み込まれた後に、少し遅れてフェードインを開始
    setTimeout(() => {
      topImg.classList.add("fade-in");
    }, 100); // 100ミリ秒後にフェードイン開始 (任意で調整)
  }
});