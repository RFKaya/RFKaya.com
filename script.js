const typedText = document.getElementById('typewriter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typedText && !reducedMotion) {
    const phrases = [
        'Siber Güvenlik',
        'Yazılım Geliştirme',
        'Full Stack Geliştirme',
        'Backend Geliştirme',
        'Ağ Güvenliği',
        'REST API',
        'Asenkron Programlama',
        'Parola Güvenliği',
        'Web Scraping',
        'Otomasyon',
        'Discord Botları',
        'Linux & Docker'
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    typedText.textContent = '';

    function typeNextCharacter() {
        const phrase = phrases[phraseIndex];
        characterIndex += deleting ? -1 : 1;
        typedText.textContent = phrase.slice(0, characterIndex);

        if (!deleting && characterIndex === phrase.length) {
            deleting = true;
            setTimeout(typeNextCharacter, 1700);
            return;
        }

        if (deleting && characterIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeNextCharacter, 380);
            return;
        }

        setTimeout(typeNextCharacter, deleting ? 48 : 90);
    }

    setTimeout(typeNextCharacter, 400);
}

const technologyViewport = document.querySelector('.technology-viewport');
const technologyTrack = document.querySelector('.technology-track');
const originalIcons = technologyTrack?.querySelector('.language-icons');

if (technologyViewport && technologyTrack && originalIcons) {
    const leadingIcons = originalIcons.cloneNode(true);
    const trailingIcons = originalIcons.cloneNode(true);
    leadingIcons.setAttribute('aria-hidden', 'true');
    trailingIcons.setAttribute('aria-hidden', 'true');
    technologyTrack.prepend(leadingIcons);
    technologyTrack.append(trailingIcons);

    let cycleWidth = 0;
    let dragging = false;
    let lastPointerX = 0;
    let lastFrame = performance.now();
    let remainingDistance = 0;

    function measureTrack() {
        const gap = parseFloat(getComputedStyle(technologyTrack).gap) || 0;
        cycleWidth = originalIcons.getBoundingClientRect().width + gap;
        technologyViewport.scrollLeft = cycleWidth;
    }

    function wrapScroll() {
        if (!cycleWidth) return;
        if (technologyViewport.scrollLeft < cycleWidth / 2) {
            technologyViewport.scrollLeft += cycleWidth;
        } else if (technologyViewport.scrollLeft > cycleWidth * 1.5) {
            technologyViewport.scrollLeft -= cycleWidth;
        }
    }

    technologyViewport.addEventListener('scroll', wrapScroll, { passive: true });
    technologyViewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.pointerType === 'mouse') event.preventDefault();
        dragging = true;
        lastPointerX = event.clientX;
        technologyViewport.classList.add('is-dragging');
        technologyViewport.setPointerCapture(event.pointerId);
    });
    technologyViewport.addEventListener('dragstart', (event) => event.preventDefault());
    technologyViewport.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        technologyViewport.scrollLeft -= event.clientX - lastPointerX;
        lastPointerX = event.clientX;
    });

    function stopDragging() {
        dragging = false;
        technologyViewport.classList.remove('is-dragging');
    }

    technologyViewport.addEventListener('pointerup', stopDragging);
    technologyViewport.addEventListener('pointercancel', stopDragging);
    technologyViewport.addEventListener('lostpointercapture', stopDragging);
    window.addEventListener('resize', measureTrack);

    function advanceTrack(now) {
        const elapsed = Math.min(now - lastFrame, 64);
        lastFrame = now;
        const hovered = matchMedia('(hover: hover)').matches && technologyViewport.matches(':hover');
        if (!reducedMotion && !hovered && !dragging && document.visibilityState === 'visible') {
            remainingDistance += elapsed * 0.018;
            if (remainingDistance >= 1) {
                const pixels = Math.floor(remainingDistance);
                remainingDistance -= pixels;
                technologyViewport.scrollLeft += pixels;
                wrapScroll();
            }
        }
        requestAnimationFrame(advanceTrack);
    }

    measureTrack();
    requestAnimationFrame(advanceTrack);
}

const projectGrid = document.querySelector('.project-grid');

