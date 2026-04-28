import re
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup


def analyze_html(
    html: str,
    base_url: str,
    final_url: str,
    headers: dict[str, str],
    color_tokens: list[str],
    font_tokens: list[str],
) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    parsed_final = urlparse(final_url)
    domain = parsed_final.hostname or urlparse(base_url).hostname or ""

    title = (soup.title.string or "").strip() if soup.title and soup.title.string else ""
    meta_tags = _extract_meta_tags(soup, final_url)
    links = _extract_links(soup, final_url, domain)
    images = _extract_images(soup, final_url)
    scripts = [tag.get("src") for tag in soup.find_all("script", src=True)]
    stylesheets = [
        tag.get("href")
        for tag in soup.find_all(
            "link",
            rel=lambda value: value
            and "stylesheet"
            in (" ".join(value).lower() if isinstance(value, list) else value.lower()),
        )
    ]
    headings = {
        "h1": [node.get_text(" ", strip=True) for node in soup.find_all("h1")],
        "h2": [node.get_text(" ", strip=True) for node in soup.find_all("h2")],
        "h3": [node.get_text(" ", strip=True) for node in soup.find_all("h3")],
    }
    frameworks, styles, infrastructure, analytics, payments, evidence = _detect_stack(
        html, scripts, stylesheets, headers, meta_tags
    )
    media = _extract_media(soup, final_url, images, meta_tags)
    content = _extract_content_intelligence(soup, title, meta_tags, headings)
    performance = _extract_performance(images, scripts, stylesheets)
    security = _extract_security(headers, html, soup)

    ui_summary, layout_quality_score, freshness = _summarize_design(
        headings, color_tokens, font_tokens, frameworks, styles, content
    )

    return {
        "title": title,
        "meta_description": meta_tags.get("description", ""),
        "language": _read_language(soup),
        "favicon_url": _find_favicon(soup, final_url),
        "meta_tags": meta_tags,
        "headings": headings,
        "links": links,
        "images": images,
        "scripts": scripts,
        "stylesheets": stylesheets,
        "frameworks": frameworks,
        "styles": styles,
        "infrastructure": infrastructure,
        "analytics": analytics,
        "payments": payments,
        "evidence": evidence,
        "media": media,
        "content": content,
        "performance": performance,
        "security": security,
        "colors": color_tokens[:5],
        "fonts": font_tokens[:5],
        "ui_summary": ui_summary,
        "mobile_friendly": bool(meta_tags.get("viewport"))
        or any(
            any(cls.startswith("sm:") or cls.startswith("md:") for cls in tag.get("class", []))
            for tag in soup.find_all(True)
        ),
        "layout_quality_score": layout_quality_score,
        "freshness": freshness,
        "html_excerpt": re.sub(r"\s+", " ", soup.get_text(" ", strip=True))[:2400],
        "country_estimate": _infer_country(headers, meta_tags, domain),
    }


def _extract_meta_tags(soup: BeautifulSoup, final_url: str) -> dict[str, str]:
    meta_tags: dict[str, str] = {}
    for tag in soup.find_all("meta"):
        key = tag.get("name") or tag.get("property") or tag.get("http-equiv")
        value = tag.get("content")
        if key and value:
            meta_tags[key.lower()] = value.strip()

    canonical = soup.find(
        "link",
        rel=lambda value: value
        and "canonical"
        in (" ".join(value).lower() if isinstance(value, list) else value.lower()),
    )
    if canonical and canonical.get("href"):
        meta_tags["canonical"] = urljoin(final_url, canonical["href"])

    return meta_tags


def _extract_links(soup: BeautifulSoup, final_url: str, domain: str) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for tag in soup.find_all("a", href=True):
        href = urljoin(final_url, tag["href"])
        text = tag.get_text(" ", strip=True)
        parsed = urlparse(href)
        items.append(
            {
                "href": href,
                "text": text[:160],
                "kind": "internal" if parsed.hostname == domain or not parsed.hostname else "external",
            }
        )

    return items


