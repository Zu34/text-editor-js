// Utility functions
const formatText = async (command, value = null) => {
    if (command === 'createLink' && value) {
        document.execCommand('createLink', false, value);
    } else {
        document.execCommand(command, false, value);
    }
};

// Function to handle links
const addLink = async () => {
    const url = prompt('Insert URL:');
    if (url) {
        await formatText('createLink', url);
    }
};

// Event listeners for content area
const content = document.getElementById('content');

content.addEventListener('mouseenter', async () => {
    const links = content.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            content.setAttribute('contenteditable', 'false');
            link.setAttribute('target', '_blank');
        });

        link.addEventListener('mouseleave', () => {
            content.setAttribute('contenteditable', 'true');
        });
    });
});

// Toggle HTML source code view
const showCodeButton = document.getElementById('show-code');
let isCodeViewActive = false;

showCodeButton.addEventListener('click', async () => {
    isCodeViewActive = !isCodeViewActive;
    showCodeButton.dataset.active = isCodeViewActive;

    if (isCodeViewActive) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', 'false');
    } else {
        content.innerHTML = content.textContent;
        content.setAttribute('contenteditable', 'true');
    }
});

// File handling with async/await
const filenameInput = document.getElementById('filename');

const fileHandle = async (action) => {
    const filename = filenameInput.value || 'untitled';

    if (action === 'new') {
        content.innerHTML = '';
        filenameInput.value = 'untitled';
    } else if (action === 'txt') {
        const blob = new Blob([content.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.txt`;
        link.click();
        URL.revokeObjectURL(url); // Clean up the object URL
    } else if (action === 'pdf') {
        try {
            const options = {
                filename: `${filename}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait' }
            };
            await html2pdf().set(options).from(content).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
};

// Attach file handling to dropdown
document.querySelector('.toolbar select').addEventListener('change', async (event) => {
    await fileHandle(event.target.value);
});

// Text formatting
document.querySelectorAll('.toolbar button').forEach(button => {
    button.addEventListener('click', async () => {
        const command = button.dataset.command;

        if (command === 'addLink') {
            await addLink();
        } else {
            await formatText(command);
        }
    });
});

// Font size and block formatting
document.querySelectorAll('.toolbar select').forEach(select => {
    select.addEventListener('change', async () => {
        const { command, value } = select.dataset;
        if (command) await formatText(command, value);
    });
});

// Color pickers
document.querySelectorAll('.color input').forEach(input => {
    input.addEventListener('input', async () => {
        const command = input.dataset.command;
        await formatText(command, input.value);
    });
    input.addEventListener('blur', () => {
        input.value = '#000000'; // Reset to default color
    });
});
