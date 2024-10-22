$(document).ready(function() {
    $("#flipbook").turn({
        width: 800,
        height: 600,
        autoCenter: true,
        display: 'double',
        elevation: 50,
        gradients: true,
        when: {
            turned: function(e, page) {
                $("#page-num").text(page);
            }
        }
    });

    // Total page count
    $("#page-count").text($("#flipbook").turn("pages"));

    // Previous page button
    $("#prev-page").click(function() {
        $("#flipbook").turn("previous");
    });

    // Next page button
    $("#next-page").click(function() {
        $("#flipbook").turn("next");
    });

    // Highlighting feature
    $(document).mouseup(function() {
        var selection = window.getSelection();
        if (selection.toString().length > 0) {
            var range = selection.getRangeAt(0);
            var span = document.createElement("span");
            span.className = "highlight";
            span.appendChild(range.extractContents());
            range.insertNode(span);
        }
    });
});
