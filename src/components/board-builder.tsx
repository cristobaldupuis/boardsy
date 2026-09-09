import { ImagePlus } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import {
  BOARD_CELLS,
  BOARDOPOLIS_PRESETS,
  STATION_SETS,
  STREET_GROUPS,
  UTILITY_SETS,
  cloneStreets,
  nameSetById,
  type BoardCell,
  type Product,
} from "@/lib/products";
import { formatUsd } from "@/lib/utils";

const PHOTO_SLOTS = [
  { id: "p1", top: "18%", left: "22%" },
  { id: "p2", top: "18%", left: "78%" },
  { id: "p3", top: "78%", left: "22%" },
  { id: "p4", top: "78%", left: "78%" },
];

const CARD_PHOTO_SLOTS = [
  { id: "p1", top: "18%", left: "18%" },
  { id: "p2", top: "18%", left: "42%" },
  { id: "p3", top: "18%", left: "66%" },
  { id: "p4", top: "42%", left: "18%" },
  { id: "p5", top: "42%", left: "66%" },
  { id: "p6", top: "66%", left: "18%" },
  { id: "p7", top: "66%", left: "42%" },
  { id: "p8", top: "66%", left: "66%" },
];

type FocusKey = string | null;

export function BoardBuilder({ product }: { product: Product }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const family = BOARDOPOLIS_PRESETS[0];
  const [title, setTitle] = useState("The Hale Family");
  const [presetId, setPresetId] = useState(product.kind === "boardopolis" ? family.id : product.presets[0].id);
  const [colorway, setColorway] = useState(product.colorways[0].id);
  const [packQty, setPackQty] = useState(product.packs[0].qty);
  const [streets, setStreets] = useState(() => cloneStreets(family.streets));
  const [stationSet, setStationSet] = useState(family.stationsId);
  const [stations, setStations] = useState(() => [...nameSetById(STATION_SETS, family.stationsId).names]);
  const [utilitySet, setUtilitySet] = useState(family.utilitiesId);
  const [utilities, setUtilities] = useState(() => [...nameSetById(UTILITY_SETS, family.utilitiesId).names]);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState(0);
  const [focus, setFocus] = useState<FocusKey>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSlot = useRef<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const pack = product.packs.find((p) => p.qty === packQty) ?? product.packs[0];
  const price = pack.priceCents + extra * 10000;
  const filled = Object.keys(photos).length;
  const isBoard = product.kind === "boardopolis";
  const slots = (isBoard ? PHOTO_SLOTS : CARD_PHOTO_SLOTS).slice(0, product.photoSlots);

  const previewStyle = useMemo(
    () => ({
      filter: colorway === "coastal" || colorway === "sage" ? "hue-rotate(-20deg)" : "none",
    }),
    [colorway],
  );

  function applyPreset(id: string) {
    setPresetId(id);
    if (!isBoard) return;
    const p = BOARDOPOLIS_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setStreets(cloneStreets(p.streets));
    setStationSet(p.stationsId);
    setStations([...nameSetById(STATION_SETS, p.stationsId).names]);
    setUtilitySet(p.utilitiesId);
    setUtilities([...nameSetById(UTILITY_SETS, p.utilitiesId).names]);
  }

  function applyStationSet(id: string) {
    setStationSet(id);
    setStations([...nameSetById(STATION_SETS, id).names]);
  }

  function applyUtilitySet(id: string) {
    setUtilitySet(id);
    setUtilities([...nameSetById(UTILITY_SETS, id).names]);
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

  function setStreet(groupId: string, index: number, value: string) {
    setStreets((prev) => {
      const next = { ...prev, [groupId]: [...(prev[groupId] ?? [])] };
      next[groupId][index] = value;
      return next;
    });
  }

  function fillExample(groupId: string, example: string) {
    const group = STREET_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const current = streets[groupId] ?? [];
    const empty = current.findIndex((n) => !n.trim());
    const idx = empty === -1 ? 0 : empty;
    setStreet(groupId, idx, example);
    const key = `street:${groupId}:${idx}`;
    setFocus(key);
    fieldRefs.current[key]?.focus();
  }

  function focusKey(key: string) {
    setFocus(key);
    fieldRefs.current[key]?.focus();
    fieldRefs.current[key]?.scrollIntoView({ block: "nearest" });
  }

  function cellLabel(cell: BoardCell) {
    if (cell.kind === "street") return streets[cell.groupId]?.[cell.index] || STREET_GROUPS.find((g) => g.id === cell.groupId)?.examples[cell.index] || "Street";
    if (cell.kind === "station") return stations[cell.index] || `Station ${cell.index + 1}`;
    if (cell.kind === "utility") return utilities[cell.index] || `Utility ${cell.index + 1}`;
    return cell.label;
  }

  function cellKey(cell: BoardCell): string | null {
    if (cell.kind === "street") return `street:${cell.groupId}:${cell.index}`;
    if (cell.kind === "station") return `station:${cell.index}`;
    if (cell.kind === "utility") return `utility:${cell.index}`;
    return null;
  }

  function addToCart() {
    const streetNames = STREET_GROUPS.flatMap((g) => streets[g.id] ?? []);
    add({
      slug: product.slug,
      name: product.name,
      qty: pack.qty + extra,
      priceCents: price,
      title,
      colorway,
      preset: presetId,
      photos: filled,
      spaces: isBoard ? streetNames : undefined,
      stations: isBoard ? stations : undefined,
      utilities: isBoard ? utilities : undefined,
    });
    void navigate({ to: "/cart" });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {isBoard ? (
        <BoardRing
          title={title}
          photos={photos}
          slots={slots}
          focus={focus}
          cellLabel={cellLabel}
          cellKey={cellKey}
          onFocusCell={(key) => key && focusKey(key)}
          onOpenFile={openFile}
          onDrop={onDrop}
        />
      ) : (
        <div className="relative aspect-square overflow-hidden rounded-sm bg-cream ring-1 ring-border">
          <img src={product.image} alt="" className="h-full w-full object-cover" style={previewStyle} />
          {slots.map((slot) => (
            <PhotoDrop
              key={slot.id}
              slot={slot}
              src={photos[slot.id]}
              onOpen={() => openFile(slot.id)}
              onDrop={(e) => onDrop(slot.id, e)}
            />
          ))}
        </div>
      )}

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
                  packQty === p.qty && extra === 0 ? "border-terracotta text-ink" : "border-border text-muted"
                }`}
              >
                <span className="block font-medium text-ink">{p.label}</span>
                <span className="tabular-nums">{formatUsd(p.priceCents)}</span>
              </button>
            ))}
          </div>
          {isBoard ? (
            <button type="button" className="mt-2 text-sm text-muted underline" onClick={() => setExtra((n) => n + 1)}>
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
            {(isBoard ? BOARDOPOLIS_PRESETS : product.presets).map((p) => (
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
                <span className="size-5 rounded-full ring-1 ring-border" style={{ background: c.swatch }} />
                {c.name}
              </button>
            ))}
          </div>
        </Field>

        {isBoard ? (
          <>
            <Field label="Streets — every coloured space">
              <p className="mb-3 text-xs text-muted">Tap a colour on the board or type below. Ideas fill the next empty slot.</p>
              <div className="max-h-[28rem] space-y-5 overflow-auto pr-1">
                {STREET_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                      <span className="h-3 w-6 rounded-sm" style={{ background: group.color }} />
                      {group.label}
                    </p>
                    <div className="space-y-2">
                      {Array.from({ length: group.count }, (_, i) => {
                        const key = `street:${group.id}:${i}`;
                        return (
                          <input
                            key={key}
                            ref={(el) => {
                              fieldRefs.current[key] = el;
                            }}
                            value={streets[group.id]?.[i] ?? ""}
                            placeholder={group.examples[i] ?? "Your street"}
                            onFocus={() => setFocus(key)}
                            onChange={(e) => setStreet(group.id, i, e.target.value)}
                            className={`w-full rounded-sm border bg-cream px-3 py-2 text-sm outline-none ${
                              focus === key ? "border-terracotta" : "border-border"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.examples.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => fillExample(group.id, ex)}
                          className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted hover:border-ink hover:text-ink"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Field>

            <Field label="Stations">
              <div className="mb-3 flex flex-wrap gap-2">
                {STATION_SETS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => applyStationSet(s.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      stationSet === s.id ? "border-ink text-ink" : "border-border text-muted"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {stations.map((name, i) => {
                  const key = `station:${i}`;
                  return (
                    <input
                      key={key}
                      ref={(el) => {
                        fieldRefs.current[key] = el;
                      }}
                      value={name}
                      placeholder={`Station ${i + 1}`}
                      onFocus={() => setFocus(key)}
                      onChange={(e) => {
                        const next = [...stations];
                        next[i] = e.target.value;
                        setStations(next);
                        setStationSet("custom");
                      }}
                      className={`w-full rounded-sm border bg-cream px-3 py-2 text-sm outline-none ${
                        focus === key ? "border-terracotta" : "border-border"
                      }`}
                    />
                  );
                })}
              </div>
            </Field>

            <Field label="Utilities">
              <div className="mb-3 flex flex-wrap gap-2">
                {UTILITY_SETS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => applyUtilitySet(s.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      utilitySet === s.id ? "border-ink text-ink" : "border-border text-muted"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {utilities.map((name, i) => {
                  const key = `utility:${i}`;
                  return (
                    <input
                      key={key}
                      ref={(el) => {
                        fieldRefs.current[key] = el;
                      }}
                      value={name}
                      placeholder={`Utility ${i + 1}`}
                      onFocus={() => setFocus(key)}
                      onChange={(e) => {
                        const next = [...utilities];
                        next[i] = e.target.value;
                        setUtilities(next);
                        setUtilitySet("custom");
                      }}
                      className={`w-full rounded-sm border bg-cream px-3 py-2 text-sm outline-none ${
                        focus === key ? "border-terracotta" : "border-border"
                      }`}
                    />
                  );
                })}
              </div>
            </Field>
          </>
        ) : null}

        <p className="mt-4 text-sm text-muted">
          {filled} of {product.photoSlots} photos added
        </p>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-terracotta" style={{ width: `${(filled / product.photoSlots) * 100}%` }} />
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="mt-6 w-full rounded-full bg-terracotta py-3.5 text-sm font-medium tracking-wide text-cream hover:bg-terracotta-dark"
        >
          Add to cart
        </button>
        <p className="mt-3 text-center text-xs text-muted">Proof emailed before we print · ships in 2–3 weeks</p>
      </div>
    </div>
  );
}

function BoardRing({
  title,
  photos,
  slots,
  focus,
  cellLabel,
  cellKey,
  onFocusCell,
  onOpenFile,
  onDrop,
}: {
  title: string;
  photos: Record<string, string>;
  slots: { id: string; top: string; left: string }[];
  focus: FocusKey;
  cellLabel: (cell: BoardCell) => string;
  cellKey: (cell: BoardCell) => string | null;
  onFocusCell: (key: string | null) => void;
  onOpenFile: (slot: string) => void;
  onDrop: (slot: string, ev: DragEvent) => void;
}) {
  return (
    <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-sm bg-[#1a1512] p-1.5 ring-1 ring-border sm:p-2">
      <div
        className="grid h-full w-full gap-px"
        style={{
          gridTemplateColumns: "1.35fr repeat(9, 1fr) 1.35fr",
          gridTemplateRows: "1.35fr repeat(9, 1fr) 1.35fr",
        }}
      >
        {BOARD_CELLS.map((cell, i) => {
          const pos = boardPosition(i);
          const key = cellKey(cell);
          const group = cell.kind === "street" ? STREET_GROUPS.find((g) => g.id === cell.groupId) : null;
          const active = key && focus === key;
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => onFocusCell(key)}
              className={`relative flex overflow-hidden bg-cream text-left ${
                cell.kind === "corner" ? "items-center justify-center" : ""
              } ${active ? "ring-2 ring-inset ring-terracotta" : ""}`}
              style={{ gridColumn: pos.col, gridRow: pos.row }}
            >
              {group ? (
                <span
                  className="absolute bg-current"
                  style={{
                    color: group.color,
                    ...(pos.side === "bottom" ? { top: 0, left: 0, right: 0, height: "22%" } : {}),
                    ...(pos.side === "top" ? { bottom: 0, left: 0, right: 0, height: "22%" } : {}),
                    ...(pos.side === "left" ? { top: 0, right: 0, bottom: 0, width: "22%" } : {}),
                    ...(pos.side === "right" ? { top: 0, left: 0, bottom: 0, width: "22%" } : {}),
                  }}
                />
              ) : null}
              {cell.kind === "station" || cell.kind === "utility" ? (
                <span
                  className="absolute bg-ink/80"
                  style={{
                    ...(pos.side === "bottom" ? { top: 0, left: 0, right: 0, height: "22%" } : {}),
                    ...(pos.side === "top" ? { bottom: 0, left: 0, right: 0, height: "22%" } : {}),
                    ...(pos.side === "left" ? { top: 0, right: 0, bottom: 0, width: "22%" } : {}),
                    ...(pos.side === "right" ? { top: 0, left: 0, bottom: 0, width: "22%" } : {}),
                  }}
                />
              ) : null}
              <span
                className={`px-0.5 text-[7px] leading-tight text-ink sm:text-[8px] md:text-[9px] ${
                  cell.kind === "corner" ? "font-display text-[9px] sm:text-[11px]" : "mt-[22%] sm:mt-[24%]"
                }`}
                style={
                  pos.side === "left"
                    ? { writingMode: "vertical-rl", transform: "rotate(180deg)", marginTop: 0, paddingRight: "22%" }
                    : pos.side === "right"
                      ? { writingMode: "vertical-rl", marginTop: 0, paddingLeft: "22%" }
                      : pos.side === "top"
                        ? { marginTop: 0, marginBottom: "22%", alignSelf: "flex-end" }
                        : undefined
                }
              >
                {cellLabel(cell)}
              </span>
            </button>
          );
        })}
        <div
          className="relative bg-[#f3e6d2]"
          style={{ gridColumn: "2 / 11", gridRow: "2 / 11" }}
        >
          <p className="pointer-events-none absolute left-1/2 top-[10%] w-[80%] -translate-x-1/2 text-center font-display text-lg text-ink sm:text-2xl md:text-3xl">
            {title || "Your title"}
          </p>
          {slots.map((slot) => (
            <PhotoDrop
              key={slot.id}
              slot={slot}
              src={photos[slot.id]}
              onOpen={() => onOpenFile(slot.id)}
              onDrop={(e) => onDrop(slot.id, e)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function boardPosition(i: number): { row: number; col: number; side: "bottom" | "left" | "top" | "right" | "corner" } {
  if (i <= 10) {
    return { row: 11, col: 11 - i, side: i === 0 || i === 10 ? "corner" : "bottom" };
  }
  if (i < 20) {
    return { row: 11 - (i - 10), col: 1, side: "left" };
  }
  if (i <= 30) {
    return { row: 1, col: i - 19, side: i === 20 || i === 30 ? "corner" : "top" };
  }
  return { row: i - 29, col: 11, side: "right" };
}

function PhotoDrop({
  slot,
  src,
  onOpen,
  onDrop,
}: {
  slot: { id: string; top: string; left: string };
  src?: string;
  onOpen: () => void;
  onDrop: (e: DragEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="absolute size-[18%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-dashed border-ink/40 bg-cream/80"
      style={{ top: slot.top, left: slot.left }}
      aria-label={`Photo ${slot.id}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full flex-col items-center justify-center gap-1 p-1 text-[10px] text-muted">
          <ImagePlus className="size-4" />
          Drop a photo
        </span>
      )}
    </button>
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
