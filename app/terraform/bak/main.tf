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

variable "private_key_path" {
  type = string
  description = "The path to the public key to be used for ssh"
}

# --------------------------------------------------------------------------

module "persistent" {
  source = "./persistent"
  project_name = var.project_name
  tenancy_ocid = var.tenancy_ocid
  private_ip_id = ""
}

module "network" {
  source = "./network"
  compartment_id = module.persistent.main_compartment_id
  region = var.region
  depends_on = [ module.persistent ]
}

data "oci_core_images" "ubuntu_images" {
  compartment_id = var.tenancy_ocid

  operating_system = "Canonical Ubuntu"
  operating_system_version = "24.04"
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

# Terraform を使って OCI 上に予約済 Public IP を付与した VM を作成する｜opst-mkrydik https://note.com/opst_mkrydik/n/n747c5e107d87

resource "oci_core_instance" "main_instance" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id = module.persistent.main_compartment_id
  shape = "VM.Standard.E2.1.Micro"
  source_details {
    source_type = "image"
    source_id = data.oci_core_images.ubuntu_images.images[0].id
  }

  display_name = "Main Public Instrance"
  create_vnic_details {
    subnet_id = module.network.public_subnet_id
    assign_public_ip = false
    hostname_label = "main"
  }
  metadata = {
    ssh_authorized_keys = var.private_key_path
  }
  preserve_boot_volume = false
}

# resource "oci_core_vnic_attachment" "main_vnic_attachment" {
#   create_vnic_details {}
#   instance_id = oci_core_instance.main_instance.id
#   subnet_id = module.network.public_subnet_id
# }

# resource "oci_core_public_ip_association" "main_public_ip_association" {
#   public_ip_id = oci_core_public_ip.main_public_ip.id
#   private_ip_id = oci_core_private_ip.main_private_ip.id
# }

# data "oci_core_vnic_attachments" "instance_vnics" {
#   compartment_id = module.persistent.main_compartment_id
#   instance_id = oci_core_instance.main_instance.id
# }

# data "oci_core_vnic" "instance_primary_vnic" {
#   vnic_id = data.oci_core_vnic_attachments.instance_vnics.vnic_attachments[0].vnic_id
# }

# data "oci_core_private_ips" "instance_private_ips" {
#   vnic_id = data.oci_core_vnic.instance_primary_vnic.vnic.id
# }

# resource "oci_core_public_ip" "instance_reserved_public_ip" {
#   compartment_id = module.persistent.main_compartment_id
#   display_name = "main-instance-public-ip"
#   lifetime = "RESERVED"
# }

# LB への public IP https://github.com/oracle/terraform-provider-oci/issues/1649#issuecomment-1331860084


# --------------------------------------------------------------------------

resource "oci_core_public_ip" "main_public_ip" {
  compartment_id = oci_identity_compartment.main_compartment.id
  display_name = "main-public-ip"
  # Public IP Addresses https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingpublicIPs.htm
  lifetime = "RESERVED"
}

# Enabling later Reassignment of reserved Public IPs to Private IPs in Terraform (as in the console) · Issue #1802 · oracle/terraform-provider-oci https://github.com/oracle/terraform-provider-oci/issues/1802

output "main_public_ip_id" {
  value = oci_core_public_ip.main_public_ip.id
}
