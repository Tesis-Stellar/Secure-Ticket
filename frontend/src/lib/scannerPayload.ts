export type ScannerRequestBody =
  | { qrToken: string }
  | { contractAddress: string; ticketRootId: number; version?: number }
  | { ticketId: string };

export type ParsedScannerPayload = {
  body: ScannerRequestBody;
  label: string;
};

export function parseScannerPayload(rawValue: string): ParsedScannerPayload {
  const trimmed = rawValue.trim();

  // Defensa contra screenshots del collectible en Freighter: el PNG del NFT
  // encodea un deeplink al dapp (no un qrToken firmado). Si el scanner ve una
  // URL, el dueño legítimo debe abrir Stellar Tickets para obtener el QR
  // rotativo de 60s.
  if (/^https?:\/\//i.test(trimmed)) {
    throw new Error(
      "Este QR es solo para abrir el boleto en la app. Pídele al asistente que muestre el QR de acceso desde Stellar Tickets."
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(trimmed);
  } catch {
    throw new Error("QR no reconocido");
  }

  if (payload.qrToken) {
    return {
      body: { qrToken: payload.qrToken },
      label: "QR firmado",
    };
  }

  if (payload.contractAddress && payload.ticketRootId != null) {
    return {
      body: {
        contractAddress: payload.contractAddress,
        ticketRootId: payload.ticketRootId,
        ...(payload.version != null ? { version: payload.version } : {}),
      },
      label: `${payload.contractAddress.slice(0, 6)}.../#${payload.ticketRootId}${payload.version != null ? `v${payload.version}` : ""}`,
    };
  }

  if (payload.ticketId) {
    return {
      body: { ticketId: payload.ticketId },
      label: payload.code || payload.ticketId.slice(0, 8),
    };
  }

  throw new Error("QR No Reconocido");
}
