$(function() {
    $('#mybook').booklet({
        width: 800,
        height: 600,
        auto: false,
        closed: true,
        covers: true,
        pagePadding: 10
    });

    $('#chapter-select').on('change', function() {
        const selectedPage = $(this).val();
        // Navegar a la página correspondiente
        $('#mybook').booklet("gotopage", selectedPage);
    });
});
