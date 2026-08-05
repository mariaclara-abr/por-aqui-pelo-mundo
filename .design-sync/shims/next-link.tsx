// design-sync build shim for next/link — the real component reads
// process.env.__NEXT_* internals set up by Next's client runtime, which
// don't exist in a standalone esbuild bundle and throw on load. This
// renders the same markup (an <a>) without any Next.js router coupling.
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string | { pathname?: string; href?: string };
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

function resolveHref(href: LinkProps["href"]): string {
  if (typeof href === "string") return href;
  return href.pathname ?? href.href ?? "#";
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={resolveHref(href)} {...rest}>
      {children}
    </a>
  );
});

export default Link;
