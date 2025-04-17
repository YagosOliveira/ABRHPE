document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".news-carousel");
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");
    const newsCards = document.querySelectorAll(".news-card");
    
    let index = 0;
    const visibleCards = 3; // Número de cards visíveis
    const totalCards = newsCards.length;
    const cardWidth = newsCards[0].offsetWidth + 20; // Largura do card + gap

    function updateCarousel() {
        carousel.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    nextButton.addEventListener("click", function () {
        if (index < totalCards - visibleCards) {
            index++;
        } else {
            index = 0; // Retorna ao início
        }
        updateCarousel();
    });

    prevButton.addEventListener("click", function () {
        if (index > 0) {
            index--;
        } else {
            index = totalCards - visibleCards; // Vai para o final
        }
        updateCarousel();
    });

    // Auto play
    setInterval(() => {
        nextButton.click();
    }, 5000);
});

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("abrh-toggle");
    const submenu = document.getElementById("abrh-submenu");

    toggle.addEventListener("click", function (e) {
        e.preventDefault(); // Impede redirecionamento
        submenu.classList.toggle("show");
    });

    // Opcional: fecha se clicar fora
    document.addEventListener("click", function (e) {
        if (!toggle.contains(e.target) && !submenu.contains(e.target)) {
            submenu.classList.remove("show");
        }
    });
});