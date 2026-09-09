import { Compass, Home, ImagePlus, Pause, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import {
  BOARD_CELLS,
  BOARDOPOLIS_PRESETS,
  SPECIALS,
  STATION_SETS,
  STREET_GROUPS,
  UTILITY_SETS,
  cloneStreets,
  nameSetById,
  type BoardCell,
  type Product,
  type SpecialSpace,
} from "@/lib/products";
import { formatUsd } from "@/lib/utils";

/** Frames sit in the inner map, around the compass — not on the colour strips. */
const PHOTO_SLOTS = [
  { id: "p1", top: "20%", left: "22%", w: "13%", h: "13%" },
  { id: "p2", top: "14%", left: "50%", w: "13%", h: "13%" },
  { id: "p3", top: "20%", left: "78%", w: "13%", h: "13%" },
  { id: "p4", top: "50%", left: "16%", w: "13%", h: "13%" },
  { id: "p5", top: "50%", left: "84%", w: "13%", h: "13%" },
  { id: "p6", top: "80%", left: "22%", w: "13%", h: "13%" },
  { id: "p7", top: "86%", left: "50%", w: "13%", h: "13%" },
  { id: "p8", top: "80%", left: "78%", w: "13%", h: "13%" },
];

const CARD_PHOTO_SLOTS = [
  { id: "p1", top: "28%", left: "28%", w: "22%", h: "30%" },
  { id: "p2", top: "28%", left: "72%", w: "22%", h: "30%" },
  { id: "p3", top: "72%", left: "28%", w: "22%", h: "30%" },
  { id: "p4", top: "72%", left: "72%", w: "22%", h: "30%" },
  { id: "p5", top: "50%", left: "50%", w: "18%", h: "24%" },
  { id: "p6", top: "50%", left: "18%", w: "16%", h: "22%" },
];

const TABLE_SCENES = [
  {
    id: "family",
    label: "Family table",
    image: "/images/table-family.jpg",
    caption: "Sunday table. Mid-game, pieces out.",
  },
  {
    id: "unbox",
    label: "Unboxing",
    image: "/images/table-unbox.jpg",
    caption: "The box on the linen — board, cards, houses.",
  },
  {
    id: "wedding",
    label: "Wedding table",
    image: "/images/table-wedding.jpg",
    caption: "After the toasts. Marble and two glasses.",
  },
  {
    id: "friends",
    label: "Game night",
    image: "/images/table-friends.jpg",
    caption: "Coffee table, late. The 4th Floor.",
  },
];

type FocusKey = string | null;
type SpecialsState = Record<SpecialSpace["id"], string>;

export function BoardBuilder({ product }: { product: Product }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const family = BOARDOPOLIS_PRESETS[0];
  const [title, setTitle] = useState("The Hale Family");
  const [presetId, setPresetId] = useState(product.kind === "boardopolis" ? family.id : product.presets[0].id);
  const [colorway, setColorway] = useState(product.colorways[0].id);
  const defaultPack = product.packs.find((p) => p.id === "silver") ?? product.packs[0];
  const [packId, setPackId] = useState(defaultPack.id);
  const [streets, setStreets] = useState(() => cloneStreets(family.streets));
  const [stationSet, setStationSet] = useState(family.stationsId);
  const [stations, setStations] = useState(() => [...nameSetById(STATION_SETS, family.stationsId).names]);
  const [utilitySet, setUtilitySet] = useState(family.utilitiesId);
  const [utilities, setUtilities] = useState(() => [...nameSetById(UTILITY_SETS, family.utilitiesId).names]);
  const [specials, setSpecials] = useState<SpecialsState>({ ...family.specials });
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState(0);
  const [focus, setFocus] = useState<FocusKey>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSlot = useRef<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const pack = product.packs.find((p) => p.id === packId) ?? product.packs[0];
  const extraEach = pack.extraCents ?? 10000;
  const price = pack.priceCents + extra * extraEach;
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
    setSpecials({ ...p.specials });
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
    if (cell.kind === "street") {
      return streets[cell.groupId]?.[cell.index] || STREET_GROUPS.find((g) => g.id === cell.groupId)?.examples[cell.index] || "Street";
    }
    if (cell.kind === "station") return stations[cell.index] || `Station ${cell.index + 1}`;
    if (cell.kind === "utility") return utilities[cell.index] || `Utility ${cell.index + 1}`;
    if (cell.kind === "corner") return specials[cell.id] || cell.label;
    return cell.label;
  }

  function cellKey(cell: BoardCell): string | null {
    if (cell.kind === "street") return `street:${cell.groupId}:${cell.index}`;
    if (cell.kind === "station") return `station:${cell.index}`;
    if (cell.kind === "utility") return `utility:${cell.index}`;
    if (cell.kind === "corner") return `special:${cell.id}`;
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
      pack: pack.label,
      photos: filled,
      spaces: isBoard ? streetNames : undefined,
      stations: isBoard ? stations : undefined,
      utilities: isBoard ? utilities : undefined,
      specials: isBoard ? specials : undefined,
    });
    void navigate({ to: "/cart" });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {isBoard ? (
        <div>
          <BoardRing
            title={title}
            photos={photos}
            slots={slots}
            focus={focus}
            specials={specials}
            cellLabel={cellLabel}
            cellKey={cellKey}
            onFocusCell={(key) => key && focusKey(key)}
            onOpenFile={openFile}
            onDrop={onDrop}
          />
          <p className="mt-3 text-center text-xs text-muted">
            START is GO (payday). HOME is the bank. Click a square to rename it.
          </p>
          <TableScenes presetId={presetId} />
        </div>
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

        <Field label={isBoard ? "Package" : "Pack size"}>
          {isBoard ? (
            <div className="space-y-2">
              {product.packs.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPackId(p.id);
                    setExtra(0);
                  }}
                  className={`w-full rounded-sm border px-4 py-3 text-left ${
                    packId === p.id ? "border-terracotta" : "border-border"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-ink">{p.label}</span>
                    <span className="tabular-nums text-ink">{formatUsd(p.priceCents)}</span>
                  </span>
                  {p.blurb ? <span className="mt-1 block text-xs text-muted">{p.blurb}</span> : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {product.packs.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPackId(p.id);
                    setExtra(0);
                  }}
                  className={`rounded-sm border px-3 py-3 text-sm ${
                    packId === p.id ? "border-terracotta text-ink" : "border-border text-muted"
                  }`}
                >
                  <span className="block font-medium text-ink">{p.label}</span>
                  <span className="tabular-nums">{formatUsd(p.priceCents)}</span>
                </button>
              ))}
            </div>
          )}
          {isBoard ? (
            <button type="button" className="mt-2 text-sm text-muted underline" onClick={() => setExtra((n) => n + 1)}>
              Extra copies +{formatUsd(extraEach)} each{extra ? ` · ${extra} added` : ""}
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
            <Field label="Specials — classic jobs, renamed">
              <p className="mb-3 text-xs text-muted">GO becomes payday. The bank becomes whoever holds the money.</p>
              <div className="space-y-4">
                {SPECIALS.map((sp) => {
                  const key = `special:${sp.id}`;
                  return (
                    <div key={sp.id}>
                      <p className="mb-1 text-xs tracking-wide text-muted uppercase">
                        {sp.label} <span className="normal-case tracking-normal">· {sp.role}</span>
                      </p>
                      <input
                        ref={(el) => {
                          fieldRefs.current[key] = el;
                        }}
                        value={specials[sp.id]}
                        placeholder={sp.examples[0]}
                        onFocus={() => setFocus(key)}
                        onChange={(e) => setSpecials((prev) => ({ ...prev, [sp.id]: e.target.value }))}
                        className={`w-full rounded-sm border bg-cream px-3 py-2 text-sm outline-none ${
                          focus === key ? "border-terracotta" : "border-border"
                        }`}
                      />
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {sp.examples.map((ex) => (
                          <button
                            key={ex}
                            type="button"
                            onClick={() => {
                              setSpecials((prev) => ({ ...prev, [sp.id]: ex }));
                              setFocus(key);
                            }}
                            className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted hover:border-ink hover:text-ink"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Field>

            <Field label="Streets — every coloured space">
              <p className="mb-3 text-xs text-muted">Tap a square on the board. Ideas fill the next empty slot.</p>
              <div className="max-h-[22rem] space-y-5 overflow-auto pr-1">
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
  specials,
  cellLabel,
  cellKey,
  onFocusCell,
  onOpenFile,
  onDrop,
}: {
  title: string;
  photos: Record<string, string>;
  slots: { id: string; top: string; left: string; w: string; h: string }[];
  focus: FocusKey;
  specials: SpecialsState;
  cellLabel: (cell: BoardCell) => string;
  cellKey: (cell: BoardCell) => string | null;
  onFocusCell: (key: string | null) => void;
  onOpenFile: (slot: string) => void;
  onDrop: (slot: string, ev: DragEvent) => void;
}) {
  return (
    <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-[1.4rem] bg-[#efe6d8] p-2 ring-1 ring-border sm:p-2.5">
      <div
        className="grid h-full w-full gap-[3px]"
        style={{
          gridTemplateColumns: "1.55fr repeat(9, 1fr) 1.55fr",
          gridTemplateRows: "1.55fr repeat(9, 1fr) 1.55fr",
        }}
      >
        {BOARD_CELLS.map((cell, i) => {
          const pos = boardPosition(i);
          const key = cellKey(cell);
          const group = cell.kind === "street" ? STREET_GROUPS.find((g) => g.id === cell.groupId) : null;
          const active = Boolean(key && focus === key);
              const inkText =
                cell.kind === "draw" ||
                cell.kind === "tax" ||
                group?.id === "sky" ||
                group?.id === "yellow";
              const fill =
                group?.color ??
                (cell.kind === "station" ? "#3d4a5c" : cell.kind === "utility" ? "#6a5a48" : cell.kind === "corner" ? "#fbf7f1" : "#f4ece0");
              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => onFocusCell(key)}
                  className={`relative overflow-hidden rounded-[3px] text-left transition ${
                    cell.kind === "corner" ? "ring-1 ring-ink/15" : ""
                  } ${active ? "z-10 ring-2 ring-terracotta" : ""}`}
                  style={{ gridColumn: pos.col, gridRow: pos.row, background: fill }}
                >
                  {cell.kind === "corner" ? (
                    <CornerFace id={cell.id} name={specials[cell.id]} />
                  ) : (
                    <TileFace side={pos.side} label={cellLabel(cell)} ink={inkText} />
                  )}
                </button>
              );
        })}
        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            gridColumn: "2 / 11",
            gridRow: "2 / 11",
            background:
              "radial-gradient(circle at 50% 54%, rgba(255,255,255,0.0) 14%, rgba(232,220,200,0.35) 15%, transparent 16%), radial-gradient(circle at 50% 54%, transparent 22%, rgba(90,110,100,0.07) 23%, transparent 24%), radial-gradient(circle at 50% 54%, transparent 32%, rgba(90,110,100,0.06) 33%, transparent 34%), #f6efe4",
          }}
        >
          <p className="pointer-events-none absolute left-1/2 top-[4%] z-10 w-[70%] -translate-x-1/2 text-center font-display text-base leading-tight text-ink sm:text-xl md:text-2xl">
            {title || "Your title"}
          </p>
          <Compass className="pointer-events-none absolute left-1/2 top-[54%] size-[18%] -translate-x-1/2 -translate-y-1/2 text-sage/40" strokeWidth={1} />
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

function CornerFace({ id, name }: { id: SpecialSpace["id"]; name: string }) {
  const meta = SPECIALS.find((s) => s.id === id);
  const Icon = id === "start" ? Compass : id === "pause" ? Pause : id === "home" ? Home : Undo2;
  return (
    <span className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-center">
      <Icon className="size-3 text-ink/70 sm:size-4" strokeWidth={1.5} />
      <span className="font-display text-[8px] leading-tight text-ink sm:text-[10px] md:text-[11px]">{name}</span>
      <span className="hidden text-[7px] tracking-wide text-muted uppercase sm:block">{meta?.label}</span>
    </span>
  );
}

function TileFace({
  side,
  label,
  ink,
}: {
  side: "bottom" | "left" | "top" | "right" | "corner";
  label: string;
  ink: boolean;
}) {
  const style: CSSProperties =
    side === "left"
      ? { writingMode: "vertical-rl", transform: "rotate(180deg)" }
      : side === "right"
        ? { writingMode: "vertical-rl" }
        : {};
  return (
    <span
      className={`flex h-full w-full items-center justify-center px-[1px] text-center font-medium leading-[1.05] ${
        ink ? "text-ink/80" : "text-cream"
      } text-[6px] sm:text-[7px] md:text-[8px]`}
      style={style}
    >
      {label}
    </span>
  );
}

function boardPosition(i: number): { row: number; col: number; side: "bottom" | "left" | "top" | "right" | "corner" } {
  if (i === 0) return { row: 1, col: 1, side: "corner" };
  if (i <= 9) return { row: 1, col: i + 1, side: "top" };
  if (i === 10) return { row: 1, col: 11, side: "corner" };
  if (i <= 19) return { row: i - 9, col: 11, side: "right" };
  if (i === 20) return { row: 11, col: 11, side: "corner" };
  if (i <= 29) return { row: 11, col: 31 - i, side: "bottom" };
  if (i === 30) return { row: 11, col: 1, side: "corner" };
  return { row: 41 - i, col: 1, side: "left" };
}

function PhotoDrop({
  slot,
  src,
  onOpen,
  onDrop,
}: {
  slot: { id: string; top: string; left: string; w: string; h: string };
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
      className="absolute z-[1] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-dashed border-ink/30 bg-cream/55 shadow-sm backdrop-blur-[1px] hover:bg-cream/80"
      style={{ top: slot.top, left: slot.left, width: slot.w, height: slot.h }}
      aria-label={`Photo ${slot.id}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full flex-col items-center justify-center text-muted">
          <ImagePlus className="size-3 sm:size-3.5" />
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

function TableScenes({ presetId }: { presetId: string }) {
  const [sceneId, setSceneId] = useState(presetId === "wedding" || presetId === "friends" ? presetId : "family");

  useEffect(() => {
    if (presetId === "wedding" || presetId === "friends" || presetId === "family") {
      setSceneId(presetId);
    }
  }, [presetId]);

  const scene = TABLE_SCENES.find((s) => s.id === sceneId) ?? TABLE_SCENES[0];

  return (
    <div className="mt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">On the table</p>
          <p className="font-display text-xl text-ink">How it actually looks</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {TABLE_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSceneId(s.id)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              sceneId === s.id ? "border-ink text-ink" : "border-border text-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <figure className="mt-3 overflow-hidden rounded-sm bg-cream ring-1 ring-border">
        <img src={scene.image} alt={scene.label} className="aspect-square w-full object-cover" />
        <figcaption className="px-3 py-3 text-sm text-muted">{scene.caption}</figcaption>
      </figure>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {TABLE_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSceneId(s.id)}
            className={`overflow-hidden rounded-sm ring-1 ${sceneId === s.id ? "ring-terracotta" : "ring-border"}`}
            aria-label={s.label}
          >
            <img src={s.image} alt="" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