def _extract_images(soup: BeautifulSoup, final_url: str) -> list[dict[str, str | None]]:
    assets = []
    for tag in soup.find_all("img", src=True):
        assets.append(
            {
                "src": urljoin(final_url, tag["src"]),
                "alt": tag.get("alt"),
                "loading": tag.get("loading"),
                "role": tag.get("role"),
            }
        )

    return assets


def _extract_media(
    soup: BeautifulSoup,
    final_url: str,
    images: list[dict[str, str | None]],
    meta_tags: dict[str, str],
) -> dict[str, Any]:
    logo = None
    hero_images = []

    for image in images:
        src = str(image["src"])
        alt = (image.get("alt") or "").lower()
        if not logo and ("logo" in src.lower() or "logo" in alt):
            logo = {
                "url": src,
                "label": "Logo",
                "type": "image",
                "alt": image.get("alt"),
            }

        if len(hero_images) < 3:
            hero_images.append(
                {
                    "url": src,
                    "label": image.get("alt") or "Hero image",
                    "type": "image",
                    "alt": image.get("alt"),
                }
            )

    videos = []
    for frame in soup.find_all(["iframe", "video"], src=True):
        src = urljoin(final_url, frame["src"])
        if "youtube" in src or "vimeo" in src or frame.name == "video":
            videos.append({"url": src, "label": "Video embed", "type": "video"})

    social_preview = None
    if meta_tags.get("og:image"):
        social_preview = {
            "url": urljoin(final_url, meta_tags["og:image"]),
            "label": "Social preview",
            "type": "image",
        }

    return {
        "logo": logo,
        "hero_images": hero_images[:4],
        "social_preview": social_preview,
        "videos": videos[:4],
    }


def _extract_content_intelligence(
    soup: BeautifulSoup,
    title: str,
    meta_tags: dict[str, str],
    headings: dict[str, list[str]],
) -> dict[str, Any]:
    body_text = soup.get_text(" ", strip=True).lower()
    combined = " ".join(
        [title, meta_tags.get("description", ""), " ".join(headings["h1"][:2]), " ".join(headings["h2"][:3])]
    ).lower()

    categories = {
        "SaaS / Software": ["software", "platform", "workflow", "automation", "dashboard", "api"],
        "Ecommerce": ["shop", "buy", "cart", "checkout", "shipping", "product"],
        "Agency / Services": ["agency", "studio", "services", "consulting", "book a call"],
        "Education": ["course", "academy", "learn", "training", "bootcamp"],
        "Media / Content": ["blog", "news", "magazine", "podcast", "article"],
    }

    niche = "General business website"
    for label, keywords in categories.items():
        if any(keyword in combined for keyword in keywords):
            niche = label
            break

    target_audience = "Professionals evaluating the offering"
    if "developer" in body_text or "api" in body_text:
        target_audience = "Developers or technical teams"
    elif "marketing" in body_text or "growth" in body_text:
        target_audience = "Marketing and growth teams"
    elif "founder" in body_text or "startup" in body_text:
        target_audience = "Founders and startup operators"

    business_model = "Services"
    if any(token in combined for token in ["pricing", "subscription", "plan", "monthly"]):
        business_model = "Subscription / recurring revenue"
    elif any(token in combined for token in ["add to cart", "checkout", "shop"]):
        business_model = "Direct ecommerce sales"

    primary_cta = _find_primary_cta(soup)
    tone = "Professional"
    if any(token in body_text for token in ["enterprise", "secure", "scale"]):
        tone = "Professional and credibility-driven"
    elif any(token in body_text for token in ["fast", "simple", "easy", "beautiful"]):
        tone = "Modern and product-led"

    summary = meta_tags.get("description") or title or "Public-facing website with a clear value proposition."

    return {
        "niche": niche,
        "target_audience": target_audience,
        "business_model": business_model,
        "has_blog": "/blog" in body_text or "blog" in combined,
        "primary_cta": primary_cta,
        "tone": tone,
        "summary": summary,
    }


