const url = './libro.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

document.getElementById('pdf-render').appendChild(canvas);

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
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
        }).catch(err => {
            console.error('Error rendering page:', err);
        });

        // Output current page
        document.getElementById('page-num').textContent = num;
    }).catch(err => {
        console.error('Error getting page:', err);
    });
};

// Check for pages rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Show Prev Page
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
}).catch(err => {
    console.error('Error loading PDF:', err);
    document.getElementById('pdf-render').textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Button Events
document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);
