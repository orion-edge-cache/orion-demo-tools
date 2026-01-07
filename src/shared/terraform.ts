/**
 * Terraform state reader
 * 
 * Reads endpoints from ~/.config/orion/terraform.tfstate
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import type { Endpoints, TerraformState } from "./types.js";

const STATE_FILE_PATH = path.join(os.homedir(), ".config", "orion", "terraform.tfstate");

/**
 * Check if terraform state file exists
 */
export async function stateFileExists(): Promise<boolean> {
  try {
    await fs.access(STATE_FILE_PATH);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read and parse terraform state file
 */
async function readStateFile(): Promise<TerraformState> {
  const content = await fs.readFile(STATE_FILE_PATH, "utf-8");
  return JSON.parse(content) as TerraformState;
}

/**
 * Get endpoints from terraform state
 * 
 * @throws Error if state file doesn't exist or is invalid
 */
export async function getEndpointsFromState(): Promise<Endpoints> {
  if (!(await stateFileExists())) {
    throw new Error(
      `Terraform state not found at ${STATE_FILE_PATH}. Is infrastructure deployed?`
    );
  }

  const state = await readStateFile();

  if (!state.outputs?.cdn_service?.value?.domain_name) {
    throw new Error("Invalid terraform state: missing cdn_service output");
  }

  return {
    vclService: `https://${state.outputs.cdn_service.value.domain_name}/graphql`,
  };
}
