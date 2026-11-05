// Locale-aware wrappers around next/link and next/navigation. Use these, not the next/* originals.
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
