import NextImage, { type ImageProps } from "next/image";

/** Keep photographic detail in the site's optimized images. */
export default function QualityImage({ quality = 95, ...props }: ImageProps) {
  return <NextImage {...props} quality={quality} />;
}
