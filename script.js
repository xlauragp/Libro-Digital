$(document).ready(function() {
    // Inicializar el Booklet
    $('#mybook').booklet({
        width: 800,
        height: 600,
        autoCenter: true,
        speed: 600,
        direction: 'LTR',
        pagePadding: 10,
        pageNumbers: true,
        chapterSelector: true,
        shadows: true,
        shadowTopFwdWidth: 80,
        shadowTopBackWidth: 80,
        shadowBtmWidth: 80,
    });

    // Botón para abrir página del hospital en una nueva ventana
    document.getElementById('hospital-page').addEventListener('click', () => {
        window.open('https://hospitalinfantil.org/', '_blank');
    });
});
