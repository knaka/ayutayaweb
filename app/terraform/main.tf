locals {
  my_ip_addr = "183.86.175.167/32"

  vcn_cidr_block = "10.0.0.0/16"
  public_subnet_cidr_block = "10.0.1.0/24"
  private_subnet_cidr_block = "10.0.2.0/24"
}

# -------------------------------------------------------------------------- 

locals {
  cidr_block_any = "0.0.0.0/0"
}

# -------------------------------------------------------------------------- 

module "persistent" {
  source = "./persistent"

  parent_compartment_id = var.tenancy_ocid
  compartment_name = var.project_name
  bucket_name = "${var.project_name}-${terraform.workspace}"
}

# --------------------------------------------------------------------------

module "vcn" {
  # source = "./modules/terraform-oci-vcn"
  # oracle-terraform-modules/vcn/oci | Terraform Registry https://registry.terraform.io/modules/oracle-terraform-modules/vcn/oci/3.6.0
  source = "oracle-terraform-modules/vcn/oci"

  # tenancy_id = var.tenancy_ocid
  compartment_id = module.persistent.main_compartment_id
  region = var.region
  internet_gateway_route_rules = null
  local_peering_gateways = null
  nat_gateway_route_rules = null
  vcn_name = "main-vcn"
  vcn_dns_label = "main"
  vcn_cidrs = [local.vcn_cidr_block]
  create_internet_gateway = true
  create_nat_gateway = true
  create_service_gateway = true
  subnets = {
    "public_subnet" = {
      type = "public"
      cidr_block = local.public_subnet_cidr_block
    }
    "private_subnet" = {
      type = "private"
      cidr_block = local.private_subnet_cidr_block
    }
  }
  lockdown_default_seclist = true
}

locals {
  protocol_icmp = "1"
  protocol_tcp = "6"
  protocol_udp = "17"
  protocol_icmpv6 = "58"

  # Internet Control Message Protocol (ICMP) Parameters https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml 
  icmp_type_destination_unreachable = "3"
  icmp_code_fragmentation_needed_and_df_set = "4"
}

# Managing Default VCN Resources https://docs.oracle.com/en-us/iaas/Content/ResourceManager/Tasks/terraform-manage-default-vcn-resources.htm
# oci_core_security_list | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_security_list
resource "oci_core_default_security_list" "main" {
  manage_default_resource_id = module.vcn.default_security_list_id
  display_name = "main-default-security-list"
  egress_security_rules {
    destination = local.cidr_block_any
    protocol    = "all"
  }
  dynamic "ingress_security_rules" {
    for_each = [
      # { port: 22 },
      { source: local.my_ip_addr, port: 22 },
      { source: local.vcn_cidr_block, port: 22 },
      { port: 80 },
      { port: 443 },
    ]
    content {
      protocol = local.protocol_tcp
      source = try(ingress_security_rules.value.source, local.cidr_block_any)
      tcp_options {
        min = ingress_security_rules.value.port
        max = ingress_security_rules.value.port
      }
    }
  }
  ingress_security_rules {
    protocol = local.protocol_icmp
    source   = local.cidr_block_any
    icmp_options {
      type = local.icmp_type_destination_unreachable
      code = local.icmp_code_fragmentation_needed_and_df_set
    }
  }
}

locals {
  vcn_id = module.vcn.vcn_id
  private_subnet_id = module.vcn.subnet_id["private_subnet"]
  public_subnet_id = module.vcn.subnet_id["public_subnet"]
}

# --------------------------------------------------------------------------

# oci_core_public_ip | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_public_ip
resource "oci_core_public_ip" "main" {
  compartment_id = module.persistent.main_compartment_id
  display_name = "main-public-ip"
  lifetime = "RESERVED"

  # Switch to “null” to destroy the public instance.
  private_ip_id = module.public_instance.private_ips_all_attributes[0].private_ips[0].id
  # private_ip_id = null

  lifecycle { prevent_destroy = true }
}

# --------------------------------------------------------------------------

locals {
  shape = "VM.Standard.E2.1.Micro"
}

# oci_core_images | Data Sources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/data-sources/core_images
data "oci_core_images" "main" {
  compartment_id = var.tenancy_ocid
  operating_system = "Canonical Ubuntu"
  operating_system_version = "24.04"
}

locals {
  default_users = {
    "Oracle Linux" = "opc"
    "Canonical Ubuntu" = "ubuntu"
    "CentOS" = "centos"
  }
}

output "default_user" {
  value = local.default_users[data.oci_core_images.main.images[0].operating_system]
}

module "public_instance" {
  source = "oracle-terraform-modules/compute-instance/oci"
  instance_count = 1 # how many instances do you want?
  ad_number = 1 # AD number to provision instances. If null, instances are provisionned in a rolling manner starting with AD1
  compartment_ocid = module.persistent.main_compartment_id
  instance_display_name = "public-instance"
  source_ocid = data.oci_core_images.main.images[0].id
  # One subnet for once instance. If the length is lesser than the instance count, it loops.
  subnet_ocids = [local.public_subnet_id]
  public_ip = "NONE"
  ssh_public_keys = var.ssh_public_keys
  # Multiple storages for each instance. Between 50 GB and 32768 GB for VM.Standard.E2.1.Micro.
  # 200GB is for free tier. // Always Freeリソース https://docs.oracle.com/ja-jp/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
  block_storage_sizes_in_gbs = [50]
  shape = local.shape
  instance_state = "RUNNING" # RUNNING or STOPPED
  # Policy-Based Backups https://docs.oracle.com/en-us/iaas/Content/Block/Tasks/schedulingvolumebackups.htm
  # Cost for block volume and backup size?
  boot_volume_backup_policy = "disabled"
}

module "private_instance" {
  source = "oracle-terraform-modules/compute-instance/oci"
  instance_count = 1
  ad_number = 1
  compartment_ocid = module.persistent.main_compartment_id
  instance_display_name = "private-instance"
  source_ocid = data.oci_core_images.main.images[0].id
  subnet_ocids = [local.private_subnet_id]
  public_ip = "NONE"
  ssh_public_keys = var.ssh_public_keys
  block_storage_sizes_in_gbs = [50]
  shape = local.shape
  instance_state = "RUNNING" # RUNNING or STOPPED
  boot_volume_backup_policy = "disabled"
}

# --------------------------------------------------------------------------

resource "oci_bastion_bastion" "main" {
  compartment_id = module.persistent.main_compartment_id
  bastion_type = "STANDARD"
  target_subnet_id = local.private_subnet_id
  
  client_cidr_block_allow_list  = [local.my_ip_addr]
  name = "main-bastion"
}

# --------------------------------------------------------------------------

resource "oci_identity_customer_secret_key" "project" {
  display_name = "${var.project_name}-${terraform.workspace}"
  # This should be the user of less privileged?
  user_id = var.user_ocid
}

output "aws_access_key_id" {
  value = oci_identity_customer_secret_key.project.id
}

output "aws_secret_access_key" {
  value = oci_identity_customer_secret_key.project.key
}

# --------------------------------------------------------------------------

# Terraform Registry https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password
resource "random_password" "db_password" {
  length  = 16
  special = true
  upper = true
  lower = true
}

output "db_password" {
  value = random_password.db_password.result
  sensitive = true
}
