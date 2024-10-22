const url = './libro.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5;

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;

    for (let num = 1; num <= pdfDoc.numPages; num++) {
        renderPage(num);
    }

    // Inicializar Turn.js después de agregar todas las páginas
    $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true
    });
}).catch(err => {
    console.error('Error loading PDF:', err);
    document.getElementById('flipbook').textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

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

        // Añadir la página al flipbook
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.appendChild(canvas);
        document.getElementById('flipbook').appendChild(pageDiv);
    }).catch(err => {
        console.error('Error getting page:', err);
    });
};

// Button Events
document.getElementById('prev-page').addEventListener('click', () => {
    $('#flipbook').turn('previous');
});

document.getElementById('next-page').addEventListener('click', () => {
    $('#flipbook').turn('next');
});
