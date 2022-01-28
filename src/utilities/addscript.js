export const addScript = (path) => {
    const script = document.createElement('script');
    script.src = path;
    script.async = true;
    document.body.appendChild(script);
}
