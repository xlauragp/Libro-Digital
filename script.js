$(function() {
    // Initialize the booklet
    $('#mybook').booklet({
        width: 800,
        height: 500,
        autoCenter: true,
        pageNumbers: true,
        next: '#next',
        prev: '#prev'
    });

    // Button for the hospital page link
    $('#hospital-btn').on('click', function() {
        window.location.href = 'https://hospitalinfantil.org/';
    });
});
