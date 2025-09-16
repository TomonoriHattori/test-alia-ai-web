//ページ読み込み時にページトップに移動する
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// GSAPのプラグインを登録
gsap.registerPlugin(ScrollToPlugin);

// DOM要素の取得
const sections = document.querySelectorAll('section');
const scrollDownElement = document.querySelector('.scroll_down');

// 変数の初期化
let currentSectionIndex = 0;
let isScrolling = false; // アニメーション中の多重実行を防ぐフラグ
const lastSectionIndex = sections.length - 1;
const animationDuration = 1; // アニメーションの時間（秒）
const scrollCooldown = 500; // スクロール後の待機時間（ミリ秒）。500 = 0.5秒

/**
 * リサイズイベントのハンドラ
 */
function handleResize() {
  // アニメーションはさせずに瞬時に位置を調整
  gsap.to(window, {
      scrollTo: {
          y: sections[currentSectionIndex].offsetTop
      },
      duration: 0
  });
}

// リサイズイベントの登録（debounce処理付き）
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 150);
});


/**
 * 指定されたインデックスのセクションへスクロールする関数 (スクロール方向対応版)
 * @param {number} index - スクロール先のセクションのインデックス
 * @param {string} direction - スクロール方向 ('up' または 'down')
 */
function scrollToSection(index, direction = 'down') { // directionパラメータを追加
  if (index < 0 || index >= sections.length || index === currentSectionIndex) {
    isScrolling = false;
    return;
  }

  if (index > 6) {
    scrollDownElement.classList.add('is-scrolled');
  } else {
    scrollDownElement.classList.remove('is-scrolled');
  }

  if (index === lastSectionIndex) {
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }

  const targetSection = sections[index];
  const currentSection = sections[currentSectionIndex];

  // スクロール方向によってz-indexの前後関係を入れ替える
  if (direction === 'down') {
    // 下スクロール時：現在のセクションが手前
    gsap.set(currentSection, { zIndex: 2 });
    gsap.set(targetSection, { zIndex: 1 });
  } else {
    // 上スクロール時：次のセクションが手前
    gsap.set(targetSection, { zIndex: 2 });
    gsap.set(currentSection, { zIndex: 1 });
  }

  const currentContent = currentSection.querySelector('[class*="section-inner"]');
  const targetContent = targetSection.querySelector('[class*="section-inner"]');
  
  let slideOutY, slideInY;
  if (direction === 'down') {
    slideOutY = -100;
    slideInY = 100;
  } else {
    slideOutY = 100;
    slideInY = -100;
  }
  
  const tl = gsap.timeline({
    onComplete: () => {
      setTimeout(() => {
        isScrolling = false;
      }, scrollCooldown);
      gsap.set(currentSection, { zIndex: 'auto', clearProps: "backgroundColor" }); 
      gsap.set(targetSection, { zIndex: 'auto' });
    }
  });

  // --- アニメーションのシーケンス ---

  // 1. 最初に現在のコンテンツをスライドアウトさせる
  if (currentContent) {
    tl.to(currentContent, {
      yPercent: slideOutY,
      opacity: 0,
      duration: 1.5,
      ease: "power3.in"
    });
  }

  // --- 背景色変更とスクロールのタイミング設定 ---
  const scrollPosition = "+=0.1"; // スクロール開始のタイミング
  const shouldChangeColor = currentSectionIndex === 2 || currentSectionIndex === 6;

  // 2. もし条件に合致する場合、背景色を変更するアニメーションを「タイムライン開始0.1秒後」に設定
  if (shouldChangeColor) {
    const targetBgColor = window.getComputedStyle(targetSection).backgroundColor;
    tl.to(currentSection, { 
        backgroundColor: targetBgColor, 
        duration: 0.1 
    }, 0.8); // スライドアウト開始0.8秒後に開始
  }
  

  // 3. ページスクロールを実行
  tl.to(window, {
    scrollTo: {
      y: targetSection.offsetTop,
      autoKill: false
    },
    duration: 0.1,
    ease: "power2.inOut"
  }, scrollPosition);
  
  

  // 4. 新しいコンテンツをスライドイン
  if (targetContent) {
    tl.fromTo(targetContent, 
      { 
        yPercent: slideInY,
        opacity: 0
      }, 
      {
        yPercent: 0,
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        clearProps: "transform,opacity"
      }, 
      "-=0.2"
    );
  }

  // section2_2 -> section2 または section4 -> section3 への移動時（上スクロール）のみ実行
  if ((index === 2 || index === 6) && direction === 'up') {
      const previousBgColor = window.getComputedStyle(currentSection).backgroundColor;
      const targetBgColor = window.getComputedStyle(targetSection).backgroundColor;

      // ターゲットセクションの背景色を、前のセクションの色から本来の色へアニメーションさせる
      tl.fromTo(targetSection,
          { backgroundColor: previousBgColor }, // 開始色
          {
              backgroundColor: targetBgColor, // 終了色
              duration: 2, // コンテンツのアニメーションと長さを合わせる
              ease: "power2.in" // コンテンツのアニメーションとイージングを合わせる
          },
          "<" // 直前のアニメーション（コンテンツのスライドイン）と同時に開始
      );
  }

  currentSectionIndex = index;
}


