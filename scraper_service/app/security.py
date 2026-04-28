import ipaddress
import socket
from urllib.parse import urlparse


def assert_public_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only public http and https URLs are allowed.")

    hostname = (parsed.hostname or "").lower()
    if not hostname or hostname in {"localhost"} or hostname.endswith(".local"):
        raise ValueError("Local addresses are not allowed.")

    addresses = socket.getaddrinfo(hostname, parsed.port or 443)
    for result in addresses:
        address = result[4][0]
        ip = ipaddress.ip_address(address)
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
        ):
            raise ValueError("Private network targets are not allowed.")

    return url
