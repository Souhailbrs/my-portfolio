(() => {
    'use strict';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    const syncMotion = () => {
        document.body.classList.toggle('motion-paused', paused);
    };
    reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); });
    const portrait = document.querySelector('.portrait-technologies');
    const trigger = portrait.querySelector('.portrait-trigger');
    const stack = portrait.querySelector('.portrait-stack');
    const showStack = show => {
        portrait.classList.toggle('stack-visible', show);
        trigger.setAttribute('aria-expanded', String(show));
        trigger.setAttribute('aria-label', show ? 'Hide technologies I use' : 'Show technologies I use');
        stack.setAttribute('aria-hidden', String(!show));
    };
    portrait.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') showStack(true);
    });
    portrait.addEventListener('pointerleave', event => {
        if (event.pointerType === 'mouse') showStack(false);
    });
    trigger.addEventListener('focus', () => {
        if (trigger.matches(':focus-visible')) showStack(true);
    });
    trigger.addEventListener('blur', () => showStack(false));
    trigger.addEventListener('click', () => showStack(trigger.getAttribute('aria-expanded') !== 'true'));
    trigger.addEventListener('keydown', event => {
        if (event.key === 'Escape') showStack(false);
    });
    const revealItems = document.querySelectorAll('.hero-copy > *, .service-card, .skills-grid .item, .roadmap-stop, .certification-card');
    let reachedMilestone = 0;
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.matches('.roadmap-stop')) {
                    reachedMilestone = Math.max(reachedMilestone, Number(entry.target.dataset.milestone));
                    entry.target.closest('.roadmap-list').style.setProperty('--roadmap-progress', `${reachedMilestone / 4 * 100}%`);
                }
                observer.unobserve(entry.target);
            }
        }), { threshold: .12 });
        revealItems.forEach(item => { item.classList.add('motion-reveal'); observer.observe(item); });
    }
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const ideaBridge = document.querySelector('.idea-bridge');
    document.querySelectorAll('.certification-card').forEach((card, index) => {
        card.style.setProperty('--card-delay', `${index * 120}ms`);
        new IntersectionObserver(([entry]) => card.classList.toggle('in-view', entry.isIntersecting)).observe(card);
    });
    if (ideaBridge && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            ideaBridge.classList.toggle('in-view', entry.isIntersecting);
        }).observe(ideaBridge);
    }
    document.querySelectorAll('.service-card, .certification-card').forEach(card => {
        card.classList.add('motion-card');
        card.addEventListener('pointermove', event => {
            if (paused || !finePointer.matches) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * 9}deg`);
            card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 9}deg`);
        });
        card.addEventListener('pointerleave', () => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); });
    });
    const track = document.querySelector('.swiper-wrapper');
    const previous = document.querySelector('.swiper-button-prev');
    const next = document.querySelector('.swiper-button-next');
    const updateControls = () => {
        previous.disabled = track.scrollLeft < 5;
        next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 5;
    };
    [previous, next].forEach((button, index) => button.addEventListener('click', () => {
        const step = track.querySelector('.swiper-slide').getBoundingClientRect().width + 30;
        track.scrollBy({left: step * (index ? 1 : -1), behavior: paused ? 'instant' : 'smooth'});
    }));
    track.addEventListener('scroll', updateControls, {passive: true});
    new ResizeObserver(updateControls).observe(track);
    document.addEventListener('visibilitychange', () => {
        paused = reduced.matches || document.hidden;
        syncMotion();
    });
    syncMotion();
})();
