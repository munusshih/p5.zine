const UNIT_TO_INCH = {
  in: 1,
  inch: 1,
  inches: 1,
  cm: 1 / 2.54,
  mm: 1 / 25.4,
  pt: 1 / 72,
  px: null,
};

function parseWithUnit(value) {
  const trimmed = String(value).trim().toLowerCase();
  const match = trimmed.match(/^([0-9]*\.?[0-9]+)\s*([a-z%]*)$/);
  if (!match) {
    return null;
  }
  return {
    number: Number(match[1]),
    unit: match[2] || null,
  };
}

export function parseDimension(value, options = {}) {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  const dpi = typeof options.dpi === "number" ? options.dpi : 96;
  const defaultUnit = options.defaultUnit || null;

  if (typeof value === "number") {
    if (defaultUnit && UNIT_TO_INCH[defaultUnit]) {
      return value * UNIT_TO_INCH[defaultUnit] * dpi;
    }
    return value;
  }

  const parsed = parseWithUnit(value);
  if (!parsed) {
    return null;
  }

  const unit = parsed.unit || defaultUnit || "px";
  if (unit === "px") {
    return parsed.number;
  }

  const inchFactor = UNIT_TO_INCH[unit];
  if (!inchFactor) {
    return null;
  }

  return parsed.number * inchFactor * dpi;
}

export function resolvePageDimensions(config = {}, defaults = {}) {
  const dpi =
    typeof config.pageDPI === "number"
      ? config.pageDPI
      : typeof config.paperDPI === "number"
        ? config.paperDPI
        : typeof config.dpi === "number"
          ? config.dpi
          : 96;
  const defaultUnit =
    typeof config.pageUnit === "string"
      ? config.pageUnit
      : typeof config.paperUnit === "string"
        ? config.paperUnit
        : typeof config.unit === "string"
          ? config.unit
          : null;

  let width = null;
  let height = null;

  if (config.pageSize) {
    if (Array.isArray(config.pageSize)) {
      width = config.pageSize[0];
      height = config.pageSize[1];
    } else if (typeof config.pageSize === "object") {
      width = config.pageSize.width;
      height = config.pageSize.height;
    }
  }

  if (typeof config.pageWidth !== "undefined") {
    width = config.pageWidth;
  }
  if (typeof config.pageHeight !== "undefined") {
    height = config.pageHeight;
  }

  if (typeof width === "undefined" || width === null || typeof height === "undefined" || height === null) {
    let paperWidth = null;
    let paperHeight = null;

    if (config.paperSize) {
      if (Array.isArray(config.paperSize)) {
        paperWidth = config.paperSize[0];
        paperHeight = config.paperSize[1];
      } else if (typeof config.paperSize === "object") {
        paperWidth = config.paperSize.width;
        paperHeight = config.paperSize.height;
      }
    }

    if (typeof config.paperWidth !== "undefined") {
      paperWidth = config.paperWidth;
    }
    if (typeof config.paperHeight !== "undefined") {
      paperHeight = config.paperHeight;
    }

    const parsedPaperWidth = parseDimension(paperWidth, { dpi, defaultUnit });
    const parsedPaperHeight = parseDimension(paperHeight, { dpi, defaultUnit });

    if (typeof parsedPaperWidth === "number" && typeof parsedPaperHeight === "number") {
      width = parsedPaperHeight / 4;
      height = parsedPaperWidth / 2;
    }
  }

  const parsedWidth = parseDimension(width, { dpi, defaultUnit });
  const parsedHeight = parseDimension(height, { dpi, defaultUnit });

  let finalWidth = typeof parsedWidth === "number" ? parsedWidth : defaults.width;
  let finalHeight = typeof parsedHeight === "number" ? parsedHeight : defaults.height;

  if (typeof parsedWidth === "number" && typeof parsedHeight !== "number" && defaults.ratio) {
    finalHeight = parsedWidth / defaults.ratio;
  }

  if (typeof parsedHeight === "number" && typeof parsedWidth !== "number" && defaults.ratio) {
    finalWidth = parsedHeight * defaults.ratio;
  }

  return {
    width: finalWidth,
    height: finalHeight,
    dpi,
  };
}
