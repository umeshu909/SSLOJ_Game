"use client";

import { useState, useCallback } from "react";
import type { Character, Arayashiki, Artifact, Vestige } from "@/lib/teambuilder/types";

// Types d'entrée pour l’export
export type ExportParams = {
  team: (Character | null)[];
  setups: Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>;
  vestige: Vestige | null;
  teamName: string;
};

export default function useExportCanvas() {
  const [exporting, setExporting] = useState(false);

  // --- implémentation factorisée ---
  const drawTeamToCanvas = useCallback(async (canvas: HTMLCanvasElement, params: ExportParams) => {
    const { team, setups, vestige, teamName } = params;

    const W = 1080;
    const H = 1920;
    const P = 80;
    const CONTENT_SHIFT_Y = 80;
    const ARAYA_IMG_INSET = 12;
    const ARAYA_OVERLAY_INSET = 2;

    const ctx = canvas.getContext("2d")!;
    canvas.width = W;
    canvas.height = H;

    // bg
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0e1630");
    bg.addColorStop(1, "#0b1126");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // titre
    const titleText = (teamName?.trim() || "Ma team").trim();
    ctx.font = '400 64px "Times New Roman", Georgia, serif';
    const tm = ctx.measureText(titleText);
    const titleH =
      (tm as any).actualBoundingBoxAscent && (tm as any).actualBoundingBoxDescent
        ? (tm as any).actualBoundingBoxAscent + (tm as any).actualBoundingBoxDescent
        : 64;
    const titleX = (W - tm.width) / 2;
    const titleY = P;
    const titleGrad = ctx.createLinearGradient(titleX, titleY, titleX + tm.width, titleY + 60);
    titleGrad.addColorStop(0, "#f5cd76");
    titleGrad.addColorStop(0.5, "#ffe08a");
    titleGrad.addColorStop(1, "#d3a64a");
    ctx.fillStyle = titleGrad;
    ctx.textBaseline = "top";
    ctx.fillText(titleText, titleX, titleY);

    const TITLE_BLOCK_BOTTOM = titleY + titleH + 28;

    // helpers
    const loadImage = (src?: string | null): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const drawContain = (
      c: CanvasRenderingContext2D,
      img: CanvasImageSource,
      x: number, y: number, w: number, h: number
    ) => {
      const iw = (img as any).naturalWidth || (img as any).width || 1;
      const ih = (img as any).naturalHeight || (img as any).height || 1;
      const r = Math.min(w / iw, h / ih);
      const rw = iw * r;
      const rh = ih * r;
      const dx = x + (w - rw) / 2;
      const dy = y + (h - rh) / 2;
      const prev = (c as any).imageSmoothingEnabled;
      (c as any).imageSmoothingEnabled = true;
      c.drawImage(img as any, dx, dy, rw, rh);
      (c as any).imageSmoothingEnabled = prev;
    };

    const strokeGradientRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lw = 1) => {
      const g = c.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0.0, "#7aa7ff");
      g.addColorStop(0.33, "#c9d2ff");
      g.addColorStop(0.66, "#e9b4ff");
      g.addColorStop(1.0, "#a1b8ff");
      c.strokeStyle = g;
      c.lineWidth = lw;
      c.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
    };

    const strokeSolidRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color = "#93a4c6", lw = 1) => {
      c.strokeStyle = color;
      c.lineWidth = lw;
      c.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
    };

    type CellBorder = "gradient" | "solid" | "none";
    const drawClippedCell = async (
      c: CanvasRenderingContext2D,
      imgUrl: string | undefined,
      overlayUrl: string | undefined,
      x: number, y: number, w: number, h: number,
      opts?: { pad?: number; border?: CellBorder; imgInset?: number; overlayInset?: number; borderWidth?: number }
    ) => {
      const pad = opts?.pad ?? 8;
      const lw = opts?.borderWidth ?? 1;
      if (opts?.border === "gradient") strokeGradientRect(c, x, y, w, h, lw);
      else if (opts?.border === "solid") strokeSolidRect(c, x, y, w, h, "#454d5eff", lw);

      const innerX = x + pad;
      const innerY = y + pad;
      const innerW = w - pad * 2;
      const innerH = h - pad * 2;

      c.save();
      c.beginPath();
      c.rect(innerX, innerY, innerW, innerH);
      c.clip();

      const imgInset = opts?.imgInset ?? 0;
      const imgX = innerX + imgInset;
      const imgY = innerY + imgInset;
      const imgW = innerW - imgInset * 2;
      const imgH = innerH - imgInset * 2;

      if (imgUrl) {
        const img = await loadImage(imgUrl);
        if (img) drawContain(c, img, imgX, imgY, imgW, imgH);
      }

      if (overlayUrl) {
        const ovInset = opts?.overlayInset ?? 0;
        const ovX = innerX + ovInset;
        const ovY = innerY + ovInset;
        const ovW = innerW - ovInset * 2;
        const ovH = innerH - ovInset * 2;
        const ov = await loadImage(overlayUrl);
        if (ov) drawContain(c, ov, ovX, ovY, ovW, ovH);
      }

      c.restore();
    };

    // --- métriques
    const slotW = 200, slotH = 240;
    const colGapBack = 24, colGapFront = 56;
    const formationHeight = slotH * 2 + 60;
    const verticalGapRows = 60;
    const rowH = 160, spacer = 16, cellGap = 8;
    const gapBetweenFormationAndTable = 60;

    const signH = 18;
    const SIG_MARGIN = 32;
    const availableTop = P + (titleH + 28);
    const availableBottom = H - (P + signH) - SIG_MARGIN;
    const contentHeight = formationHeight + gapBetweenFormationAndTable + rowH * 5 + 16 * 4;
    const contentStartY = availableTop + Math.max(0, (availableBottom - availableTop - contentHeight) / 2);

    // --- contenu
    ctx.save();
    ctx.translate(0, CONTENT_SHIFT_Y);

    // formation
    const centerX = W / 2;
    let y = contentStartY;
    const rowBackY  = y + verticalGapRows / 2;
    const rowFrontY = rowBackY + slotH + verticalGapRows / 2;

    const getCharImg = (c?: Character | null) => (c?.image ? c.image : "");
    const getArayaImg = (a?: Arayashiki | null) => (a?.pic ? a.pic : "");
    const getArtifactImg = (a?: Artifact | null) => (a?.icon ? a.icon : "");
    const arayaOverlayUrl = (quality?: string) => (quality ? `/overlays/quality-${quality}.png` : "");

    const drawCharSlot = async (ch: Character | null, cx: number, cy: number, badge: string) => {
      const x = cx - slotW / 2;
      const y = cy - slotH / 2;
      await drawClippedCell(ctx, getCharImg(ch || undefined), undefined, x, y, slotW, slotH, { pad: 8, border: "gradient", borderWidth: 1 });
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(x + 8, y + 8, 28, 22);
      ctx.fillStyle = "#fff";
      ctx.font = "600 13px Inter, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(badge, x + 16, y + 10);
    };

    await drawCharSlot(team[2], centerX - (slotW + colGapBack), rowBackY + 8, "3");
    await drawCharSlot(team[3], centerX,                           rowBackY - 8, "4");
    await drawCharSlot(team[4], centerX + (slotW + colGapBack),    rowBackY + 8, "5");
    await drawCharSlot(team[0], centerX - (slotW + colGapFront) / 2.2, rowFrontY, "1");
    await drawCharSlot(team[1], centerX + (slotW + colGapFront) / 2.2, rowFrontY, "2");

    // vestige (si canvas dispo)
    if (vestige?.id) {
      const vCanvas = document.getElementById(`canvas-vestige-${vestige.id}`) as HTMLCanvasElement | null;
      if (vCanvas) {
        const vSize = 150;
        const vx = W - P - vSize;
        const vy = rowFrontY + slotH / 2 - vSize;
        ctx.fillStyle = "#B0B7C3";
        ctx.font = "600 16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillText("Vestige", vx - 4, vy - 28);
        // @ts-ignore
        const drawContainCanvas = (img: HTMLCanvasElement) => drawContain(ctx, img, vx, vy, vSize, vSize);
        drawContainCanvas(vCanvas);
      }
    }

    // tableau
    y = rowFrontY + slotH / 2 + gapBetweenFormationAndTable;
    const tableLeft = P, tableRight = W - P;
    const tableWidth = tableRight - tableLeft;

    const totalCols = 9;
    const innerGaps = cellGap * (totalCols - 1);
    const fixedSpace = spacer * 2;
    const available = tableWidth - innerGaps - fixedSpace;
    const fr = available / 7;
    const colW = { char: fr, art: fr, araya: fr } as const;

    const drawSolidCell = async (imgUrl?: string, overlayUrl?: string, x?: number, yy?: number, w?: number, h?: number) => {
      await drawClippedCell(ctx, imgUrl, overlayUrl, x!, yy!, w!, h!, { pad: 8, border: "solid", borderWidth: 1 });
    };

    let ry = y;
    for (let r = 0; r < team.length; r++) {
      const ch = team[r];
      let x = tableLeft;

      await drawClippedCell(ctx, getCharImg(ch || undefined), undefined, x, ry, colW.char, rowH, { pad: 8, border: "gradient", borderWidth: 1 });

      x += colW.char + cellGap + spacer + cellGap;

      const art = ch ? setups[(ch as any).id]?.artifact : null;
      await drawSolidCell(getArtifactImg(art || undefined), undefined, x, ry, colW.art, rowH);

      x += colW.art + cellGap + spacer + cellGap;

      for (let i = 0; i < 5; i++) {
        const araya = ch ? setups[(ch as any).id]?.arayas?.[i] : null;
        const imgUrl = getArayaImg(araya || undefined);
        const ovUrl = araya ? `/overlays/quality-${(araya as any).quality}.png` : undefined;
        await drawClippedCell(ctx, imgUrl, ovUrl, x, ry, colW.araya, rowH, {
          pad: 8, border: "solid", borderWidth: 1, imgInset: ARAYA_IMG_INSET, overlayInset: ARAYA_OVERLAY_INSET,
        });
        x += colW.araya + cellGap;
      }

      ry += rowH + 16;
    }

    ctx.restore();

    // signature
    ctx.fillStyle = "#9aa3af";
    ctx.font = "500 18px Inter, system-ui, -apple-system, Segoe UI, Roboto";
    const sw = ctx.measureText("généré par https://ssloj.com").width;
    ctx.fillText("généré par https://ssloj.com", (W - sw) / 2, H - P - 18);
  }, []);

  const exportAsDataURL = useCallback(async (params: ExportParams) => {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await drawTeamToCanvas(canvas, params);
      return canvas.toDataURL("image/png");
    } finally {
      setExporting(false);
    }
  }, [drawTeamToCanvas]);

  const exportAsBlob = useCallback(async (params: ExportParams) => {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await drawTeamToCanvas(canvas, params);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
      );
      return blob;
    } finally {
      setExporting(false);
    }
  }, [drawTeamToCanvas]);

  return { exporting, exportAsDataURL, exportAsBlob };
}