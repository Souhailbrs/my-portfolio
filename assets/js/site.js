(() => {
    'use strict';
    const root = document.documentElement;
    root.classList.add('js');

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const canAnimate = () => !reduced.matches && finePointer.matches;

    /* ---------- Nav: glass state + active section ---------- */
    const nav = document.querySelector('[data-nav]');
    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const navLinks = [...document.querySelectorAll('.nav-links a')];
    if ('IntersectionObserver' in window) {
        const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(a => {
                    if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
                    else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => sectionObserver.observe(s));
    }

    /* ---------- Reveal on scroll ---------- */
    const reveals = document.querySelectorAll('.reveal');
    const timeline = document.querySelector('[data-timeline]');
    const stops = timeline ? [...timeline.querySelectorAll('.timeline-stop')] : [];
    let reached = 0;

    const markVisible = el => {
        el.classList.add('is-visible');
        const idx = stops.indexOf(el);
        if (idx > -1) {
            reached = Math.max(reached, idx + 1);
            const last = stops[reached - 1];
            const node = last.querySelector('.timeline-node');
            const height = last.offsetTop + node.offsetTop + node.offsetHeight / 2;
            timeline.style.setProperty('--progress', `${height}px`);
        }
    };

    if ('IntersectionObserver' in window && !reduced.matches) {
        // Stagger siblings within the same grid so cards cascade in.
        document.querySelectorAll('.services-grid, .cert-grid, .skills-grid').forEach(grid => {
            [...grid.children].forEach((child, i) => child.style.setProperty('--d', i % 8));
        });
        const io = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { markVisible(entry.target); io.unobserve(entry.target); }
        }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(markVisible);
    }

    /* ---------- 3D tilt + glare on cards ---------- */
    document.querySelectorAll('.card3d').forEach(card => {
        let frame = 0;
        card.addEventListener('pointermove', event => {
            if (!canAnimate()) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const r = card.getBoundingClientRect();
                const x = (event.clientX - r.left) / r.width;
                const y = (event.clientY - r.top) / r.height;
                card.classList.add('is-tilting');
                card.style.setProperty('--ry', `${(x - .5) * 12}deg`);
                card.style.setProperty('--rx', `${(.5 - y) * 10}deg`);
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
            });
        });
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(frame);
            card.classList.remove('is-tilting');
            card.style.removeProperty('--rx');
            card.style.removeProperty('--ry');
        });
    });

    /* ---------- Hero portrait turns toward the pointer ---------- */
    const stage = document.querySelector('[data-tilt-stage]');
    const portrait = document.querySelector('[data-tilt-card]');
    if (stage && portrait) {
        const hero = stage.closest('.hero');
        let frame = 0;
        hero.addEventListener('pointermove', event => {
            if (!canAnimate()) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const r = stage.getBoundingClientRect();
                const x = (event.clientX - (r.left + r.width / 2)) / innerWidth;
                const y = (event.clientY - (r.top + r.height / 2)) / innerHeight;
                portrait.style.setProperty('--ry', `${-10 + x * 30}deg`);
                portrait.style.setProperty('--rx', `${2 - y * 14}deg`);
            });
        });
        hero.addEventListener('pointerleave', () => {
            portrait.style.removeProperty('--rx');
            portrait.style.removeProperty('--ry');
        });
    }

    /* ---------- Testimonials: 3D coverflow carousel ---------- */
    const track = document.querySelector('[data-carousel]');
    if (track) {
        const prev = document.querySelector('[data-carousel-prev]');
        const next = document.querySelector('[data-carousel-next]');
        const slides = [...track.children];
        let frame = 0;

        const update = () => {
            const max = track.scrollWidth - track.clientWidth;
            prev.disabled = track.scrollLeft < 4;
            next.disabled = track.scrollLeft > max - 4;
            if (reduced.matches) return;
            const anchor = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).scrollPaddingLeft || 0);
            slides.forEach(slide => {
                const r = slide.getBoundingClientRect();
                const d = Math.max(-1.5, Math.min(1.5, (r.left - anchor) / r.width));
                slide.style.setProperty('--cf-ry', `${-d * 14}deg`);
                slide.style.setProperty('--cf-s', `${1 - Math.min(Math.abs(d), 1) * .06}`);
                slide.style.setProperty('--cf-o', `${1 - Math.min(Math.abs(d), 1.2) * .35}`);
            });
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
        const step = dir => {
            const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
            track.scrollBy({ left: dir * (slides[0].offsetWidth + gap), behavior: reduced.matches ? 'auto' : 'smooth' });
        };
        prev.addEventListener('click', () => step(-1));
        next.addEventListener('click', () => step(1));
        track.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        });
        track.addEventListener('scroll', schedule, { passive: true });
        new ResizeObserver(schedule).observe(track);
        update();
    }

    /* ---------- Footer year ---------- */
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
})();
