export function isImageOrVideo(contentType) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (imageTypes.includes(contentType)) {
        return 'image';
    } else if (videoTypes.includes(contentType)) {
        return 'video';
    } else {
        return 'unknown';
    }
}
