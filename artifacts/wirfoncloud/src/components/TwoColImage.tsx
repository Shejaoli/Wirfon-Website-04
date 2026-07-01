import { useState, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export default function TwoColImage({ src, alt, fallbackLabel, priority }: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  if (errored || !src) {
    return <div className="image-placeholder">{fallbackLabel ?? alt}</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      onError={() => setErrored(true)}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
