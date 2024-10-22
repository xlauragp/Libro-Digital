const url = './libro.pdf';
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
    canvasLeft = document.querySelector('#pdf-render-left'),
    canvasRight = document.querySelector('#pdf-render-right');

// Cargar el documento PDF
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
});

// Renderizar las páginas
function renderPage(num) {
    pageIsRendering = true;

    // Renderizar página izquierda
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        if (num % 2 === 0) {
            canvasRight.innerHTML = '';
            canvasRight.appendChild(canvas);
        } else {
            canvasLeft.innerHTML = '';
            canvasLeft.appendChild(canvas);
        }
    });

    document.querySelector('#page-num').textContent = num;
}

// Colocar en cola la página para renderizar
function queueRenderPage(num) {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
}

// Mostrar página anterior
function previousPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum -= 2;
    if (pageNum < 1) pageNum = 1;
    queueRenderPage(pageNum);
}

// Mostrar página siguiente
function nextPage() {
    if (pageNum + 1 >= pdfDoc.numPages) {
        return;
    }
    pageNum += 2;
    queueRenderPage(pageNum);
}

// Añadir manejadores de eventos para los botones de navegación
document.getElementById('prev-page').addEventListener('click', previousPage);
document.getElementById('next-page').addEventListener('click', nextPage);

// Inicializar el efecto de pase de página con turn.js
$(document).ready(function() {
    $('#flipbook').turn({
        width: 800,
        height: 500,
        autoCenter: true
    });
});
