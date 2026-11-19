"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Pagination, PaginationDots } from "@/components/ui/Pagination";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";

export function ModalDemo({ layout = "row" }: { layout?: "row" | "stack" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {layout === "row" ? "Open modal" : "Open modal with stacked buttons"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        heading="Are you sure you want to remove this item?"
        body="This removes the ring from your bag. You can add it again at any time."
        icon={layout === "stack" ? <Icon name="alert" size={48} className="text-state-error" /> : undefined}
        actionsLayout={layout}
        secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
        primaryAction={{ label: "Remove", onClick: () => setOpen(false) }}
      />
    </>
  );
}

export function PaginationDemo({ size = "md" }: { size?: "md" | "sm" }) {
  const [page, setPage] = useState(2);
  return <Pagination pageCount={5} currentPage={page} onPageChange={setPage} size={size} label={`Results pages, ${size}`} />;
}

export function PaginationDotsDemo({ overlay = false }: { overlay?: boolean }) {
  const [slide, setSlide] = useState(0);
  return <PaginationDots count={5} current={slide} onSelect={setSlide} overlay={overlay} label={overlay ? "Hero images" : "Product images"} />;
}

export function RemovableTagDemo() {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <Tag leadingIcon="round" onRemove={() => setVisible(false)} removeLabel="Remove Round">
      Round
    </Tag>
  ) : (
    <TextButton onClick={() => setVisible(true)}>Restore tag</TextButton>
  );
}
