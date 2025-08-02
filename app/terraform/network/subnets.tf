resource "oci_core_subnet" "private_subnet" {
  compartment_id = var.compartment_id
  vcn_id = module.vcn.vcn_id
  cidr_block = "10.0.1.0/24"
  route_table_id = module.vcn.nat_route_id
  security_list_ids = [oci_core_security_list.private_subnet_sl.id]
  display_name = "private-subnet"
  prohibit_public_ip_on_vnic = true
}

resource "oci_core_subnet" "public_subnet" {
  compartment_id = var.compartment_id
  vcn_id = module.vcn.vcn_id
  cidr_block = "10.0.0.0/24"
  route_table_id = module.vcn.ig_route_id
  security_list_ids = [oci_core_security_list.public_subnet_sl.id]
  display_name = "public-subnet"
}

output "public_subnet_id" {
  value = oci_core_subnet.public_subnet.id
}

resource "oci_core_security_list" "private_subnet_sl" {
  compartment_id = var.compartment_id
  vcn_id = module.vcn.vcn_id
  display_name = "private-subnet-sl"

  # egress everywhere
  egress_security_rules {
    stateless = false
    destination = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol = "all"
  }

  # ingress only from our cidr
  ingress_security_rules {
    stateless = false
    source = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    protocol = "all"
  }
}

resource "oci_core_security_list" "public_subnet_sl" {
  compartment_id = var.compartment_id
  vcn_id = module.vcn.vcn_id
  display_name = "public-subnet-sl"

  # egress everywhere
  egress_security_rules {
    stateless = false
    destination = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol = "all"
  }

  # ingres only our cidr
  ingress_security_rules {
    stateless = false
    source = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    protocol = "all"
  }
}

# Terraform を使って OCI 上に予約済 Public IP を付与した VM を作成する｜opst-mkrydik https://note.com/opst_mkrydik/n/n747c5e107d87

# data "oci_core_private_ips" "private_ips_of_public_subnet" {
# }

# oci_core_public_ip | Resources | oracle/oci | Terraform | Terraform Registry https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_public_ip
# resource "oci_core_public_ip" "main_public_ip" {
#   compartment_id = var.compartment_id
#   display_name = "main-public-ip"
#   # Public IP Addresses https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingpublicIPs.htm
#   lifetime = "RESERVED"
#   # private_ip_id = data.oci_core_private_ips.private_ips_of_public_subnet.private_ips[0].id
#   # private_ip_id  = "${lookup(data.oci_core_private_ips.private_ips_of_public_subnet.private_ips[0], "id")}"
#   lifecycle {
#     prevent_destroy = false
#   }
# }
