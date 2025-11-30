// Utility functions for generating real property and land images

// Real property images from Unsplash (high-quality house and building photos)
const PROPERTY_IMAGES = [
  'photo-1568605114967-8130f3a36994', // Modern house exterior
  'photo-1570129477492-45c003edd2be', // Luxury home
  'photo-1600596542815-ffad4c1539a9', // Beautiful residential
  'photo-1600607687939-ce8a6c25118c', // Contemporary house
  'photo-1600585154340-be6161a56a0c', // Modern villa
  'photo-1600566753190-17f0baa2a6c3', // Elegant home
  'photo-1600607687644-c7171b42498f', // Stylish property
  'photo-1600047509807-ba8f99d2cdde', // Luxury residence
  'photo-1600585154526-990dced4db0d', // Modern architecture
  'photo-1600573472550-8090b5e0745e', // Beautiful house
  'photo-1600047509358-9dc75507daeb', // Contemporary home
  'photo-1600563438938-a9a27216b4f5', // Elegant villa
  'photo-1600210492493-0946911123ea', // Modern residence
  'photo-1600585152915-d208bec867a1', // Stylish home
  'photo-1600607687920-4e2a09cf159d', // Luxury property
];

// Real land and landscape images from Unsplash
const LAND_IMAGES = [
  'photo-1500382017-9bfef37b5d3e', // Open field
  'photo-1500530855697-b8d0d8b1f4b7', // Agricultural land
  'photo-1441974231531-c6227db76b6e', // Nature landscape
  'photo-1472214103451-9374bd1c798e', // Rural property
  'photo-1469474968028-56623f02e42e', // Open terrain
  'photo-1501594907352-04cda38ebc29', // Land plot
  'photo-1464822759023-fed622ff2c3b', // Mountain property
  'photo-1470071459604-3b5ec3a7fe05', // Natural land
  'photo-1426604966848-d7adac402bff', // Forest land
  'photo-1501785888041-af3ef285b470', // Countryside
  'photo-1470252649378-9c29740c9fa8', // Open space
  'photo-1475924156734-496f6cac6ec1', // Scenic land
  'photo-1447752875215-b2761acb3c5d', // Farmland
  'photo-1465146344425-f00d5f5c8f07', // Natural terrain
  'photo-1504387103978-e4ee71416c38', // Valley land
];

// Real construction and development project images from Unsplash
const PROJECT_IMAGES = [
  'photo-1486406146357-2295aab3ca14', // Architecture project
  'photo-1503387762-592deb58ef4e', // Building development
  'photo-1541888946425-d81bb19240f5', // Urban construction
  'photo-1590856029826-c7a73a4ab8bc', // Modern development
  'photo-1537981609592-d05ac5d92b16', // Urban development
  'photo-1531834685032-c34bf0d84c77', // High-rise construction
  'photo-1528818955841-1cc1ff008e8c', // Building site
  'photo-1581094271901-8022df4466f9', // Development project
  'photo-1581094794329-c8112a89af12', // Construction work
  'photo-1597476374498-e6b4e90ed101', // Building process
  'photo-1589939705384-5185137a7f0f', // Urban development
  'photo-1599659810694-b5ac4dd37e4b', // Construction phase
  'photo-1563202563-0818a78f7fb7', // Project site
  'photo-1541888946425-d81bb19240f5', // Building works
  'photo-1504307651254-35680f356dfd', // Architecture development
];

/**
 * Generate a deterministic real image URL for properties using Unsplash
 */
export const getPropertyImageUrl = (propertyId: string, index: number = 0, width: number = 800, height: number = 600): string => {
  const hashCode = propertyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = (hashCode + index) % PROPERTY_IMAGES.length;
  const photoId = PROPERTY_IMAGES[imageIndex];
  // Using reliable Unsplash URL format with fallback
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80&fm=jpg`;
};

/**
 * Generate a deterministic real image URL for lands using Unsplash
 */
export const getLandImageUrl = (landId: string, index: number = 0, width: number = 1200, height: number = 800): string => {
  const hashCode = landId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = (hashCode + index) % LAND_IMAGES.length;
  const photoId = LAND_IMAGES[imageIndex];
  // Using reliable Unsplash URL format with fallback
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80&fm=jpg`;
};

/**
 * Generate a deterministic real image URL for projects using Unsplash
 */
export const getProjectImageUrl = (projectId: string, index: number = 0, width: number = 800, height: number = 600): string => {
  const hashCode = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = (hashCode + index) % PROJECT_IMAGES.length;
  const photoId = PROJECT_IMAGES[imageIndex];
  // Using reliable Unsplash URL format with fallback
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80&fm=jpg`;
};

/**
 * Get the default fallback image
 */
export const getDefaultImage = (type: 'property' | 'land' | 'project' = 'property'): string => {
  const defaults = {
    property: PROPERTY_IMAGES[0],
    land: LAND_IMAGES[0],
    project: PROJECT_IMAGES[0],
  };
  return `https://images.unsplash.com/${defaults[type]}?w=800&h=600&fit=crop&auto=format&q=80&fm=jpg`;
};
