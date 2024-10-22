let currentPage = 1;

function showPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        page.classList.remove('active');
        if (index + 1 === pageNumber) {
            page.classList.add('active');
        }
    });
}

function nextPage() {
    const pages = document.querySelectorAll('.page');
    if (currentPage < pages.length) {
        currentPage++;
        showPage(currentPage);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
}

// Mostrar la primera página al cargar
showPage(currentPage);

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

