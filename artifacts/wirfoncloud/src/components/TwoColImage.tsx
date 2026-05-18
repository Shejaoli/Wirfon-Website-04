import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

export default function TwoColImage({ src, alt, fallbackLabel }: Props) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <div className="image-placeholder">{fallbackLabel ?? alt}</div>;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setErrored(true)} />;
}
