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

//resource "aws_route53_record" "cert_domain_verification" {
//  zone_id = "${aws_route53_zone.main.zone_id}"
//  name = "_23e0705e6d375e3b1d868773b74af662.${var.dns_name}"
//  type = "CNAME"
//  ttl = "30"
//
//  records = [
//    "_bc6a032549e56c911c308163202f969d.acm-validations.aws."
//  ]
//}

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
      restriction_type = "none"
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

resource "aws_ses_domain_identity" "drivesmart_email" {
  domain = "${var.dns_name}"
}

resource "aws_route53_record" "drivesmart_email_amazonses_verification_record" {
  zone_id = "${aws_route53_zone.main.zone_id}"
  name    = "_amazonses.${var.dns_name}"
  type    = "TXT"
  ttl     = "600"
  records = ["${aws_ses_domain_identity.drivesmart_email.verification_token}"]
}

resource "aws_ses_domain_dkim" "drivesmart_dkim" {
  domain = "${aws_ses_domain_identity.drivesmart_email.domain}"
}

resource "aws_route53_record" "drivesmart_email_amazonses_dkim_record" {
  count   = 3
  zone_id = "${aws_route53_zone.main.zone_id}"
  name    = "${element(aws_ses_domain_dkim.drivesmart_dkim.dkim_tokens, count.index)}._domainkey.${var.dns_name}"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.drivesmart_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"]
}


resource "aws_s3_bucket" "received_emails" {
  bucket = "smart-experience-emails"
  acl    = "private"
  policy = "${data.aws_iam_policy_document.bucket_policy_for_emails.json}"
}


data "aws_iam_policy_document" "bucket_policy_for_emails" {
  statement {
    effect = "Allow"
    principals = {
      type = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
    actions = ["s3:PutObject"]
    resources = ["arn:aws:s3:::smart-experience-emails/*"]
    condition {
      test = "StringEquals"
      variable = "aws:Referer"
      values = ["${var.account_number}"]
    }
  }
}

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "primary-rules"
}

resource "aws_ses_active_receipt_rule_set" "main" {
  rule_set_name = "primary-rules"
}

resource "aws_ses_receipt_rule" "store1" {
  name          = "store"
  rule_set_name = "${aws_ses_receipt_rule_set.main.rule_set_name}"
  recipients    = ["no-reply@${var.dns_name}"]
  enabled       = true
  scan_enabled  = false


  s3_action {
    position = 1
    bucket_name = "${aws_s3_bucket.received_emails.id}"
  }
}
resource "aws_ses_receipt_rule" "store2" {
  name          = "store.mail"
  rule_set_name = "${aws_ses_receipt_rule_set.main.rule_set_name}"
  recipients    = ["no-reply@mail.${var.dns_name}"]
  enabled       = true
  scan_enabled  = false


  s3_action {
    position = 1
    bucket_name = "${aws_s3_bucket.received_emails.id}"
  }
}

resource "aws_ses_domain_mail_from" "mail_drivesmartcbus" {
  domain           = "${aws_ses_domain_identity.drivesmart_email.domain}"
  mail_from_domain = "mail.${aws_ses_domain_identity.drivesmart_email.domain}"
}

resource "aws_route53_record" "example_ses_domain_mail_from_mx" {
  zone_id = "${aws_route53_zone.main.id}"
  name    = "${aws_ses_domain_mail_from.mail_drivesmartcbus.mail_from_domain}"
  type    = "MX"
  ttl     = "600"
  records = ["1 inbound-smtp.us-east-1.amazonaws.com", "10 feedback-smtp.us-east-1.amazonses.com"]
}

resource "aws_route53_record" "drivesmartcbus_email_inbound_mx" {
  zone_id = "${aws_route53_zone.main.id}"
  name    = "${var.dns_name}"
  type    = "MX"
  ttl     = "600"
  records = ["1 inbound-smtp.us-east-1.amazonaws.com"]
}


resource "aws_route53_record" "example_ses_domain_mail_from_txt" {
  zone_id = "${aws_route53_zone.main.id}"
  name    = "${aws_ses_domain_mail_from.mail_drivesmartcbus.mail_from_domain}"
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

resource "aws_ses_template" "ConfirmationTemplate" {
  name    = "ConfirmationTemplate"
  subject = "Your EV Test Drive Confirmation"
  html    = "<h1>Hello {{first_name}} {{last_name}},</h1><p>Your confirmation number is {{confirmation_number}}.</p>"
  text    = "Hello {{first_name}} {{last_name}},,\r\nYour confirmation number is {{confirmation_number}}."
}