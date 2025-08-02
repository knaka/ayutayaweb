variable "project_name" {
  type = string
  description = "The name of the project"
}

variable "tenancy_name" {
  type = string
  description = "The name of the tenancy"
}

variable "tenancy_ocid" {
  type = string
  description = "The OCID of the tenancy (root compartment)"
}

variable "user_ocid" {
  type = string
  description = "The OCID of the user"
}

variable "region" {
  type = string
  description = "The region to create resources"
}

# variable "private_key_path" {
#   type = string
#   description = "The path to the public key to be used for ssh"
# }

# One public key per line.
# terraform-oci-compute-instance/docs/instance_ssh_keys.adoc at main · oracle-terraform-modules/terraform-oci-compute-instance https://github.com/oracle-terraform-modules/terraform-oci-compute-instance/blob/main/docs/instance_ssh_keys.adoc#providing-multiple-public-keys
variable "ssh_public_keys" {
  type = string
  description = "The public key to be used for ssh"
}