if (projectGrid) {
    const projects = [...projectGrid.querySelectorAll('.project')];
    let activeProject = null;
    let placeholder = null;
    let panelAnimation = null;
    let contentAnimation = null;
    let gridAnimation = null;
    let naturalHeight = 0;
    let openHeight = 0;
    let expanding = false;

    projectGrid.classList.add('is-enhanced');

    function frameFromRect(rect) {
        const gridRect = projectGrid.getBoundingClientRect();
        return { left: rect.left - gridRect.left, top: rect.top - gridRect.top, width: rect.width, height: rect.height };
    }

    function frameFromStyle(project) {
        const style = getComputedStyle(project);
        return { left: parseFloat(style.left), top: parseFloat(style.top), width: parseFloat(style.width), height: parseFloat(style.height) };
    }

    function keyframe(frame) {
        return { left: `${frame.left}px`, top: `${frame.top}px`, width: `${frame.width}px`, height: `${frame.height}px` };
    }

    function measureHeights() {
        projectGrid.style.minHeight = '';
        naturalHeight = projectGrid.getBoundingClientRect().height;
        openHeight = Math.max(naturalHeight, activeProject.scrollHeight);
    }

    function animatePanel(toOpen, initialFrame, initialOpacity) {
        const project = activeProject;
        const details = project.querySelector('.project-details');
        const currentFrame = initialFrame || frameFromStyle(project);
        const currentOpacity = initialOpacity ?? parseFloat(getComputedStyle(details).opacity);
        const slotFrame = frameFromRect(placeholder.getBoundingClientRect());
        const gridRect = projectGrid.getBoundingClientRect();
        const fullFrame = { left: 0, top: 0, width: gridRect.width, height: openHeight };
        const targetFrame = toOpen ? fullFrame : slotFrame;
        const dimensions = ['left', 'top', 'width', 'height'];
        const range = Math.max(1, ...dimensions.map((dimension) => Math.abs(fullFrame[dimension] - slotFrame[dimension])));
        const distance = Math.max(...dimensions.map((dimension) => Math.abs(currentFrame[dimension] - targetFrame[dimension])));
        const duration = Math.max(90, Math.min(340, 340 * distance / range));

        const timing = { duration, fill: 'both', easing: 'cubic-bezier(.16, 1, .3, 1)' };

        panelAnimation?.cancel();
        contentAnimation?.cancel();
        gridAnimation?.cancel();
        expanding = toOpen;
        const animation = project.animate([keyframe(currentFrame), keyframe(targetFrame)], timing);
        panelAnimation = animation;
        gridAnimation = projectGrid.animate([
            { minHeight: `${gridRect.height}px` },
            { minHeight: `${toOpen ? openHeight : naturalHeight}px` }
        ], timing);
        contentAnimation = details.animate([
            { opacity: currentOpacity },
            { opacity: toOpen ? 1 : 0 }
        ], { duration: Math.min(duration, 200), fill: 'both', easing: 'ease-out' });

        animation.onfinish = () => {
            if (panelAnimation !== animation) return;
            if (!toOpen) {
                finishClosing();
            } else {
                panelAnimation.cancel();
                contentAnimation.cancel();
                gridAnimation.cancel();
                measureHeights();
                projectGrid.style.minHeight = `${openHeight}px`;
                panelAnimation = null;
                contentAnimation = null;
                gridAnimation = null;
                if (window.innerWidth <= 650) projectGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
    }

    function finishClosing() {
        const project = activeProject;
        panelAnimation?.cancel();
        contentAnimation?.cancel();
        gridAnimation?.cancel();
        panelAnimation = null;
        contentAnimation = null;
        gridAnimation = null;
        projectGrid.style.minHeight = '';
        project.open = false;
        placeholder.remove();
        placeholder = null;
        activeProject = null;
        expanding = false;
        projects.forEach((other) => { other.inert = false; });
        project.querySelector('summary').focus({ preventScroll: true });
        if (window.innerWidth <= 650) {
            project.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest' });
        }
    }

    function expandProject(project, index) {
        const initialFrame = frameFromRect(project.getBoundingClientRect());
        placeholder = document.createElement('div');
        placeholder.className = `project-placeholder${index >= 2 ? ' is-compact' : ''}`;
        placeholder.setAttribute('aria-hidden', 'true');
        project.before(placeholder);
        project.open = true;
        activeProject = project;
        expanding = true;
        projects.forEach((other) => { if (other !== project) other.inert = true; });
        measureHeights();

        if (reducedMotion) {
            projectGrid.style.minHeight = `${openHeight}px`;
            if (window.innerWidth <= 650) projectGrid.scrollIntoView({ block: 'start' });
            return;
        }

        animatePanel(true, initialFrame, 0);
    }

    function reverseProject() {
        if (reducedMotion) return finishClosing();
        animatePanel(!expanding);
    }

    projects.forEach((project, index) => {
        project.querySelector('summary').addEventListener('click', (event) => {
            event.preventDefault();
            if (project === activeProject) reverseProject();
            else if (!activeProject) expandProject(project, index);
        });
        project.addEventListener('click', (event) => {
            if (project === activeProject && !event.target.closest('summary, a')) reverseProject();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeProject && expanding) reverseProject();
    });

    window.addEventListener('resize', () => {
        if (!activeProject || panelAnimation) return;
        measureHeights();
        projectGrid.style.minHeight = `${openHeight}px`;
    });
}

const yearLabel = document.getElementById('year');
if (yearLabel) yearLabel.textContent = new Date().getFullYear();

const footerMark = document.querySelector('.footer-mark');

if (footerMark) {
    const layers = footerMark.querySelectorAll('[data-mark]');
    const word = layers[0].textContent;
    const glyphs = '01<>/\{}[]#$%&*+=?!';
    let state = 'shown';
    let run = 0;

    function setText(text) {
        layers.forEach((layer) => { layer.textContent = text; });
    }

    function scramble(revealed = 0) {
        return [...word].map((char, index) => (
            index < revealed ? char : glyphs[Math.floor(Math.random() * glyphs.length)]
        )).join('');
    }

    function hide() {
        run++;
        state = 'hidden';
        setText(scramble());
    }

    function decode() {
        if (state !== 'hidden') return;
        state = 'decoding';
        const current = ++run;
        const duration = 1000;
        const start = performance.now();
        let lastSwap = 0;
        function step(now = start) {
            if (current !== run) return;
            const progress = (now - start) / duration;
            if (progress >= 1) {
                setText(word);
                state = 'shown';
                return;
            }
            if (now - lastSwap > 45) {
                lastSwap = now;
                setText(scramble(Math.floor(progress * word.length)));
            }
            requestAnimationFrame(step);
        }
        step();
    }

    if (!reducedMotion) {
        hide();
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) hide();
            else if (entry.intersectionRatio >= .5) decode();
        }, { threshold: [0, .5] });
        observer.observe(footerMark);
    }

    footerMark.parentElement.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const rect = footerMark.getBoundingClientRect();
        footerMark.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        footerMark.style.setProperty('--my', `${event.clientY - rect.top}px`);
        footerMark.classList.add('is-lit');
    });
    footerMark.parentElement.addEventListener('pointerleave', () => {
        footerMark.classList.remove('is-lit');
    });
}
