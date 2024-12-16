## I changed The whole env of code, was checking up  Advantages of Using Async/Await

### here is a block of js code to download/save files/text
```JavaScript 
const handleFileActions = async (action) => {
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
        try {
            await html2pdf().set({ filename: `${currentFilename}.pdf` }).from(content).save();
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }
};
```

### I removed ```document.execCommand``` from all the block of code I know it's no longer being used from all modern web standards, I only was trying wrap it up more about using it for 
### Replaced execCommand:
*  Used ``Selection`` and ```Range APIs``` to format text (```applyStyle function```).

* Readability: The code flow becomes linear and easier to understand compared to chaining .then or 
 callback functions.
* Error Handling: Using ```try-catch``` around asynchronous operations (like PDF generation) improves robustness.
* Future-Proofing: If asynchronous APIs are introduced to replace execCommand, this structure can easily accommodate them.

### Although ```document.execCommand``` isn't truly asynchronous, it's wrapping with async/await provides consistency if replaced with a future asynchronous implementation (e.g., Selection API).

