"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import styles from "./AIRoteiroFlourishes.module.css";

export default function AIRoteiroFlourishes({
  variant = "home",
}: {
  variant?: "home" | "premium";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible={isInView}
      data-variant={variant}
      className={`${styles.flourishes} ${variant === "premium" ? "text-terracota" : "text-areia"}`}
    >
      <div className={styles.flight}>
        <svg
          className={styles.trail}
          viewBox="0 0 208 72"
          fill="none"
          focusable="false"
        >
          <path
            d="M8 57C31 64 54 56 56 36C59 9 28 19 42 39C62 66 100 61 119 44C137 28 150 18 177 19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        </svg>
        <span className={styles.plane} />
        <span className={`${styles.sparkle} ${styles.topSparkle}`}>✦</span>
        <span className={`${styles.sparkle} ${styles.smallSparkle}`}>✧</span>
      </div>
      {variant === "premium" ? (
        <div className={`${styles.premiumOrbit} text-areia`}>
          <span className={`${styles.plane} ${styles.orbitPlane}`} />
          <span className={`${styles.sparkle} ${styles.orbitStarOne}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.orbitStarTwo}`}>✧</span>
          <span className={`${styles.sparkle} ${styles.orbitStarThree}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.orbitStarFour}`}>✧</span>
          <span className={`${styles.sparkle} ${styles.orbitStarFive}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.orbitStarSix}`}>✧</span>
        </div>
      ) : (
        <div className={`${styles.bottomStars} text-areia`}>
          <span className={`${styles.sparkle} ${styles.bottomSparkle}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.tinySparkle}`}>✧</span>
        </div>
      )}
    </div>
  );
}
