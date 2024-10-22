const url = './libro.pdf';

let pdfDoc = null,
    currentPage = 1,
    totalPages = 0;

const scale = 1.5;

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    totalPages = pdfDoc.numPages;
    document.getElementById('page-count').textContent = totalPages;

    // Initialize Turn.js with empty pages
    $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true,
        pages: totalPages
    });

    // Render the first page
    renderPage(currentPage);
}).catch(err => {
    console.error('Error loading PDF:', err);
    document.getElementById('flipbook').textContent = 'No se pudo cargar el PDF. Por favor, verifica la ruta o el archivo.';
});

// Render the page
const renderPage = num => {
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

            // Verificar si la página ya existe en el flipbook
            if ($('#flipbook').turn('hasPage', num)) {
                $('#flipbook').turn('removePage', num);
            }

            $('#flipbook').turn('addPage', pageDiv, num);
        }).catch(err => {
            console.error('Error rendering page:', err);
        });
    }).catch(err => {
        console.error('Error getting page:', err);
    });
};

// Button Events
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        $('#flipbook').turn('page', currentPage);
        renderPage(currentPage);
        document.getElementById('page-num').textContent = currentPage;
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        $('#flipbook').turn('page', currentPage);
        renderPage(currentPage);
        document.getElementById('page-num').textContent = currentPage;
    }
});
