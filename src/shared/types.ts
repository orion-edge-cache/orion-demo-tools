/**
 * Shared types for Orion tools
 */

/**
 * Endpoints configuration from Terraform state
 */
export interface Endpoints {
  vclService: string;
}

/**
 * Terraform output structure for CDN service
 */
export interface CdnServiceOutput {
  domain_name: string;
  service_id: string;
}

/**
 * Terraform output structure for Compute service
 */
export interface ComputeServiceOutput {
  domain_name: string;
  service_id: string;
}

/**
 * Terraform state outputs structure
 */
export interface TerraformOutputs {
  cdn_service: {
    value: CdnServiceOutput;
  };
  compute_service: {
    value: ComputeServiceOutput;
  };
}

/**
 * Terraform state file structure
 */
export interface TerraformState {
  outputs: TerraformOutputs;
}
