output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "audit_log_bucket" {
  description = "The name of the audit log S3 bucket"
  value       = aws_s3_bucket.audit_logs.id
}

output "rds_endpoint" {
  description = "The RDS endpoint"
  value       = aws_db_instance.rds.endpoint
  sensitive   = true
}
