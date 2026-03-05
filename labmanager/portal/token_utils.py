# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import secrets
import string

import frappe


def generate_portal_token() -> str:
	"""Generate a permanent 32-char alphanumeric portal token."""
	alphabet = string.ascii_letters + string.digits
	return "".join(secrets.choice(alphabet) for _ in range(32))


def get_portal_url(token: str) -> str:
	"""Return the full URL for a parent portal token."""
	site_url = frappe.utils.get_url().rstrip("/")
	return f"{site_url}/parent-portal?token={token}"
