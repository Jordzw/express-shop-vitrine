let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

$('.click').click(function() {
    if ($('span').hasClass("fa-star")) {
        $('.click').removeClass('active')
        setTimeout(function() {
            $('.click').removeClass('active-2')
        }, 30)
        $('.click').removeClass('active-3')
        setTimeout(function() {
            $('span').removeClass('fa-star')
            $('span').addClass('fa-star-o')
        }, 15)
    } else {
        $('.click').addClass('active')
        $('.click').addClass('active-2')
        setTimeout(function() {
            $('span').addClass('fa-star')
            $('span').removeClass('fa-star-o')
        }, 150)
        setTimeout(function() {
            $('.click').addClass('active-3')
        }, 150)
        $('.info').addClass('info-tog')
        setTimeout(function() {
            $('.info').removeClass('info-tog')
        }, 1000)
    }
})