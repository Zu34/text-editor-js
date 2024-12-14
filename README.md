## Advantages of Using Async/Await
* Readability: The code flow becomes linear and easier to understand compared to chaining .then or 
 callback functions.
* Error Handling: Using try-catch around asynchronous operations (like PDF generation) improves robustness.
* Future-Proofing: If asynchronous APIs are introduced to replace execCommand, this structure can easily accommodate them.

### Although ```document.execCommand``` isn't truly asynchronous, it's wrapping with async/await provides consistency if replaced with a future asynchronous implementation (e.g., Selection API).

