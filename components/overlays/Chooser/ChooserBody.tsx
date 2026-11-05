"use client";
// The chooser's live part: its own pizza / sushi switch + one listing, or (combos button while
// site.combosListing is null) both listings side by side.
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { AppLinks } from "@/components/ui/AppLinks/AppLinks";
import { CuisineSwitch, type SwitchLabels } from "@/components/ui/CuisineSwitch/CuisineSwitch";
import type { AppLinksByCuisine } from "@/lib/app-links";

type ChooserBodyProps = {
  links: AppLinksByCuisine;
  labels: SwitchLabels;
  prompts: { pizza: string; sushi: string };
  classNames: { switch?: string; both?: string; bothLinks?: string; label?: string };
};

export function ChooserBody({ links, labels, prompts, classNames }: ChooserBodyProps) {
  const { chooser, setChooser } = useCuisine();
  const { chooserBoth } = useDialogs();
  return (
    <>
      {/* one cuisine (header, bar) */}
      <CuisineSwitch
        name="cuisine-chooser"
        value={chooser}
        onChange={setChooser}
        labels={labels}
        className={classNames.switch}
        hidden={chooserBoth}
        hooks={{ "data-chooser-one": "" }}
      />
      <AppLinks
        items={links[chooser]}
        cuisine={chooser}
        group="chooser"
        track="chooser"
        variant="stack"
        hidden={chooserBoth}
        hooks={{ "data-chooser-one": "" }}
      />
      {/* both cuisines (combos button, while the combos listing is unknown) */}
      <div className={classNames.both} data-chooser-both="" hidden={!chooserBoth}>
        <p className={classNames.label} data-cuisine="pizza">
          {prompts.pizza}
        </p>
        <AppLinks items={links.pizza} cuisine="pizza" group="pizza" track="chooser-combos" className={classNames.bothLinks} />
        <p className={classNames.label} data-cuisine="sushi">
          {prompts.sushi}
        </p>
        <AppLinks items={links.sushi} cuisine="sushi" group="sushi" track="chooser-combos" className={classNames.bothLinks} />
      </div>
    </>
  );
}
