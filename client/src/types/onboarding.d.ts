interface AvatarProperties {
  type: string;
  image: string;
}

interface CapturePhotoProperties {
  setShowCapturePhoto: (value: boolean) => void;
  setPhotoSelected: (value: number | null) => void;
}

interface PhotoLibraryProperties {
  hidePhotoLibrary: (value: boolean) => void;
  setPhotoSelected: (value: number | null) => void;
  photoSelected: number | null;
}

interface ContextMenuOptions {
  name: string;
  callback: () => void;
}

interface ContextMenuCoordinates {
  x: number;
  y: number;
}

interface ContextMenuProperties {
  options: ContextMenuOptions[];
  coordinates: ContextMenuCoordinates;
  setContextMenu: (value: boolean) => void;
  setHover: (value: boolean) => void;
}
