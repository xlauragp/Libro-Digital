$(document).ready(function () {
    $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true,
        display: 'double',
        elevation: 50,
        gradients: true,
        when: {
            turned: function (e, page) {
                console.log('Current view: ', $(this).turn('view'));
            }
        }
    });

    document.getElementById('hospital-page').addEventListener('click', () => {
        window.open('https://hospitalinfantil.org/', '_blank');
    });

    // Inicialización del canvas de resaltado
    const canvas = new fabric.Canvas('highlight-canvas', {
        isDrawingMode: true,
        backgroundColor: 'rgba(0,0,0,0)',
    });

    canvas.setHeight(document.getElementById('flipbook').clientHeight);
    canvas.setWidth(document.getElementById('flipbook').clientWidth);

    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = 'yellow';

    // Redimensionar el canvas cuando se cambia el tamaño del libro
    $(window).resize(function () {
        canvas.setHeight(document.getElementById('flipbook').clientHeight);
        canvas.setWidth(document.getElementById('flipbook').clientWidth);
    });
});
