variable "cluster_name" {
  type = "string"
}

variable "location" {
  default = "us-central1-a"
  type    = "string"
}

variable "machine_type" {
  default = "n1-standard-1"
  type    = "string"
}

variable "max_node_count" {
  default = 1
  type    = "string"
}

variable "min_node_count" {
  default = 1
  type    = "string"
}

variable "name" {
  default = "default-pool"
  type    = "string"
}

variable "preemptible" {
  default = false
  type    = "string"
}
