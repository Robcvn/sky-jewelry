"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";

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
