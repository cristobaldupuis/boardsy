import { ImagePlus } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatUsd } from "@/lib/utils";

const PHOTO_SLOTS = [
  { id: "p1", top: "18%", left: "18%" },
  { id: "p2", top: "18%", left: "42%" },
  { id: "p3", top: "18%", left: "66%" },
  { id: "p4", top: "42%", left: "18%" },
  { id: "p5", top: "42%", left: "66%" },
  { id: "p6", top: "66%", left: "18%" },
  { id: "p7", top: "66%", left: "42%" },
  { id: "p8", top: "66%", left: "66%" },
];

export function BoardBuilder({ product }: { product: Product }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const [title, setTitle] = useState("The Hale Family");
  const [presetId, setPresetId] = useState(product.presets[0].id);
  const [colorway, setColorway] = useState(product.colorways[0].id);
  const [packQty, setPackQty] = useState(product.packs[0].qty);
  const [spaces, setSpaces] = useState(product.presets[0].spaces);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSlot = useRef<string | null>(null);

  const pack = product.packs.find((p) => p.qty === packQty) ?? product.packs[0];
  const price = pack.priceCents + extra * 10000;
  const filled = Object.keys(photos).length;
  const slots = PHOTO_SLOTS.slice(0, product.photoSlots);

  const previewStyle = useMemo(
    () => ({
      filter: colorway === "coastal" || colorway === "sage" ? "hue-rotate(-20deg)" : "none",
    }),
    [colorway],
  );

  function applyPreset(id: string) {
    setPresetId(id);
    const p = product.presets.find((x) => x.id === id);
    if (p?.spaces.length) setSpaces([...p.spaces]);
  }

  function openFile(slot: string) {
    pendingSlot.current = slot;
    fileRef.current?.click();
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const slot = pendingSlot.current;
    if (!file || !slot) return;
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [slot]: url }));
    e.target.value = "";
  }

  function onDrop(slot: string, ev: DragEvent) {
    ev.preventDefault();
    const file = ev.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [slot]: url }));
  }

  function addToCart() {
    add({
      slug: product.slug,
      name: product.name,
      qty: pack.qty + extra,
      priceCents: price,
      title,
      colorway,
      preset: presetId,
      photos: filled,
      spaces: spaces.slice(0, 8),
    });
    void navigate({ to: "/cart" });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="relative aspect-square overflow-hidden rounded-sm bg-cream ring-1 ring-border">
        <img
          src={product.kind === "boardopolis" ? "/images/board-top.jpg" : product.image}
          alt=""
          className="h-full w-full object-cover"
          style={previewStyle}
        />
        {product.kind === "boardopolis" ? (
          <p className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 font-display text-2xl text-ink md:text-3xl">
            {title || "Your title"}
          </p>
        ) : null}
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => openFile(slot.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(slot.id, e)}
            className="absolute size-[18%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-dashed border-ink/40 bg-cream/70"
            style={{ top: slot.top, left: slot.left }}
            aria-label={`Photo ${slot.id}`}
          >
            {photos[slot.id] ? (
              <img src={photos[slot.id]} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-1 p-1 text-[10px] text-muted">
                <ImagePlus className="size-4" />
                Drop a photo
              </span>
            )}
          </button>
        ))}
      </div>

      <div>
        <h1 className="font-display text-4xl text-ink">{product.name}</h1>
        <p className="mt-1 text-lg tabular-nums text-ink">{formatUsd(price)}</p>

        <Field label="Pack size">
          <div className="grid grid-cols-3 gap-2">
            {product.packs.map((p) => (
              <button
                key={p.qty}
                type="button"
                onClick={() => {
                  setPackQty(p.qty);
                  setExtra(0);
                }}
                className={`rounded-sm border px-3 py-3 text-sm ${
                  packQty === p.qty && extra === 0
                    ? "border-terracotta text-ink"
                    : "border-border text-muted"
                }`}
              >
                <span className="block font-medium text-ink">{p.label}</span>
                <span className="tabular-nums">{formatUsd(p.priceCents)}</span>
              </button>
            ))}
          </div>
          {product.kind === "boardopolis" ? (
            <button
              type="button"
              className="mt-2 text-sm text-muted underline"
              onClick={() => setExtra((n) => n + 1)}
            >
              Extra copies +$100 each{extra ? ` · ${extra} added` : ""}
            </button>
          ) : null}
        </Field>

        <Field label="Game title">
          <input
            value={title}
            maxLength={24}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-sm border border-border bg-cream px-3 py-3 text-ink outline-none focus:border-terracotta"
          />
          <p className="mt-1 text-right text-xs text-muted tabular-nums">{title.length}/24</p>
        </Field>

        <Field label="Preset">
          <div className="flex flex-wrap gap-2">
            {product.presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  presetId === p.id ? "border-ink bg-cream text-ink" : "border-border text-muted"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Colorway">
          <div className="flex gap-3">
            {product.colorways.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorway(c.id)}
                className={`flex items-center gap-2 text-sm ${colorway === c.id ? "text-ink" : "text-muted"}`}
              >
                <span
                  className="size-5 rounded-full ring-1 ring-border"
                  style={{ background: c.swatch }}
                />
                {c.name}
              </button>
            ))}
          </div>
        </Field>

        {spaces.length > 0 ? (
          <Field label="Editable space names">
            <ul className="max-h-48 space-y-2 overflow-auto pr-1">
              {spaces.slice(0, 8).map((name, i) => (
                <li key={i}>
                  <input
                    value={name}
                    onChange={(e) => {
                      const next = [...spaces];
                      next[i] = e.target.value;
                      setSpaces(next);
                    }}
                    className="w-full border-b border-border bg-transparent py-1 text-sm outline-none"
                  />
                </li>
              ))}
            </ul>
          </Field>
        ) : null}

        <p className="mt-4 text-sm text-muted">
          {filled} of {product.photoSlots} photos added
        </p>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-terracotta"
            style={{ width: `${(filled / product.photoSlots) * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="mt-6 w-full rounded-full bg-terracotta py-3.5 text-sm font-medium tracking-wide text-cream hover:bg-terracotta-dark"
        >
          Add to cart
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Proof emailed before we print · ships in 2–3 weeks
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm text-muted">{label}</p>
      {children}
    </div>
  );
}
