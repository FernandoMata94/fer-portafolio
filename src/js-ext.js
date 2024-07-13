$(document).ready(function(){
    $('.slider').slick({
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        slidesToScroll: 1
    });
  });


  const observer =  new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if (entry.isIntersecting){
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    })
  })

  const hiddenElements = document.querySelectorAll('.hidden, .purple');
  hiddenElements.forEach((el) => observer.observe(el));