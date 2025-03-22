document.addEventListener("DOMContentLoaded", () => {
    // Function to load and inject HTML templates
    const loadTemplate = async (id, url) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const html = await response.text();
                    element.innerHTML = html;
                } else {
                    console.error(`Failed to load ${url}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error loading ${url}: ${error}`);
            }
        }
    };

    // Load head, header, and footer templates    
    loadTemplate("header", "/templates/header.html");
    loadTemplate("footer", "/templates/footer.html");
    loadTemplate("head", "/templates/head.html");
});
