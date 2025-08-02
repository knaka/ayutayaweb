variable "compartment_name" {
  type = string
  description = "The name of the project"
}

variable "parent_compartment_id" {
  type = string
  description = "The OCID of the tenancy (root compartment)"
}

variable "bucket_name" {
  type = string
  description = "The name of the bucket"
}

# --------------------------------------------------------------------------

# oci_identity_compartment | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/identity_compartment.html
resource "oci_identity_compartment" "main_compartment" {
  name = var.compartment_name
  compartment_id = var.parent_compartment_id
  description = "Compartment for the service"
    
  enable_delete = true
}

output "main_compartment_id" {
  value = oci_identity_compartment.main_compartment.id
}

# --------------------------------------------------------------------------

data "oci_identity_availability_domains" "ads" {
  compartment_id = oci_identity_compartment.main_compartment.id
}

# # Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_volume.html
# resource "oci_core_volume" "data_volume" {
#   availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
#   compartment_id = oci_identity_compartment.main_compartment.id
#   display_name = "data-volume"
#   size_in_gbs = 50
#   autotune_policies {
#     autotune_type = "DETACHED_VOLUME"
#     max_vpus_per_gb = "0"
#   }
#   vpus_per_gb = "0"
#   # lifecycle { prevent_destroy = true }
# }

# --------------------------------------------------------------------------

data "oci_objectstorage_namespace" "namespace" {}

# oci_objectstorage_bucket | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/objectstorage_bucket
resource "oci_objectstorage_bucket" "project" {
  name = var.bucket_name
  compartment_id = oci_identity_compartment.main_compartment.id
  namespace = data.oci_objectstorage_namespace.namespace.namespace
}

# oci_identity_dynamic_group | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/identity_dynamic_group
resource "oci_identity_dynamic_group" "instance_dynamic_group" {
  name = "instance-dynamic-group"
  description = "Dynamic group for instances"
  # Must be tenancy OCID.
  compartment_id = var.parent_compartment_id

  matching_rule = "ALL {instance.compartment.id = '${oci_identity_compartment.main_compartment.id}'}"
}

resource "oci_identity_policy" "instance_to_object_storage_policy" {
  name = "storage-access-policy"
  description = "Allow instance-principals to manage object-family in the compartment"
  # Must be tenancy OCID?
  compartment_id = var.parent_compartment_id

  statements = [
    "Allow group instance-dynamic-group to manage object-family in compartment ${oci_identity_compartment.main_compartment.name}"
  ]
}
