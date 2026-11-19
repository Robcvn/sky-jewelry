"use client";

import { useState } from "react";

const COLUMNS = Array.from({ length: 12 }, (_, index) => index);

export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {visible ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
          <div className="site-container site-grid h-full">
            {COLUMNS.map((column) => (
              <div
                key={column}
                className={`h-full bg-black-alpha-10 ${column >= 6 ? "hidden desktop:block" : ""}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="type-ui-xs-medium fixed right-space-5 bottom-space-5 z-50 min-h-space-11 cursor-pointer rounded-full border border-white-alpha-50 bg-base-black px-space-5 text-base-white shadow-md"
      >
        {visible ? "Hide grid" : "Show grid"}
      </button>
    </>
  );
}
