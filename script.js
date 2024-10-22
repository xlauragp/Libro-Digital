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

    // Render each page
    const renderPromises = [];
    for (let num = 1; num <= pdfDoc.numPages; num++) {
        renderPromises.push(renderPage(num));
    }

    // Wait for all pages to be rendered before initializing Turn.js
    Promise.all(renderPromises).then(() => {
        $('#flipbook').turn({
            width: 800,
            height: 600,
            autoCenter: true
        });
    });
}).catch(err => {
    console.error('Error loading PDF:', err);
    document.getElementById('flipbook').textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Render the page
const renderPage = num => {
    return new Promise((resolve, reject) => {
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
                // Añadir la página al flipbook
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                pageDiv.appendChild(canvas);
                document.getElementById('flipbook').appendChild(pageDiv);
                resolve();
            }).catch(err => {
                console.error('Error rendering page:', err);
                reject(err);
            });
        }).catch(err => {
            console.error('Error getting page:', err);
            reject(err);
        });
    });
};

// Button Events
document.getElementById('prev-page').addEventListener('click', () => {
    $('#flipbook').turn('previous');
});

document.getElementById('next-page').addEventListener('click', () => {
    $('#flipbook').turn('next');
});
