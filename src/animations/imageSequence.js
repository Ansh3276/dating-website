// Preload images logic
export const preloadImages = (urls, onProgress) => {
    let loadedCount = 0;
    const totalCount = urls.length;

    const promises = urls.map((url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedCount++;
                if (onProgress) onProgress(loadedCount / totalCount);
                resolve(img);
            };
            img.onerror = () => {
                // If a frame fails to load, we skip it but still count it
                loadedCount++;
                if (onProgress) onProgress(loadedCount / totalCount);
                resolve(null);
            };
        });
    });

    return Promise.all(promises).then(results => results.filter(img => img !== null));
};

// Get all image files in the frames directory dynamically
const frameModules = import.meta.glob('../assets/frames/*.{jpg,jpeg,png,webp}', { eager: true });

export const getAvailableFrameUrls = () => {
    // Sort keys alphabetically to ensure sequential order (frame001, frame002, etc.)
    const keys = Object.keys(frameModules).sort();
    return keys.map((key) => frameModules[key].default || frameModules[key]);
};
