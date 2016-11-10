$(document).ready(function() {

        //countTo

        $('.timer').countTo();

        //owl carousel

        $("#news-feed").owlCarousel({
            navigation : true,
            slideSpeed : 300,
            paginationSpeed : 400,
            singleItem : true,
            autoPlay:true
        });
    });

//$(window).on("resize",function(){
//    var owl = $("#news-feed").data("owlCarousel");
//    owl.reinit();
//});