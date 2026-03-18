export const AllowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/3gpp"],
  audio: ["audio/mpeg", "audio/ogg", "audio/mp4", "audio/wav"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
} as const;

export const AllAllowedMimeTypes = [
  ...AllowedMimeTypes.image,
  ...AllowedMimeTypes.video,
  ...AllowedMimeTypes.audio,
  ...AllowedMimeTypes.document,
];