def _extract_performance(
    images: list[dict[str, str | None]], scripts: list[str | None], stylesheets: list[str | None]
) -> dict[str, Any]:
    image_count = len(images)
    script_count = len([src for src in scripts if src])
    stylesheet_count = len([href for href in stylesheets if href])
    lazy_loading = any(image.get("loading") == "lazy" for image in images)

    warnings = []
    if image_count > 30:
        warnings.append("High image count may slow loading on low-bandwidth connections.")
    if script_count > 18:
        warnings.append("JavaScript bundle footprint looks heavy.")
    if stylesheet_count > 8:
        warnings.append("Stylesheet count suggests fragmented CSS delivery.")

    notes = []
    if lazy_loading:
        notes.append("Lazy loading detected for at least part of the media layer.")
    if image_count <= 12:
        notes.append("Image footprint is relatively restrained.")
    if script_count <= 10:
        notes.append("Script count is moderate.")

    return {
        "image_count": image_count,
        "script_count": script_count,
        "stylesheet_count": stylesheet_count,
        "lazy_loading_detected": lazy_loading,
        "speed_notes": notes,
        "heavy_asset_warnings": warnings,
    }


def _extract_security(headers: dict[str, str], html: str, soup: BeautifulSoup) -> dict[str, Any]:
    security_headers = {
        "content-security-policy": headers.get("content-security-policy", ""),
        "strict-transport-security": headers.get("strict-transport-security", ""),
        "x-frame-options": headers.get("x-frame-options", ""),
        "x-content-type-options": headers.get("x-content-type-options", ""),
        "referrer-policy": headers.get("referrer-policy", ""),
    }

    mixed_content = []
    if "https://" in html and "http://" in html:
        mixed_content.append("HTTP assets were referenced on an HTTPS page.")

    form_risks = []
    for form in soup.find_all("form"):
        action = (form.get("action") or "").lower()
        if action.startswith("http://"):
            form_risks.append("A public form posts to an insecure HTTP endpoint.")
        if form.find("input", {"type": "password"}) and not action:
            form_risks.append("Password form exists without an explicit action target.")

    return {
        "security_headers": security_headers,
        "mixed_content_warnings": mixed_content,
        "public_form_risk_notes": form_risks,
    }


def _read_language(soup: BeautifulSoup) -> str | None:
    html_tag = soup.find("html")
    return html_tag.get("lang") if html_tag else None


def _find_favicon(soup: BeautifulSoup, final_url: str) -> str | None:
    for rel in ["icon", "shortcut icon", "apple-touch-icon"]:
        icon = soup.find(
            "link",
            rel=lambda value: value
            and rel in (" ".join(value).lower() if isinstance(value, list) else value.lower()),
            href=True,
        )
        if icon:
            return urljoin(final_url, icon["href"])

    return None


def _find_primary_cta(soup: BeautifulSoup) -> str:
    candidates = []
    for tag in soup.find_all(["a", "button"]):
        text = tag.get_text(" ", strip=True)
        if 2 <= len(text) <= 80:
            candidates.append(text)

    for text in candidates:
        lowered = text.lower()
        if any(token in lowered for token in ["start", "book", "demo", "buy", "shop", "contact", "sign up", "get started"]):
            return text

    return candidates[0] if candidates else "No clear CTA found"


