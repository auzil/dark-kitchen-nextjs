// Drawn street plan around the pickup point. PLACEHOLDER (sample): an illustration, not a real map;
// replace with a static map once the pickup address is confirmed (TODO-OWNER.md).
import styles from "./PickupMap.module.scss";

const STREETS = [
  "M-20 432 L820 342",
  "M-20 92 L820 2",
  "M-20 570 L560 508",
  "M118 -20 L176 620",
  "M344 -20 L402 620",
  "M552 -20 L590 360",
  "M700 -20 L728 330",
];

export function PickupMap({ title, brand, street }: { title: string; brand: string; street: string }) {
  return (
    <div className={styles.root} data-sample="true">
      <svg viewBox="0 0 800 600" role="img" aria-labelledby="map-title">
        <title id="map-title">{title}</title>
        <rect className={styles.block} width="800" height="600" />
        <path className={styles.park} d="M560 352 L800 326 L800 600 L590 600 Z" />
        {STREETS.map((d) => (
          <path key={d} className={styles.street} d={d} />
        ))}
        <path className={styles.mainRoad} d="M-20 258 L820 168" />
        <path className={styles.tram} d="M-20 258 L820 168" />
        <text className={styles.label} transform="translate(446 362) rotate(-6.1)">
          Krejnická
        </text>
        <rect className={styles.halo} x="350" y="352" width="56" height="56" transform="rotate(45 378 380)" />
        <rect className={styles.pin} x="366" y="368" width="24" height="24" transform="rotate(45 378 380)" />
        <rect className={styles.tag} x="104" y="290" width="250" height="72" />
        <text className={styles.tagTitle} x="122" y="324">
          {brand}
        </text>
        <text className={styles.tagText} x="122" y="348">
          {street}
        </text>
      </svg>
    </div>
  );
}
