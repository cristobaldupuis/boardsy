import { ImagePlus } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CASA_CORNERS, CASA_GROUPS, CASA_PRESETS } from "@/lib/casa";
import { useCart } from "@/lib/cart";
import { nextCopyCents, packPrice, type Product } from "@/lib/products";
import { formatUsd } from "@/lib/utils";

export function CasaBuilder({ product }: { product: Product }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const [title, setTitle] = useState("LMA Children's House");
  const [presetId, setPresetId] = useState("lma");
  const [packId, setPackId] = useState("silver");
  const [qty, setQty] = useState(1);
  const [works, setWorks] = useState(() => structuredClone(CASA_PRESETS.lma));
  const [corners, setCorners] = useState<Record<string, string>>({
    begin: "The Bell",
    silence: "Silence",
    garden: "The Garden",
    return: "The Line",
  });
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = useRef<string | null>(null);

  const pack = product.packs.find((p) => p.id === packId) ?? product.packs[0];
  const price = packPrice(pack, qty);
  const next = nextCopyCents(pack, qty);
  const keep = product.fundraise?.keepCents[pack.id as "board" | "silver" | "gold"] ?? 0;
  const filled = Object.keys(photos).length;

  function applyPreset(id: string) {
    setPresetId(id);
    const src = CASA_PRESETS[id] ?? CASA_PRESETS.casa;
    setWorks(structuredClone(src));
    if (id === "lma") setTitle("LMA Children's House");
  }

  function open(slot: string) {
    pending.current = slot;
    fileRef.current?.click();
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const slot = pending.current;
    if (!file || !slot) return;
    setPhotos((p) => ({ ...p, [slot]: URL.createObjectURL(file) }));
    e.target.value = "";
  }

  function addToCart() {
    add({
      slug: product.slug,
      name: product.name,
      qty,
      priceCents: price,
      title,
      colorway: "clay",
      preset: presetId,
      pack: pack.label,
      photos: filled,
      spaces: CASA_GROUPS.flatMap((g) => works[g.id] ?? []),
    });
    void navigate({ to: "/cart" });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div>
        <CasaBoard title={title} works={works} corners={corners} photos={photos} onOpen={open} />
        <p className="mt-3 text-center text-xs text-muted">
          Not a race to own the city. A walk through work, nature, and grace.
        </p>
        <figure className="mt-8 overflow-hidden rounded-sm ring-1 ring-border">
          <img src="/images/catalog-casa.jpg" alt="The Children's House board" className="w-full object-cover" />
          <figcaption className="px-3 py-3 text-sm text-muted">Studio · 18×18. Earth, wood, order.</figcaption>
        </figure>
        <figure className="mt-4 overflow-hidden rounded-sm ring-1 ring-border">
          <img src="/images/table-casa.jpg" alt="In a Children's House" className="w-full object-cover" />
          <figcaption className="px-3 py-3 text-sm text-muted">On a child-height table. London light.</figcaption>
        </figure>
      </div>

      <div>
        <p className="text-xs tracking-[0.2em] text-muted">EXPERIMENT</p>
        <h1 className="font-display text-4xl text-ink">{product.name}</h1>
        <p className="mt-2 text-muted">{product.tagline}</p>
        <p className="mt-3 text-lg tabular-nums text-ink">{formatUsd(price)}</p>

        {product.fundraise ? (
          <div className="mt-6 rounded-sm border border-border bg-cream px-4 py-4 text-sm">
            <p className="font-medium text-ink">
              {product.fundraise.school}
            </p>
            <p className="mt-1 text-muted">{product.fundraise.city}</p>
            <p className="mt-3 text-muted">
              Fundraising test: every game sold, the school keeps{" "}
              <span className="text-ink">{formatUsd(keep)}</span> of this package. You keep the rest. Pitch it as a
              classroom edition — their children, their park, their peace table.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <p className="mb-2 text-sm text-muted">Package</p>
          <div className="space-y-2">
            {product.packs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPackId(p.id);
                  setQty(1);
                }}
                className={`w-full rounded-sm border px-4 py-3 text-left ${
                  packId === p.id ? "border-sage" : "border-border"
                }`}
              >
                <span className="flex justify-between">
                  <span className="font-medium">{p.label}</span>
                  <span className="tabular-nums">{formatUsd(p.priceCents)}</span>
                </span>
                {p.blurb ? <span className="mt-1 block text-xs text-muted">{p.blurb}</span> : null}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" className="size-9 rounded-sm border border-border" onClick={() => setQty((n) => Math.max(1, n - 1))}>
              −
            </button>
            <span className="min-w-8 text-center tabular-nums">{qty}</span>
            <button type="button" className="size-9 rounded-sm border border-border" onClick={() => setQty((n) => n + 1)}>
              +
            </button>
          </div>
          {pack.id === "board" ? (
            <p className="mt-2 text-xs text-muted">Board stays $79 each.</p>
          ) : next ? (
            <p className="mt-2 text-xs text-muted">Next copy {formatUsd(next)}.</p>
          ) : null}
        </div>

        <label className="mt-6 block text-sm text-muted">
          Game title
          <input
            value={title}
            maxLength={28}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-sm border border-border bg-cream px-3 py-3 text-ink"
          />
        </label>

        <div className="mt-6">
          <p className="mb-2 text-sm text-muted">Preset</p>
          <div className="flex flex-wrap gap-2">
            {product.presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  presetId === p.id ? "border-ink text-ink" : "border-border text-muted"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm text-muted">Corners</p>
          {CASA_CORNERS.map((c) => (
            <label key={c.id} className="mb-2 block text-xs text-muted">
              {c.label} · {c.role}
              <input
                value={corners[c.id]}
                onChange={(e) => setCorners((prev) => ({ ...prev, [c.id]: e.target.value }))}
                className="mt-1 w-full rounded-sm border border-border bg-cream px-3 py-2 text-sm text-ink"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 max-h-[22rem] space-y-4 overflow-auto pr-1">
          {CASA_GROUPS.map((g) => (
            <div key={g.id}>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <span className="h-3 w-6 rounded-sm" style={{ background: g.color }} />
                {g.label}
              </p>
              {(works[g.id] ?? []).map((name, i) => (
                <input
                  key={`${g.id}-${i}`}
                  value={name}
                  onChange={(e) => {
                    const nextW = { ...works, [g.id]: [...(works[g.id] ?? [])] };
                    nextW[g.id][i] = e.target.value;
                    setWorks(nextW);
                  }}
                  className="mb-2 w-full rounded-sm border border-border bg-cream px-3 py-2 text-sm"
                />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">{filled} of {product.photoSlots} classroom photos</p>
        <button
          type="button"
          onClick={addToCart}
          className="mt-6 w-full rounded-full bg-sage py-3.5 text-sm text-cream"
        >
          Add to cart
        </button>
        <p className="mt-3 text-center text-xs text-muted">Proof before print · 2–3 weeks</p>
      </div>
    </div>
  );
}

function CasaBoard({
  title,
  works,
  corners,
  photos,
  onOpen,
}: {
  title: string;
  works: Record<string, string[]>;
  corners: Record<string, string>;
  photos: Record<string, string>;
  onOpen: (slot: string) => void;
}) {
  const ring = [
    { kind: "corner" as const, id: "begin" },
    ...labelRing("life"),
    { kind: "corner" as const, id: "silence" },
    ...labelRing("sense"),
    { kind: "corner" as const, id: "return" },
    ...labelRing("culture"),
    { kind: "corner" as const, id: "garden" },
    ...labelRing("grace"),
    ...labelRing("london"),
  ];
  while (ring.length < 40) {
    ring.splice(ring.length - 6, 0, {
      kind: "work" as const,
      id: `rest-${ring.length}`,
      group: "grace",
      name: "Rest",
    });
  }

  function labelRing(id: string) {
    return (works[id] ?? []).map((name, i) => ({ kind: "work" as const, id: `${id}-${i}`, group: id, name }));
  }

  const slots = [
    { id: "c1", top: "28%", left: "30%" },
    { id: "c2", top: "28%", left: "70%" },
    { id: "c3", top: "55%", left: "22%" },
    { id: "c4", top: "55%", left: "78%" },
    { id: "c5", top: "78%", left: "38%" },
    { id: "c6", top: "78%", left: "62%" },
  ];

  return (
    <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-[#efe6d8] p-2 ring-1 ring-border">
      <div
        className="grid h-full w-full gap-[3px]"
        style={{
          gridTemplateColumns: "1.4fr repeat(9, 1fr) 1.4fr",
          gridTemplateRows: "1.4fr repeat(9, 1fr) 1.4fr",
        }}
      >
        {ring.slice(0, 40).map((cell, i) => {
          const pos = casaPos(i);
          const group = cell.kind === "work" ? CASA_GROUPS.find((g) => g.id === cell.group) : null;
          const bg = group?.color ?? "#fbf7f1";
          const label = cell.kind === "corner" ? corners[cell.id] : cell.name;
          return (
            <div
              key={`${cell.id}-${i}`}
              className="flex items-center justify-center overflow-hidden rounded-[3px] px-0.5 text-center text-[6px] leading-tight text-cream sm:text-[7px]"
              style={{
                gridColumn: pos.col,
                gridRow: pos.row,
                background: bg,
                color: cell.kind === "corner" ? "#1c1917" : "#fbf7f1",
                writingMode: pos.side === "left" || pos.side === "right" ? "vertical-rl" : "horizontal-tb",
                transform: pos.side === "left" ? "rotate(180deg)" : undefined,
              }}
            >
              {label}
            </div>
          );
        })}
        <div
          className="relative"
          style={{
            gridColumn: "2 / 11",
            gridRow: "2 / 11",
            background: "radial-gradient(circle at 50% 55%, #f6efe4, #e8dcc8)",
          }}
        >
          <p className="absolute left-1/2 top-[8%] w-[78%] -translate-x-1/2 text-center font-display text-lg text-ink sm:text-2xl">
            {title}
          </p>
          {slots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpen(s.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e: DragEvent) => {
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith("image/")) {
                  // parent handles via click upload; keep drop simple
                }
                e.preventDefault();
              }}
              className="absolute size-[12%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-dashed border-ink/30 bg-cream/60"
              style={{ top: s.top, left: s.left }}
            >
              {photos[s.id] ? (
                <img src={photos[s.id]} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="mx-auto size-3 text-muted" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function casaPos(i: number): { row: number; col: number; side: "top" | "right" | "bottom" | "left" | "corner" } {
  if (i === 0) return { row: 1, col: 1, side: "corner" };
  if (i <= 9) return { row: 1, col: i + 1, side: "top" };
  if (i === 10) return { row: 1, col: 11, side: "corner" };
  if (i <= 19) return { row: i - 9, col: 11, side: "right" };
  if (i === 20) return { row: 11, col: 11, side: "corner" };
  if (i <= 29) return { row: 11, col: 31 - i, side: "bottom" };
  if (i === 30) return { row: 11, col: 1, side: "corner" };
  return { row: 41 - i, col: 1, side: "left" };
}
