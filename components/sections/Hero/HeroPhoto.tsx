// The hero photo: a different crop for phones and from 48rem (art direction), both preloaded per media
// query like the prototype's <link rel="preload" media=…>.
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { media } from "@/content/media";

const WIDE_MEDIA = "(min-width: 48rem)";
const MOBILE_MEDIA = "(max-width: 47.99rem)";

export function HeroPhoto({ alt }: { alt: string }) {
  const common = { alt, sizes: "100vw" };
  const wide = getImageProps({ ...common, src: media.heroWide.src, width: media.heroWide.width, height: media.heroWide.height }).props;
  const mobile = getImageProps({
    ...common,
    src: media.heroMobile.src,
    width: media.heroMobile.width,
    height: media.heroMobile.height,
    loading: "eager",
    fetchPriority: "high",
  }).props;

  preload(wide.src, { as: "image", imageSrcSet: wide.srcSet, imageSizes: wide.sizes, media: WIDE_MEDIA, fetchPriority: "high" });
  preload(mobile.src, { as: "image", imageSrcSet: mobile.srcSet, imageSizes: mobile.sizes, media: MOBILE_MEDIA, fetchPriority: "high" });

  const { srcSet: mobileSrcSet, ...img } = mobile;
  return (
    <picture>
      <source media={WIDE_MEDIA} srcSet={wide.srcSet} sizes={wide.sizes} width={media.heroWide.width} height={media.heroWide.height} />
      <img {...img} srcSet={mobileSrcSet} alt={alt} data-motion="hero-photo" data-sample="true" />
    </picture>
  );
}
