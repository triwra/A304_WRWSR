//var scores = document.querySelector(".section_score_wrapper");
//var bar = document.querySelector(".section_score_bar");
//var nums = document.querySelector(".section_score_num");



//document.addEventListener("DOMContentLoaded", function (event) {
//    entrance();
//});

//function entrance() {
//    bar.classList.add("active");
//    scores.classList.add("active");
//    scores.addEventListener("transitionend webkitTransitionend", function () {
//        nums.style['opacity'] = '1';
//        bar.style['transition-delay'] = '0';
//    });
//}




var scores = $(".section_score_wrapper");
var bar = $(".section_score_bar");
var nums = $(".section_score_num");

$(document).ready(function () {
    entrance();
});

function entrance() {
    bar.addClass("active");
    scores.addClass("active");
    scores.on("transitionend webkitTransitionend", function () {
        nums.css("opacity", "1");
        bar.css("transition-delay", "0");
    });
}
