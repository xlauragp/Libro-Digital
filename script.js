const url = './libro.pdf';

let pdfDoc = null,
    currentPage = 1,
    totalPages = 0;

const scale = 1.5;

// Set the workerSrc for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    totalPages = pdfDoc.numPages;
    document.getElementById('page-count').textContent = totalPages;

    // Initialize Turn.js with two pages visible
    $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true,
        display: 'double'
    });

    // Render the first page (cover)
    renderPages(currentPage);
}).catch(err => {
    console.error('Error loading PDF:', err);
    document.getElementById('flipbook').textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Render the pages
const renderPages = num => {
    // Clear the flipbook before adding new pages
    $('#flipbook').turn('destroy');
    $('#flipbook').html('');
    $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true,
        display: 'double'
    });

    // Add two pages at a time (current and next)
    for (let i = 0; i < 2 && num + i <= totalPages; i++) {
        pdfDoc.getPage(num + i).then(page => {
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

                $('#flipbook').turn('addPage', pageDiv, num + i);
            }).catch(err => {
                console.error('Error rendering page:', err);
            });
        }).catch(err => {
            console.error('Error getting page:', err);
        });
    }
};

// Button Events
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 2;
        renderPages(currentPage);
        document.getElementById('page-num').textContent = currentPage;
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage += 2;
        renderPages(currentPage);
        document.getElementById('page-num').textContent = currentPage;
    }
});
