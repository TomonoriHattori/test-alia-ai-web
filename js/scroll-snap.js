//ページ読み込み時にページトップに移動する
history.scrollRestoration = 'manual';

// GSAPのプラグインを登録
gsap.registerPlugin(ScrollToPlugin);

// DOM要素の取得
const sections = document.querySelectorAll('section');
const scrollDownElement = document.querySelector('.scroll_down');

// 変数の初期化
let currentSectionIndex = 0;
let isScrolling = false; // アニメーション中の多重実行を防ぐフラグ
const lastSectionIndex = sections.length - 1;

/**
 * リサイズイベントのハンドラ（デスクトップ用）
 */
function handleResize() {
    gsap.to(window, {
        scrollTo: { y: sections[currentSectionIndex].offsetTop },
        duration: 0
    });
}

/**
 * 指定されたインデックスのセクションへスクロールする関数
 * @param {number} index - スクロール先のセクションのインデックス
 * @param {string} direction - スクロール方向 ('up' または 'down')
 */
function scrollToSection(index, direction = 'down') {
    if (isScrolling || index < 0 || index >= sections.length || index === currentSectionIndex) {
        isScrolling = false;
        return;
    }
    isScrolling = true;

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

    if (direction === 'down') {
        gsap.set(currentSection, { zIndex: 2 });
        gsap.set(targetSection, { zIndex: 1 });
    } else {
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
            }, 500);
            gsap.set(currentSection, { zIndex: 'auto', clearProps: "backgroundColor" });
            gsap.set(targetSection, { zIndex: 'auto' });
        }
    });

    if (currentContent) {
        tl.to(currentContent, { yPercent: slideOutY, opacity: 0, duration: 1.5, ease: "power3.in" });
    }

    const scrollPosition = "+=0.1";
    const shouldChangeColor = currentSectionIndex === 2 || currentSectionIndex === 6;

    if (shouldChangeColor) {
        const targetBgColor = window.getComputedStyle(targetSection).backgroundColor;
        tl.to(currentSection, { backgroundColor: targetBgColor, duration: 0.1 }, 0.8);
    }

    tl.to(window, {
        scrollTo: { y: targetSection.offsetTop, autoKill: false },
        duration: 0.1,
        ease: "power2.inOut"
    }, scrollPosition);

    if (targetContent) {
        tl.fromTo(targetContent,
            { yPercent: slideInY, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 2, ease: "power2.out", clearProps: "transform,opacity" },
            "-=0.2"
        );
    }

    if ((index === 2 || index === 6) && direction === 'up') {
        const previousBgColor = window.getComputedStyle(currentSection).backgroundColor;
        const targetBgColor = window.getComputedStyle(targetSection).backgroundColor;
        tl.fromTo(targetSection,
            { backgroundColor: previousBgColor },
            { backgroundColor: targetBgColor, duration: 2, ease: "power2.in" },
            "<"
        );
    }

    currentSectionIndex = index;
}

// ===================================================
// イベントハンドラ
// ===================================================
let touchStartY = 0;
const swipeThreshold = 50;

function handleWheel(event) {
    if (isScrolling) {
        event.preventDefault();
        return;
    }
    const delta = event.deltaY;
    if (currentSectionIndex === lastSectionIndex) {
        if (window.scrollY <= sections[lastSectionIndex].offsetTop && delta < 0) {
            event.preventDefault();
            scrollToSection(currentSectionIndex - 1, 'up');
        }
        return;
    }
    event.preventDefault();
    scrollToSection(delta > 0 ? currentSectionIndex + 1 : currentSectionIndex - 1, delta > 0 ? 'down' : 'up');
}

function handleTouchStart(event) {
    if (isScrolling) return;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (isScrolling || currentSectionIndex !== lastSectionIndex) {
        event.preventDefault();
    }
}

function handleTouchEnd(event) {
    if (isScrolling) return;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    if (currentSectionIndex === lastSectionIndex) {
        if (deltaY < -swipeThreshold) {
            scrollToSection(currentSectionIndex - 1, 'up');
        }
        return;
    }
    if (Math.abs(deltaY) > swipeThreshold) {
        scrollToSection(deltaY > 0 ? currentSectionIndex + 1 : currentSectionIndex - 1, deltaY > 0 ? 'down' : 'up');
    }
}

function handleNavClick(event) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const targetIndex = Array.from(sections).indexOf(targetElement);
            if (targetIndex !== -1 && !isScrolling && targetIndex !== currentSectionIndex) {
                const direction = targetIndex > currentSectionIndex ? 'down' : 'up';
                scrollToSection(targetIndex, direction);
            }
        }
    }
}


// ===================================================
// スクロール制御の有効化・無効化
// ===================================================
const navLinks = document.querySelectorAll('a[href^="#"]');
let resizeTimer;

function enableCustomScroll() {
    console.log("カスタムスクロールを有効化");
    document.body.style.overflow = 'hidden';
    if (currentSectionIndex === lastSectionIndex) {
        document.body.style.overflow = 'auto';
    }
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    navLinks.forEach(link => link.addEventListener('click', handleNavClick));
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
    // 初期位置へ移動
    handleResize();
}

function disableCustomScroll() {
    console.log("カスタムスクロールを無効化");
    document.body.style.overflow = 'auto'; // 通常スクロールに戻す
    window.removeEventListener('wheel', handleWheel, { passive: false });
    window.removeEventListener('touchstart', handleTouchStart, { passive: true });
    window.removeEventListener('touchmove', handleTouchMove, { passive: false });
    window.removeEventListener('touchend', handleTouchEnd, { passive: false });
    navLinks.forEach(link => link.removeEventListener('click', handleNavClick));
    window.removeEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
}


// ===================================================
// ページ読み込み時の初期設定
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    // ページトップに移動
    window.scrollTo(0, 0);

    // Intersection Observer (これは両方のビューで共通)
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
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    targets.forEach(target => observer.observe(target));

    // ページ最下部でのスクロールアイコン非表示 (これも共通)
    const sentinel = document.querySelector('#page-bottom-sentinel');
    if (sentinel) {
        const bottomObserverCallback = (entries) => {
            entries.forEach(entry => {
                scrollDownElement.classList.toggle('is-hidden', entry.isIntersecting);
            });
        };
        const bottomObserver = new IntersectionObserver(bottomObserverCallback, { root: null, rootMargin: '0px', threshold: 0.1 });
        bottomObserver.observe(sentinel);
    }

    // メディアクエリによる処理の分岐
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    function handleDeviceChange(e) {
        if (e.matches) {
            // モバイルビュー
            disableCustomScroll();
        } else {
            // デスクトップビュー
            enableCustomScroll();
        }
    }

    mediaQuery.addEventListener('change', handleDeviceChange); // リサイズ時に判定
    handleDeviceChange(mediaQuery); // 初期読み込み時に判定
});