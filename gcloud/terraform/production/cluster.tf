resource "google_container_cluster" "primary" {
  initial_node_count       = 1
  location                 = "${var.zone}"
  min_master_version       = "1.12.7-gke.10"
  name                     = "primary"
  node_version             = "1.12.7-gke.10"
  remove_default_node_pool = true

  ip_allocation_policy {
    use_ip_aliases = true
  }
}

module "default_pool" {
  source = "../modules/node-pool"

  cluster_name   = "${google_container_cluster.primary.name}"
  machine_type   = "n1-standard-2"
  max_node_count = 3
  min_node_count = 1
}

module "preemptible_pool" {
  source = "../modules/node-pool"

  cluster_name   = "${google_container_cluster.primary.name}"
  machine_type   = "g1-small"
  max_node_count = 2
  min_node_count = 1
  name           = "preemptible-pool"
  preemptible    = true
}