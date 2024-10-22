$(function() {
    $('#mybook').booklet({
        width: 500,
        height: 400,
        auto: false,
        pageNumbers: true
    });

    $('#hospital-page').click(function() {
        window.open('https://hospitalinfantil.org/', '_blank');
    });
});
