// It's a best practice to store your cloud name in environment variables.
// However, for this project's structure, we'll define it here.
const CLOUDINARY_CLOUD_NAME = 'ddyqhlilj';

/**
 * Generates an optimized Cloudinary URL from a public ID.
 * Applies automatic quality (q_auto) and format (f_auto) transformations.
 * @param publicId The public ID of the image in Cloudinary.
 * @returns The full, optimized image URL.
 */
export const getOptimizedUrl = (publicId: string): string => {
    if (!publicId) {
        // Return a placeholder or a default image URL if the publicId is missing.
        return 'https://via.placeholder.com/400x300.png?text=No+Image';
    }
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
};
