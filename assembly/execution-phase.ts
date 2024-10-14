import {
  Bytes,
  Console,
  Process,
  httpFetch,
  u128,
} from "@seda-protocol/as-sdk/assembly";

// API response structure for the price feed
@json
class PriceFeedResponse {
  symbol!: string;
  price!: string;
}

/**
 * Executes the data request phase within the SEDA network.
 * This phase is responsible for fetching non-deterministic data (e.g., price of an asset pair)
 * from an external source such as a price feed API. The input specifies the asset pair to fetch.
 */
export function executionPhase(): void {
  const drInputsRaw = Process.getInputs().toUtf8String();

  // Log the asset pair being fetched as part of the Execution Standard Out.
  Console.log(`Fetching pairs ${drInputsRaw}`);

  // Split the input string into symbolA and symbolB.
  // Example: "ETH-USDC" will be split into "ETH" and "USDC".
  const drInputs = drInputsRaw.split("-");

  // Convert string inputs to i32
  const start = I32.parseInt(drInputs[0]);
  const end = I32.parseInt(drInputs[1]);

  
  // Make an HTTP request to a price feed API to get the price for the symbol pair.
  // The URL is dynamically constructed using the provided symbols (e.g., ETHUSDC).
  const response = httpFetch(
    `https://api.binance.com/api/v3/ticker/price`
  );

  // Check if the HTTP request was successfully fulfilled.
  if (!response.ok) {
    // Handle the case where the HTTP request failed or was rejected.
    Console.error(
      `HTTP Response was rejected: ${response.status.toString()} - ${response.bytes.toUtf8String()}`
    );
    // Report the failure to the SEDA network with an error code of 1.
    Process.error(Bytes.fromUtf8String("Error while fetching price feed"));
  }

  // Parse the API response as defined earlier.
  const data = response.bytes.toJSON<PriceFeedResponse[]>().slice(start, end);


  // Report the successful result back to the SEDA network.
  Process.success(Bytes.fromJSON(data));
}