/**
 * マウスホイールイベントの処理
 */
window.addEventListener('wheel', (event) => {
  if (isScrolling) {
    event.preventDefault();
    return;
  }

  const delta = event.deltaY;

  if (currentSectionIndex === lastSectionIndex) {
    if (window.scrollY <= sections[lastSectionIndex].offsetTop && delta < 0) {
      event.preventDefault();
      isScrolling = true;
      scrollToSection(currentSectionIndex - 1, 'up'); // 'up'方向を渡す
    }
    return;
  }

  event.preventDefault();
  isScrolling = true;

  if (delta > 0) {
    // 下にスクロール
    scrollToSection(currentSectionIndex + 1, 'down'); // 'down'方向を渡す
  } else {
    // 上にスクロール
    scrollToSection(currentSectionIndex - 1, 'up'); // 'up'方向を渡す
  }
}, { passive: false });

// ページ読み込み完了時
window.addEventListener('load', () => {
  gsap.to(window, { scrollTo: 0, duration: 0 });
});


// Intersection Observer
const targets = document.querySelectorAll('.section-inner2, .section-inner2_2, .section-inner2_3, .section-inner2_4, .section-inner3, .section-inner4, .slideIn1, .slideIn2, .slideIn3, .slideIn4');

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.target.matches('[class*="section-inner"]')) {
      entry.target.classList.toggle('is-animated', entry.isIntersecting);
    } else if (entry.target.matches('[class*="slideIn"]')) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }
  });
};

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

targets.forEach(target => {
  observer.observe(target);
});

// ページ最下部でのスクロールアイコン非表示
const sentinel = document.querySelector('#page-bottom-sentinel');
if (sentinel) {
    const bottomObserverCallback = (entries) => {
        entries.forEach(entry => {
            scrollDownElement.classList.toggle('is-hidden', entry.isIntersecting);
        });
    };
    const bottomObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const bottomObserver = new IntersectionObserver(bottomObserverCallback, bottomObserverOptions);
    bottomObserver.observe(sentinel);
}

/**
 * ナビゲーションリンクのクリックイベント処理
 */
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const sectionsArray = Array.from(sections);

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (href && href.startsWith('#')) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const targetIndex = sectionsArray.indexOf(targetElement);
          
          if (targetIndex !== -1 && !isScrolling) {
            // 移動先と現在地が同じ場合は何もしない
            if (targetIndex === currentSectionIndex) return;

            isScrolling = true;

            
            // アニメーションが完了しなかった場合に備え、一定時間後に強制的にフラグをリセットする
            setTimeout(() => {
              isScrolling = false;
            }, 2500); // アニメーション時間(約2秒)より少し長めに設定
            
            // 移動先のインデックスが現在のインデックスより大きいか小さいかで方向を決定する
            const direction = targetIndex > currentSectionIndex ? 'down' : 'up';
            
            scrollToSection(targetIndex);
          }
        }
      }
    });
  });
});