locals {
  version = "3.6.0"
}

module "vcn" {
  # oracle-terraform-modules/vcn/oci | Terraform Registry https://registry.terraform.io/modules/oracle-terraform-modules/vcn/oci/3.6.0
  source = "oracle-terraform-modules/vcn/oci"
  version = local.version

  # Variables // https://github.com/oracle-terraform-modules/terraform-oci-vcn/blob/main/variables.tf
  compartment_id = var.compartment_id
  region = var.region
  internet_gateway_route_rules = null
  local_peering_gateways = null
  nat_gateway_route_rules = null
  vcn_name = "main-vcn"
  vcn_dns_label = "main"
  vcn_cidrs = ["10.0.0.0/16"]
  create_internet_gateway = true
  create_nat_gateway = true
  create_service_gateway = true

  # Outputs // https://github.com/oracle-terraform-modules/terraform-oci-vcn/blob/v3.6.0/outputs.tf
}
