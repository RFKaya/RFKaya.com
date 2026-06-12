document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect for Title
    const titleElement = document.getElementById('typewriter');
    const textToType = "Siber Güvenlik";
    let index = 0;

    function typeWriter() {
        if (index < textToType.length) {
            titleElement.innerHTML += textToType.charAt(index);
            index++;
            setTimeout(typeWriter, 100); // typing speed
        }
    }

    // Start typing effect with a slight delay
    setTimeout(typeWriter, 500);

    const projectCards = document.querySelectorAll('.project-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    projectCards.forEach((card) => {
        const summary = card.querySelector('.project-row');
        const content = card.querySelector('.project-details');
        let isAnimating = false;

        summary.addEventListener('click', (event) => {
            event.preventDefault();

            if (isAnimating) {
                return;
            }

            if (reduceMotion) {
                card.open = !card.open;
                return;
            }

            isAnimating = true;
            const wasOpen = card.open;
            const startHeight = `${card.offsetHeight}px`;

            if (!wasOpen) {
                card.open = true;
            }

            const summaryHeight = summary.offsetHeight;
            const endHeight = wasOpen
                ? `${summaryHeight}px`
                : `${summaryHeight + content.offsetHeight}px`;

            const cardAnimation = card.animate(
                { height: [startHeight, endHeight] },
                { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
            );

            const contentAnimation = content.animate(
                wasOpen
                    ? {
                        opacity: [1, 0],
                        transform: ['translateY(0)', 'translateY(-10px)']
                    }
                    : {
                        opacity: [0, 1],
                        transform: ['translateY(-10px)', 'translateY(0)']
                    },
                { duration: 360, easing: 'ease-out', fill: 'forwards' }
            );

            cardAnimation.addEventListener('finish', () => {
                if (wasOpen) {
                    card.open = false;
                }

                contentAnimation.cancel();
                card.style.height = '';
                isAnimating = false;
            }, { once: true });
        });
    });
});