def _detect_stack(
    html: str,
    scripts: list[str | None],
    stylesheets: list[str | None],
    headers: dict[str, str],
    meta_tags: dict[str, str],
) -> tuple[list[str], list[str], list[str], list[str], list[str], list[str]]:
    html_lower = html.lower()
    scripts_blob = " ".join([src for src in scripts if src]).lower()
    styles_blob = " ".join([href for href in stylesheets if href]).lower()
    evidence = []

    frameworks = []
    if "__next_data__" in html_lower or "/_next/" in html_lower:
        frameworks.append("Next.js")
        frameworks.append("React")
        evidence.append("Detected Next.js markers in HTML.")
    elif "data-reactroot" in html_lower or "react" in scripts_blob:
        frameworks.append("React")
        evidence.append("Detected React DOM markers.")
    if "ng-version" in html_lower:
        frameworks.append("Angular")
    if "__vue__" in html_lower or "vue" in scripts_blob:
        frameworks.append("Vue")
    if "wp-content" in html_lower or meta_tags.get("generator", "").lower().startswith("wordpress"):
        frameworks.append("WordPress")
    if "cdn.shopify.com" in html_lower or "shopify" in scripts_blob:
        frameworks.append("Shopify")
    if "woocommerce" in html_lower:
        frameworks.append("WooCommerce")

    styles = []
    if "tailwind" in styles_blob or "class=\"container mx-auto" in html_lower or "sm:" in html_lower:
        styles.append("Tailwind CSS")
    if "bootstrap" in styles_blob or "bootstrap" in scripts_blob:
        styles.append("Bootstrap")

    infrastructure = []
    if headers.get("server", "").lower() == "cloudflare" or "cloudflare" in scripts_blob:
        infrastructure.append("Cloudflare")
    if "vercel" in headers.get("x-powered-by", "").lower():
        infrastructure.append("Vercel")
    if "amazonaws.com" in scripts_blob:
        infrastructure.append("AWS")

    analytics = []
    for label, token in [
        ("Google Analytics", "google-analytics"),
        ("Google Tag Manager", "googletagmanager"),
        ("Plausible", "plausible"),
        ("PostHog", "posthog"),
        ("Microsoft Clarity", "clarity.ms"),
        ("Segment", "segment.com"),
    ]:
        if token in scripts_blob or token in html_lower:
            analytics.append(label)

    payments = []
    for label, token in [
        ("Stripe", "stripe"),
        ("PayPal", "paypal"),
        ("Razorpay", "razorpay"),
        ("Paddle", "paddle"),
        ("Shop Pay", "shopify-pay"),
    ]:
        if token in scripts_blob or token in html_lower:
            payments.append(label)

    return (
        list(dict.fromkeys(frameworks)),
        list(dict.fromkeys(styles)),
        list(dict.fromkeys(infrastructure)),
        list(dict.fromkeys(analytics)),
        list(dict.fromkeys(payments)),
        evidence,
    )


def _summarize_design(
    headings: dict[str, list[str]],
    colors: list[str],
    fonts: list[str],
    frameworks: list[str],
    styles: list[str],
    content: dict[str, Any],
) -> tuple[str, int, str]:
    summary_parts = []
    if frameworks:
        summary_parts.append(f"Built with {', '.join(frameworks[:2])}")
    if colors:
        summary_parts.append(f"using a palette led by {colors[0]}")
    if fonts:
        summary_parts.append(f"and typography centered on {fonts[0]}")
    if content.get("primary_cta"):
        summary_parts.append(f"with CTA focus around '{content['primary_cta']}'")

    score = 58
    score += min(15, len(colors) * 3)
    score += min(12, len(fonts) * 3)
    score += 8 if frameworks else 0
    score += 6 if styles else 0
    score += 6 if headings["h1"] else 0

    freshness = "mixed"
    if score >= 82:
        freshness = "modern"
    elif score < 65:
        freshness = "dated"

    return (
        ". ".join(summary_parts) if summary_parts else "Clean modern interface with visible product-led structure.",
        min(100, score),
        freshness,
    )


def _infer_country(headers: dict[str, str], meta_tags: dict[str, str], domain: str) -> str | None:
    if domain.endswith(".co.uk"):
        return "United Kingdom"
    if domain.endswith(".de"):
        return "Germany"
    if domain.endswith(".fr"):
        return "France"
    if domain.endswith(".in"):
        return "India"
    if "en-us" in (meta_tags.get("og:locale") or "").lower():
        return "United States"
    if headers.get("cf-ipcountry"):
        return headers["cf-ipcountry"]
    return None
