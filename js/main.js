'use strict';

// カウントアップアニメーション
(function() {
    function countUp(el) {
        var target   = parseInt(el.getAttribute('data-target'), 10);
        var duration = parseInt(el.getAttribute('data-duration') || '1600', 10);
        var noFormat = el.getAttribute('data-format') === 'none';
        var startTime = null;

        function fmt(n) {
            return noFormat ? String(n) : n.toLocaleString();
        }
        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            el.textContent = fmt(Math.round(easeOut(progress) * target));
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = fmt(target);
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                countUp(entry.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.countup').forEach(function(el) {
        observer.observe(el);
    });
})();

// ページ遷移アニメーション（離脱時のみ黒幕フェード）
(function() {
    var overlay = document.getElementById('page-transition');
    if (!overlay) return;

    overlay.innerHTML =
        '<div class="pt-inner">' +
            '<p class="pt-clair">CLAIR</p>' +
            '<div class="pt-ripple"><span></span><span></span><span></span></div>' +
        '</div>';

    // ブラウザの戻る/進む（bfcache）でオーバーレイが残らないよう保険
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            overlay.classList.remove('is-active');
        }
    });

    // 内部リンククリック時に黒幕フェードインしてから遷移
    document.querySelectorAll('a[href]').forEach(function(link) {
        var href = link.getAttribute('href');
        if (
            !href ||
            href.charAt(0) === '#' ||
            link.target === '_blank' ||
            href.indexOf('http') === 0 ||
            href.indexOf('mailto') === 0 ||
            href.indexOf('tel') === 0
        ) return;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.classList.add('is-active');
            var dest = href;
            setTimeout(function() {
                window.location.href = dest;
            }, 500);
        });
    });
})();


// voice slick
$('.slider').slick({
    autoplay: true,//自動的に動き出すか。初期値はfalse。
    infinite: true,//スライドをループさせるかどうか。初期値はtrue。
    speed: 300,//スライドのスピード。初期値は300。
    slidesToShow: 3,//スライドを画面に3枚見せる
    slidesToScroll: 1,//1回のスクロールで1枚の写真を移動して見せる
    prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
    nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
    centerMode: true,//要素を中央ぞろえにする
    variableWidth: true,//幅の違う画像の高さを揃えて表示
    dots: true,//下部ドットナビゲーションの表示
    pauseOnHover: true,//ホバー時に停止する
    pauseOnFocus: false,//フォーカス時に停止しない
});

// scrollTop
$('.topbtn').on('click', function() {
    const position = 0;
    const speed = 600;
    $('html,body').animate({
        scrollTop:position
    },speed);
});

// // fade in
$(function() {
    if (sessionStorage.getItem('access')) {
        $('.logo_fadein').hide();
    } else {
        sessionStorage.setItem('access', 'true');
        setTimeout(function(){
            $('.logo_fadein p').fadeIn(600);
        }, 500);
        setTimeout(function(){
            $('.logo_fadein').fadeOut(800);
        }, 2500);
    }
});

// hamburger menu
$(".openbtn").click(function () {
    $(this).toggleClass('active');
    $('#nav').toggleClass('active');
    $('html').toggleClass('is-fixed');
    $('body').toggleClass('is-fixed');
});

$(".list_item a").click(function () {
    $(".openbtn").removeClass('active');
    $('#nav').removeClass('active');
    $('html').removeClass('is-fixed');
    $('body').removeClass('is-fixed');
});

// コンタクトフォーム バリデーション
(function() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var fields = [
        { id: 'input-name',    errorId: 'error-name',    type: 'text',     label: '氏名' },
        { id: 'input-tel',     errorId: 'error-tel',     type: 'tel',      label: '電話番号' },
        { id: 'input-email',   errorId: 'error-email',   type: 'email',    label: 'メールアドレス' },
        { id: 'input-message', errorId: 'error-message', type: 'textarea', label: 'お問い合わせ内容' }
    ];

    function validateField(field) {
        var el = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);
        var value = el.value.trim();
        var msg = '';

        if (!value) {
            msg = field.label + 'を入力してください';
        } else if (field.type === 'tel' && !/^[\d\-\+\(\)\s]+$/.test(value)) {
            msg = '正しい電話番号を入力してください（例：000-0000-0000）';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            msg = '正しいメールアドレスを入力してください';
        }

        if (msg) {
            el.classList.add('is-error');
            el.classList.remove('is-valid');
            errorEl.textContent = msg;
            return false;
        } else {
            el.classList.remove('is-error');
            el.classList.add('is-valid');
            errorEl.textContent = '';
            return true;
        }
    }

    fields.forEach(function(field) {
        var el = document.getElementById(field.id);
        if (!el) return;
        el.addEventListener('blur', function() { validateField(field); });
        el.addEventListener('input', function() {
            if (el.classList.contains('is-error')) validateField(field);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var isValid = fields.every(function(f) { return validateField(f); });
        if (isValid) {
            document.querySelector('.Form').style.display = 'none';
            document.querySelector('.Form-Btn').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
        }
    });
})();

// about_back パララックス
function aboutParallax() {
    const about = document.querySelector('#about');
    if (!about) return;
    const rect = about.getBoundingClientRect();
    const offset = Math.max(-80, Math.min(80, rect.top * 0.35));
    about.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
}

window.addEventListener('scroll', aboutParallax);
aboutParallax();

// topbtn と画像の重なり検知
function checkBtnOverlap() {
    const btn = document.querySelector('.topbtn');
    if (!btn) return;
    const btnRect = btn.getBoundingClientRect();
    const images = document.querySelectorAll('img');
    let overlapping = false;

    images.forEach(function(img) {
        const imgRect = img.getBoundingClientRect();
        if (
            btnRect.left < imgRect.right &&
            btnRect.right > imgRect.left &&
            btnRect.top < imgRect.bottom &&
            btnRect.bottom > imgRect.top
        ) {
            overlapping = true;
        }
    });

    btn.classList.toggle('is-overlap', overlapping);
}

window.addEventListener('scroll', checkBtnOverlap);
checkBtnOverlap();

window.addEventListener('scroll', function(){
    const scroll = window.scrollY;
    const windowHeight = window.innerHeight;

    // スクロール進捗バー
    var docHeight = document.documentElement.scrollHeight - windowHeight;
    var progress = docHeight > 0 ? (scroll / docHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-pct', progress + '%');

    const boxes = document.querySelectorAll('.fadein');

    boxes.forEach(function(box) {
      const distanceToBox = box.offsetTop;
      if(scroll + windowHeight > distanceToBox + 200) {
        box.classList.add('is-show');
      }
    });

    // contact_top 時間差フェードイン
    const contactTop = document.querySelector('.contact_top');
    if (contactTop && !contactTop.classList.contains('animated')) {
      if (scroll + windowHeight > contactTop.offsetTop + 100) {
        contactTop.classList.add('animated');
        contactTop.querySelectorAll('img').forEach(function(img, i) {
          setTimeout(function() {
            img.classList.add('is-show');
          }, i * 250);
        });
      }
    }
  });