document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const filename = document.getElementById('filename');
    const fileOptions = document.getElementById('file-options');
    const formatOptions = document.getElementById('format-options');
    const fontSizeOptions = document.getElementById('font-size-options');
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const showCodeButton = document.getElementById('show-code');
    const addLinkButton = document.getElementById('add-link');
    const buttons = document.querySelectorAll('.btn-toolbar button');

    const applyStyle = (style, value = null) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style[style] = value;

        // Wrap selected text in the styled span
        range.surroundContents(span);
    };

    const handleFileActions = (action) => {
        const currentFilename = filename.value || 'untitled';
        if (action === 'new') {
            content.innerHTML = '';
            filename.value = 'untitled';
        } else if (action === 'txt') {
            const blob = new Blob([content.innerText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentFilename}.txt`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (action === 'pdf') {
            html2pdf().set({ filename: `${currentFilename}.pdf` }).from(content).save();
        }
    };

    const addLink = () => {
        const url = prompt('Insert URL:');
        if (url) {
            applyStyle('textDecoration', 'underline');
            applyStyle('color', 'blue');

            const selection = window.getSelection();
            if (selection.rangeCount) {
                const range = selection.getRangeAt(0);
                const a = document.createElement('a');
                a.href = url;
                a.textContent = selection.toString();
                range.deleteContents();
                range.insertNode(a);
            }
        } else {
            alert('Invalid URL.');
        }
    };

    let isCodeViewActive = false;
    showCodeButton.addEventListener('click', () => {
        isCodeViewActive = !isCodeViewActive;
        if (isCodeViewActive) {
            content.textContent = content.innerHTML;
            content.setAttribute('contenteditable', 'false');
        } else {
            content.innerHTML = content.textContent;
            content.setAttribute('contenteditable', 'true');
        }
    });

    // File handling
    fileOptions.addEventListener('change', (e) => {
        handleFileActions(e.target.value);
        e.target.selectedIndex = 0;
    });

    // Formatting options
    formatOptions.addEventListener('change', (e) => {
        const tag = e.target.value;
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const element = document.createElement(tag);
        range.surroundContents(element);

        e.target.selectedIndex = 0;
    });

    fontSizeOptions.addEventListener('change', (e) => {
        applyStyle('fontSize', `${e.target.value}px`);
        e.target.selectedIndex = 0;
    });

    // Handle colors  
    textColor.addEventListener('input', (e) => {
        applyInlineStyle('color', e.target.value);
    });
    
    bgColor.addEventListener('input', (e) => {
        applyInlineStyle('backgroundColor', e.target.value);
    });
    
    const applyInlineStyle = (style, value) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
    
        if (range.collapsed) {
            // Handle collapsed selection
            const placeholderSpan = document.createElement('span');
            placeholderSpan.style[style] = value;
            placeholderSpan.textContent = '\u200B'; // Zero-width space
            range.insertNode(placeholderSpan);
    
            // Adjust selection to stay within the placeholder span
            range.selectNodeContents(placeholderSpan);
            selection.removeAllRanges();
            selection.addRange(range);
    
            return; // Exit after handling the collapsed selection
        }
    
        const span = document.createElement('span');
        span.style[style] = value;
    
        // Handle text content in range
        if (range.startContainer === range.endContainer) {
            // Same container: wrap in a span
            const text = range.extractContents();
            span.appendChild(text);
            range.insertNode(span);
        } else {
            // Across multiple nodes: apply styles iteratively
            const contents = range.cloneContents();
            const fragments = Array.from(contents.childNodes);
            range.deleteContents();
    
            fragments.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Wrap text nodes in a styled span
                    const styledSpan = span.cloneNode();
                    styledSpan.textContent = node.textContent;
                    range.insertNode(styledSpan);
                    range.setStartAfter(styledSpan);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Recursively apply styles to elements
                    node.style[style] = value;
                    range.insertNode(node);
                    range.setStartAfter(node);
                }
            });
        }
    };
    
    // Toolbar buttons
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;

            if (command === 'bold') {
                applyStyle('fontWeight', 'bold');
            } else if (command === 'italic') {
                applyStyle('fontStyle', 'italic');
            } else if (command === 'underline') {
                applyStyle('textDecoration', 'underline');
            }

            // Highlight the active button
            buttons.forEach(btn => btn.classList.remove('highlight'));
            button.classList.add('highlight');
        });
    });

    // Add link
    addLinkButton.addEventListener('click', addLink);
});
