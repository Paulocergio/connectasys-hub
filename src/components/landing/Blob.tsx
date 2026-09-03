type BlobProps = {
  className?: string;
};

export function Blob({ className }: BlobProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M45.3,-58.5C58.5,-49.6,68.5,-34.5,72.6,-17.7C76.7,-0.9,74.9,17.6,66.5,32.6C58.1,47.6,43.1,59.1,26.4,65.6C9.7,72.1,-8.7,73.6,-25.6,68.5C-42.5,63.4,-57.9,51.7,-66.4,36.4C-74.9,21.1,-76.5,2.2,-72.1,-14.7C-67.7,-31.6,-57.3,-46.5,-43.6,-55.6C-29.9,-64.7,-14.9,-68.9,1.2,-70.6C17.4,-72.3,34.8,-71.4,45.3,-58.5Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
