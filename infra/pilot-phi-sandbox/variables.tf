variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "name_prefix" {
  description = "Prefix for resources"
  type        = string
  default     = "pilot-phi-sandbox"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    env    = "pilot"
    system = "zenthea"
    scope  = "phi-sandbox-boundary"
  }
}
