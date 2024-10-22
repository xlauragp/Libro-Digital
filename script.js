const url = './libro.pdf';

let pdfDoc = null,
    currentPage = 1,
    totalPages = 0;

const scale = 1.5,
      canvas = document.getElementById('pdf-render'),
      ctx = canvas.getContext('2d');

// Set the workerSrc for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    totalPages = pdfDoc.numPages;
    document.getElementById('page-count').textContent = totalPages;
    renderPage(currentPage);
}).catch(err => {
    console.error('Error loading PDF:', err);
    canvas.textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Render the page
const renderPage = num => {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            document.getElementById('page-num').textContent = num;
        });
    }).catch(err => {
        console.error('Error rendering page:', err);
    });
};

// Button Events
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage <= 1) {
        return;
    }
    currentPage--;
    renderPage(currentPage);
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage >= totalPages) {
        return;
    }
    currentPage++;
    renderPage(currentPage);
});
