// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Highlight selected text functionality
    document.addEventListener('mouseup', function() {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.backgroundColor = 'yellow';
            span.appendChild(range.extractContents());
            range.insertNode(span);
        }
    });

    // Open hospital page in a new tab
    document.getElementById('hospital-page').addEventListener('click', () => {
        window.open('https://hospitalinfantil.org/', '_blank');
    });
});
