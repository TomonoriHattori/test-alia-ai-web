//スライドのアニメーション

// GSAPのプラグインを登録
gsap.registerPlugin(ScrollToPlugin);

// DOM要素の取得
const sections = document.querySelectorAll('section');
const scrollDownElement = document.querySelector('.scroll_down'); // ★変更点: .scroll_down要素を取得

// 変数の初期化
let currentSectionIndex = 0;
let isScrolling = false; // アニメーション中の多重実行を防ぐフラグ
const lastSectionIndex = sections.length - 1;
const animationDuration = 1; // アニメーションの時間（秒）
const scrollCooldown = 500; // ★追加: スクロール後の待機時間（ミリ秒）。500 = 0.5秒

/**
 * リサイズイベントのハンドラ
 * ウィンドウのリサイズが終わったら現在のセクションに再スナップする
 */
function handleResize() {
  // アニメーションはさせずに瞬時に位置を調整
  scrollToSection(currentSectionIndex, 0); 
}

// リサイズイベントの登録（debounce処理付き）
// 頻繁なイベント発生を防ぎ、リサイズ終了後に一度だけ実行する
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 150); // 150ms後に実行
});


/**
 * 指定されたインデックスのセクションへスクロールする関数
 * @param {number} index - スクロール先のセクションのインデックス
 */
function scrollToSection(index) {
// インデックスが範囲内かチェック
if (index < 0 || index >= sections.length) {
    isScrolling = false; // フラグをリセット
    return;
}

// ★変更点: スクロールダウン.scroll_downの色を制御
if (index > 6) {
    // 2ページ目以降は 'is-scrolled' クラスを追加して白にする
    scrollDownElement.classList.add('is-scrolled');
} else {
    // 1ページ目ではクラスを削除して黒に戻す
    scrollDownElement.classList.remove('is-scrolled');
}

// 最後のセクション（通常スクロール）に移動する場合
if (index === lastSectionIndex) {
    document.body.style.overflow = 'auto'; // 通常スクロールを許可
} else {
    document.body.style.overflow = 'hidden'; // スナップモードのためスクロールを禁止
}

const targetSection = sections[index];
currentSectionIndex = index;

// GSAPを使ってアニメーション実行
gsap.to(window, {
    scrollTo: {
    y: targetSection.offsetTop, // 目標のY座標
    autoKill: false // スクロール中にユーザーが操作した場合でもアニメーションを継続
    },
    duration: animationDuration,
    ease: "power4.out", // イージングの種類
    // アニメーション完了時にフラグをリセット
    onComplete: () => {
      setTimeout(() => {
        isScrolling = false;
      }, scrollCooldown); // 設定した待機時間だけ遅らせる
    }
});
}

/**
 * マウスホイールイベントの処理
 */
window.addEventListener('wheel', (event) => {
  // アニメーション中は処理を中断し、デフォルトのスクロールもキャンセル
  if (isScrolling) {
    event.preventDefault();
    return;
  }

  const delta = event.deltaY; // ホイールの移動量（下: 正, 上: 負）

  // 現在が最後のセクション（通常スクロールモード）の場合
  if (currentSectionIndex === lastSectionIndex) {
    // 最後のセクションの最上部で、さらに上にスクロールしようとした時
    if (window.scrollY <= sections[lastSectionIndex].offsetTop && delta < 0) {
      event.preventDefault(); // スナップスクロールに戻るので、デフォルト動作をキャンセル
      isScrolling = true;
      scrollToSection(currentSectionIndex - 1); // 一つ前のセクションへ
    }
    // それ以外の通常スクロール中は event.preventDefault() を呼ばず、ブラウザのデフォルトスクロールに任せる
    return;
  }

  // --- これ以降はスナップモード中の処理 ---
  // デフォルトのスクロール動作をキャンセル
  event.preventDefault();
  
  isScrolling = true; // アニメーション開始フラグを立てる

  if (delta > 0) {
    // 下にスクロール
    scrollToSection(currentSectionIndex + 1);
  } else {
    // 上にスクロール
    scrollToSection(currentSectionIndex - 1);
  }
}, { passive: false }); // preventDefaultを確実に機能させるためpassive: falseを指定

// ページ読み込み完了時に最初のセクションへ移動（任意）
window.addEventListener('load', () => {
  scrollToSection(0);
});


//innerとヒーローのアニメーション

// 監視対象の要素をすべて取得
const targets = document.querySelectorAll('.section-inner2, .section-inner2_2, .section-inner2_3, .section-inner2_4, .section-inner3, .section-inner4, .slideIn1, .slideIn2, .slideIn3, .slideIn4');

// Intersection Observerのコールバック関数
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    // 監視対象の要素（entry.target）がどのクラスを持っているか判定

    // もし .section-inner2 クラスを持っていたら
    if (entry.target.matches('[class*="section-inner"]')) {
      // is-animated クラスを付け外しする
      entry.target.classList.toggle('is-animated', entry.isIntersecting);
    
    // もし slideIn1, slideIn2... いずれかのクラスを持っていたら
    } else if (entry.target.matches('[class*="slideIn"]')) {
      // is-visible クラスを付け外しする
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }
  });
};

// Intersection Observerのオプション
const observerOptions = {
  root: null, // ビューポートをルートとする
  rootMargin: '0px',
  threshold: 0.3 // 要素が30%見えたらトリガー
};

// Intersection Observerのインスタンスを作成
const observer = new IntersectionObserver(observerCallback, observerOptions);

// 各ターゲット要素の監視を開始
targets.forEach(target => {
  observer.observe(target);
});

// ★追加: ページ最下部を監視して .scroll_down を非表示にする
const sentinel = document.querySelector('#page-bottom-sentinel');
if (sentinel) {
    const bottomObserverCallback = (entries) => {
        entries.forEach(entry => {
            // 最下部要素が画面内に入ったら .scroll_down に 'is-hidden' クラスを追加
            scrollDownElement.classList.toggle('is-hidden', entry.isIntersecting);
        });
    };
    const bottomObserverOptions = {
        root: null,
        rootMargin: '0px',
        // 画面に少しでも入ったら発火
        threshold: 0.1
    };
    const bottomObserver = new IntersectionObserver(bottomObserverCallback, bottomObserverOptions);
    bottomObserver.observe(sentinel);
}

/**
 * ナビゲーションリンクのクリックイベント処理
 * ページ内リンクがクリックされた際に、スムーズスクロールを実行する
 */
// DOMの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', () => {
  // ナビゲーションメニュー内のaタグをすべて取得
  const navLinks = document.querySelectorAll('.site-menu a');
  // ページ内の全<section>要素のリスト（既存のものを再利用）
  const sectionsArray = Array.from(sections);

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      // リンクがページ内リンク（#で始まる）かチェック
      if (href && href.startsWith('#')) {
        // デフォルトのアンカーリンクの挙動（瞬間移動）をキャンセル
        event.preventDefault();

        // ターゲットとなる要素のIDを取得 (例: '#section2' -> 'section2')
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // ターゲット要素が何番目のセクションかを検索
          const targetIndex = sectionsArray.indexOf(targetElement);
          
          // 対応するセクションが見つかった場合
          if (targetIndex !== -1 && !isScrolling) {
            isScrolling = true; // アニメーション開始フラグを立てる
            scrollToSection(targetIndex); // スムーズスクロールを実行
          }
        }
      }
      // #で始まらない通常のリンクは、このif文を無視して通常通りに動作します。
    });
  });
});