'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';

/** Search icon that opens a full-width search bar; submits to /search. */
export function SearchButton() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search Fragrances" className="touch-ripple p-2 text-mist transition-colors hover:text-white">
        <Icon name="search" strokeWidth={1.6} className="h-5 w-5" />
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => event.target === event.currentTarget && setOpen(false)}
        aria-label="Search"
        className="m-0 mt-0 w-full max-w-none bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <form action="/search" className="border-b border-[#c8b69b]/15 bg-[#131313]" onSubmit={() => setOpen(false)}>
          <div className="mx-auto flex h-20 max-w-3xl items-center gap-3 px-4">
            <Icon name="search" strokeWidth={1.6} className="h-5 w-5 shrink-0 text-champagne" />
            <label htmlFor="site-search" className="sr-only">
              Search fragrances
            </label>
            <input ref={inputRef} id="site-search" name="q" type="search" required autoComplete="off" placeholder="Search fragrances…" className="h-12 flex-1 bg-transparent font-playfair text-xl text-white placeholder:text-[#8e918f] focus:outline-none sm:text-2xl" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="inline-flex size-10 items-center justify-center text-mist transition-colors hover:text-white">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
