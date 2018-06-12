variable "dns_name" {
  default = "drivesmartcbus.com"
}

resource "aws_route53_zone" "main" {
  name = "${var.dns_name}"
}


resource "aws_route53_record" "ns" {
  zone_id = "${aws_route53_zone.main.zone_id}"
  name = "${var.dns_name}"
  type = "NS"
  ttl = "30"

  records = [
    "${aws_route53_zone.main.name_servers.0}",
    "${aws_route53_zone.main.name_servers.1}",
    "${aws_route53_zone.main.name_servers.2}",
    "${aws_route53_zone.main.name_servers.3}",
  ]
}

resource "aws_route53_record" "cert_domain_verification" {
  zone_id = "${aws_route53_zone.main.zone_id}"
  name = "_23e0705e6d375e3b1d868773b74af662.${var.dns_name}"
  type = "CNAME"
  ttl = "30"

  records = [
    "_bc6a032549e56c911c308163202f969d.acm-validations.aws."
  ]
}

resource "aws_acm_certificate" "cert" {
  domain_name = "${var.dns_name}"
  validation_method = "DNS"
}


resource "aws_route53_record" "www" {
  zone_id = "${aws_route53_zone.main.zone_id}"
  name    = "${var.dns_name}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.website.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.website.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "smart_experience_web" {
  bucket = "smart-experience-web"
  acl    = "public-read"
  policy = "${data.aws_iam_policy_document.bucket_policy.json}"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

data "aws_iam_policy_document" "bucket_policy" {
  statement {
    effect = "Allow"
    principals = {
      type = "AWS"
      identifiers = ["arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.origin_access_identity.id}"]
    }
    actions = ["s3:GetObject"]
    resources = ["arn:aws:s3:::smart-experience-web/*"]
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Cloudfront Web Access Identity"
}

resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name = "${aws_s3_bucket.smart_experience_web.bucket_domain_name}"
    origin_id   = "s3-smart-experience-web"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.origin_access_identity.id}"
    }
  }
  aliases = ["${var.dns_name}"]
  price_class = "PriceClass_100"
  "default_cache_behavior" {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET" ,"HEAD"]
    default_ttl = 60
    max_ttl = 60
    min_ttl = 0
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = false
    }
    target_origin_id = "s3-smart-experience-web"
    viewer_protocol_policy = "redirect-to-https"
  }
  enabled = true
  is_ipv6_enabled = true
  default_root_object = "index.html"

  "restrictions" {
    "geo_restriction" {
      restriction_type = "whitelist"
      locations = ["US"]
    }
  }
  "viewer_certificate" {
    acm_certificate_arn = "${aws_acm_certificate.cert.id}"
    ssl_support_method = "sni-only"
  }
  custom_error_response {
    error_code = 403
    error_caching_min_ttl = 5
    response_page_path = "/index.html"
    response_code = 200
  }
  custom_error_response {
    error_code = 404
    error_caching_min_ttl = 5
    response_page_path = "/index.html"
    response_code = 200
  }
}