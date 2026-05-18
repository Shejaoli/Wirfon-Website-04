import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  fallbackLabel?: string;
  width?: number;
  height?: number;
}

export default function TwoColImage({ src, alt, fallbackLabel, width = 672, height = 400 }: Props) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <div className="image-placeholder">{fallbackLabel ?? alt}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}
