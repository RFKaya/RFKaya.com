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
});
