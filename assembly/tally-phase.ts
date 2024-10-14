import { Tally, Process, Bytes, u128, Console, JSON } from "@seda-protocol/as-sdk/assembly";

/**
 * Executes the tally phase within the SEDA network.
 * This phase aggregates the results (e.g., price data) revealed during the execution phase,
 * calculates the median value, and submits it as the final result.
 * Note: The number of reveals depends on the replication factor set in the data request parameters.
 */
export function tallyPhase(): void {
  // Tally inputs can be retrieved from Process.getInputs(), though it is unused in this example.
  // const tallyInputs = Process.getInputs();

  // Retrieve consensus reveals from the tally phase.
  const reveals = Tally.getReveals();

  const revealBytes: string[] = [];

  for (let i = 0; i < reveals.length; i++) {
    if(reveals[i].inConsensus) {
      revealBytes.push(reveals[i].reveal.toUtf8String())
    }
  }

  Process.success(Bytes.fromUtf8String(JSON.stringify(revealBytes)))
}
