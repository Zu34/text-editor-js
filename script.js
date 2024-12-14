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

    


    const formatDoc = (command, value = null) => {
        document.execCommand(command, false, value);
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
            formatDoc('createLink', url);
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
        formatDoc('formatBlock', e.target.value);
        e.target.selectedIndex = 0;
    });

    fontSizeOptions.addEventListener('change', (e) => {
        formatDoc('fontSize', e.target.value);
        e.target.selectedIndex = 0;
    });

    // Color pickers
    textColor.addEventListener('input', (e) => {
        formatDoc('foreColor', e.target.value);
    });

    bgColor.addEventListener('input', (e) => {
        formatDoc('hiliteColor', e.target.value);
    });

    // Toolbar buttons
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;

            // Apply format
            if (command) formatDoc(command);

            // Highlight the active button
            buttons.forEach(btn => btn.classList.remove('highlight')); // Remove highlight from all buttons
            button.classList.add('highlight'); // Add highlight to the clicked button
        });
    });

    // Add link
    addLinkButton.addEventListener('click', addLink);
});
