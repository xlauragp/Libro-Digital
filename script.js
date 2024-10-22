const url = './libro.pdf';
let pdfDoc = null,
    pageNum = 1;

const scale = 1.5;

// Cargar el documento PDF
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    // Renderizar la portada
    renderCoverPage();
    // Renderizar las páginas del libro en el flipbook
    renderPages();
});

// Renderizar la portada (primera página)
function renderCoverPage() {
    pdfDoc.getPage(1).then(page => {
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderCtx).promise.then(() => {
            const coverDiv = document.createElement('div');
            coverDiv.classList.add('page');
            coverDiv.appendChild(canvas);
            document.querySelector('#flipbook').appendChild(coverDiv);
        });
    });
}

// Renderizar las páginas del libro (dos páginas a la vez)
function renderPages() {
    for (let i = 2; i <= pdfDoc.numPages; i += 2) {
        const pagePromises = [pdfDoc.getPage(i)];
        if (i + 1 <= pdfDoc.numPages) {
            pagePromises.push(pdfDoc.getPage(i + 1));
        }

        Promise.all(pagePromises).then(pages => {
            const pagesDiv = document.createElement('div');
            pagesDiv.classList.add('page');

            pages.forEach(page => {
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                page.render(renderCtx).promise.then(() => {
                    pagesDiv.appendChild(canvas);
                });
            });

            document.querySelector('#flipbook').appendChild(pagesDiv);
        });
    }

    // Inicializar Turn.js después de que se hayan agregado las páginas
    $('#flipbook').turn({
        width: $('#flipbook').width(),  // Adaptable al contenedor
        height: 500,  // Altura fija pero puedes ajustar esto para que sea dinámico
        autoCenter: true,
        display: 'double'
    });
}

// Manejar la navegación entre páginas
document.getElementById('prev-page').addEventListener('click', () => {
    $('#flipbook').turn('previous');
});

document.getElementById('next-page').addEventListener('click', () => {
    $('#flipbook').turn('next');
});
