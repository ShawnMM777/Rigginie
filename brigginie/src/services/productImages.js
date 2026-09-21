import intelArc from '../assets/products/GRAPHICS CARD/Intel Arc B580 Limited Edition.jpg';
import rogFallback from '../assets/products/GRAPHICS CARD/1.png';
import gpuFallback from '../assets/products/GRAPHICS CARD/2.png';

const PRODUCT_IMAGE_FALLBACKS = {
    'intel arc b580 limited edition': intelArc,
    'rog astral 5070': rogFallback,
};

export function remoteProductImage(path) {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
}

export function fallbackProductImage(product) {
    const name = product?.name?.trim().toLowerCase();
    if (name && PRODUCT_IMAGE_FALLBACKS[name]) return PRODUCT_IMAGE_FALLBACKS[name];
    if (product?.category === 'GPU') return gpuFallback;
    return null;
}
