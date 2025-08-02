variable "compartment_id" {
  type = string
  description = "The OCID of the compartment"
}

variable "instance_shape" {
  type = string
  description = "The shape of the instance"
}

variable "image_id" {
  type = string
  description = "The OCID of the image"
}

variable "availability_domain" {
  type = string
  description = "The availability domain"
}

# --------------------------------------------------------------------------

# Oracle Cloud Infrastructure Images https://docs.public.oneportal.content.oci.oraclecloud.com/en-us/iaas/images/ubuntu-2204/index.htm

resource "oci_core_instance" "main_instance" {
  availability_domain = var.availability_domain
  compartment_id = oci_identity_compartment.main_compartment.id
  shape = var.instance_shape
  source_details {
    source_id = var.image_id
    source_type = "image"
  }

  display_name = "Main Public Instrance"
  create_vnic_details {
    assign_public_ip = false
    subnet_id = var.subnet_id
  }
  metadata = {
    ssh_authorized_keys = file("/Users/knaka/Dropbox/keys/id_ed25519.pub")
  }
  preserve_boot_volume = false
}
