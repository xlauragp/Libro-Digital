const url = './libro.pdf';
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
    canvasLeft = document.querySelector('#pdf-render-left'),
    ctxLeft = canvasLeft.getContext('2d'),
    canvasRight = document.querySelector('#pdf-render-right'),
    ctxRight = canvasRight.getContext('2d');

// Cargar el documento PDF
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
});

// Renderizar la página
function renderPage(num) {
    pageIsRendering = true;
    // Si estamos en la primera página, solo mostramos la portada
    if (num === 1) {
        canvasRight.style.display = 'none';
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale });
            canvasLeft.height = viewport.height;
            canvasLeft.width = viewport.width;

            const renderCtx = {
                canvasContext: ctxLeft,
                viewport
            };

            page.render(renderCtx).promise.then(() => {
                pageIsRendering = false;
                if (pageNumIsPending !== null) {
                    renderPage(pageNumIsPending);
                    pageNumIsPending = null;
                }
            });

            document.querySelector('#page-num').textContent = num;
        });
    } else {
        // Mostrar dos páginas a la vez
        canvasRight.style.display = 'block';
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale });
            canvasLeft.height = viewport.height;
            canvasLeft.width = viewport.width;

            const renderCtx = {
                canvasContext: ctxLeft,
                viewport
            };

            page.render(renderCtx).promise.then(() => {
                pageIsRendering = false;
                if (pageNumIsPending !== null) {
                    renderPage(pageNumIsPending);
                    pageNumIsPending = null;
                }
            });
        });

        if (num + 1 <= pdfDoc.numPages) {
            pdfDoc.getPage(num + 1).then(page => {
                const viewport = page.getViewport({ scale });
                canvasRight.height = viewport.height;
                canvasRight.width = viewport.width;

                const renderCtx = {
                    canvasContext: ctxRight,
                    viewport
                };

                page.render(renderCtx).promise.then(() => {
                    pageIsRendering = false;
                });
            });
        }
        document.querySelector('#page-num').textContent = num;
    }
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
    pageNum = pageNum === 2 ? 1 : pageNum - 2;
    queueRenderPage(pageNum);
}

// Mostrar página siguiente
function nextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum = pageNum === 1 ? 2 : pageNum + 2;
    queueRenderPage(pageNum);
}

// Añadir manejadores de eventos para los botones de navegación
document.getElementById('prev-page').addEventListener('click', previousPage);
document.getElementById('next-page').addEventListener('click', nextPage);

// Resaltar el texto seleccionado en la página
document.addEventListener('mouseup', function () {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.backgroundColor = 'yellow';
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }
});
