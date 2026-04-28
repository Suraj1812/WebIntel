from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from time import time
from typing import Optional
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from playwright.async_api import async_playwright
from slugify import slugify

from scraper_service.app.analyzer import analyze_html
from scraper_service.app.models import ScanRequest
from scraper_service.app.security import assert_public_url

app = FastAPI(title="WebIntel AI Scraper", version="1.0.0")

STORAGE_ROOT = Path(os.getenv("STORAGE_ROOT", "./storage")).resolve()
SCREENSHOT_ROOT = STORAGE_ROOT / "screenshots"
SCREENSHOT_ROOT.mkdir(parents=True, exist_ok=True)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/assets/{asset_path:path}")
async def read_asset(asset_path: str):
    target = (STORAGE_ROOT / asset_path).resolve()
    if not str(target).startswith(str(STORAGE_ROOT)) or not target.exists():
        raise HTTPException(status_code=404, detail="Asset not found.")

    return FileResponse(target)


@app.post("/scan")
async def scan_website(request: ScanRequest):
    try:
        target_url = assert_public_url(str(request.url))
        response = await _fetch_http_response(target_url)
        rendered = await _render_and_capture(target_url)
        analysis = analyze_html(
            rendered["html"],
            target_url,
            rendered["final_url"],
            dict(response.headers),
            rendered["colors"],
            rendered["fonts"],
        )

        return {
            "url": target_url,
            "normalized_url": rendered["final_url"],
            "domain": urlparse(rendered["final_url"]).hostname or urlparse(target_url).hostname,
            "fetched_at": rendered["fetched_at"],
            "title": analysis["title"],
            "meta_description": analysis["meta_description"],
            "language": analysis["language"],
            "country_estimate": analysis["country_estimate"],
            "favicon_url": analysis["favicon_url"],
            "https": rendered["final_url"].startswith("https://"),
            "html_excerpt": analysis["html_excerpt"],
            "meta_tags": {
                **analysis["meta_tags"],
                "robots_txt": await _check_auxiliary_file(rendered["final_url"], "/robots.txt"),
                "sitemap": await _check_auxiliary_file(rendered["final_url"], "/sitemap.xml"),
            },
            "screenshots": rendered["screenshots"],
            "colors": analysis["colors"],
            "fonts": analysis["fonts"],
            "ui_summary": analysis["ui_summary"],
            "mobile_friendly": analysis["mobile_friendly"],
            "layout_quality_score": analysis["layout_quality_score"],
            "freshness": analysis["freshness"],
            "headings": analysis["headings"],
            "links": analysis["links"],
            "images": analysis["images"],
            "scripts": analysis["scripts"],
            "stylesheets": analysis["stylesheets"],
            "frameworks": analysis["frameworks"],
            "styles": analysis["styles"],
            "infrastructure": analysis["infrastructure"],
            "analytics": analysis["analytics"],
            "payments": analysis["payments"],
            "evidence": analysis["evidence"],
            "performance": analysis["performance"],
            "security_headers": analysis["security"]["security_headers"],
            "mixed_content_warnings": analysis["security"]["mixed_content_warnings"],
            "public_form_risk_notes": analysis["security"]["public_form_risk_notes"],
            "content": analysis["content"],
            "media": analysis["media"],
        }
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Scan failed: {error}") from error


async def _fetch_http_response(url: str) -> httpx.Response:
    async with httpx.AsyncClient(
        headers={"User-Agent": "WebIntel AI Scraper/1.0"},
        timeout=35.0,
        follow_redirects=True,
    ) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response


async def _check_auxiliary_file(url: str, suffix: str) -> Optional[str]:
    parsed = urlparse(url)
    candidate = f"{parsed.scheme}://{parsed.netloc}{suffix}"
    async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
        try:
            response = await client.get(candidate)
            if response.status_code < 400:
                return candidate
        except httpx.HTTPError:
            return None

    return None


async def _render_and_capture(url: str):
    timestamp = int(time())
    domain_slug = slugify(urlparse(url).hostname or "website")
    target_dir = SCREENSHOT_ROOT / f"{domain_slug}-{timestamp}"
    target_dir.mkdir(parents=True, exist_ok=True)

    desktop_path = target_dir / "desktop.png"
    mobile_path = target_dir / "mobile.png"
    full_path = target_dir / "full-page.png"

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        desktop_context = await browser.new_context(viewport={"width": 1440, "height": 960})
        mobile_context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        )
        desktop_page = await desktop_context.new_page()
        mobile_page = await mobile_context.new_page()

        try:
            await desktop_page.goto(url, wait_until="networkidle", timeout=45_000)
            await mobile_page.goto(url, wait_until="networkidle", timeout=45_000)

            await desktop_page.screenshot(path=str(desktop_path), full_page=False)
            await desktop_page.screenshot(path=str(full_path), full_page=True)
            await mobile_page.screenshot(path=str(mobile_path), full_page=False)

            final_url = desktop_page.url
            html = await desktop_page.content()
            design_snapshot = await desktop_page.evaluate(
                """
                () => {
                  const elements = Array.from(document.querySelectorAll("*")).slice(0, 450);
                  const colors = new Map();
                  const fonts = new Map();

                  for (const element of elements) {
                    const style = window.getComputedStyle(element);
                    const color = style.color;
                    const background = style.backgroundColor;
                    const font = style.fontFamily;

                    if (color && color !== "rgba(0, 0, 0, 0)") {
                      colors.set(color, (colors.get(color) || 0) + 1);
                    }
                    if (background && background !== "rgba(0, 0, 0, 0)") {
                      colors.set(background, (colors.get(background) || 0) + 1);
                    }
                    if (font) {
                      fonts.set(font, (fonts.get(font) || 0) + 1);
                    }
                  }

                  const sortedColors = [...colors.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(([value]) => value)
                    .filter((value) => value.startsWith("rgb"))
                    .slice(0, 6);
                  const sortedFonts = [...fonts.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(([value]) => value.split(",")[0].replaceAll('"', "").trim())
                    .slice(0, 5);

                  return {
                    colors: sortedColors,
                    fonts: sortedFonts,
                  };
                }
                """
            )
        finally:
            await desktop_context.close()
            await mobile_context.close()
            await browser.close()

    return {
        "final_url": final_url,
        "html": html,
        "colors": [_rgb_to_hex(color) for color in design_snapshot["colors"]],
        "fonts": design_snapshot["fonts"],
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "screenshots": {
            "desktop": str(desktop_path.relative_to(STORAGE_ROOT)).replace("\\", "/"),
            "mobile": str(mobile_path.relative_to(STORAGE_ROOT)).replace("\\", "/"),
            "full": str(full_path.relative_to(STORAGE_ROOT)).replace("\\", "/"),
        },
    }


def _rgb_to_hex(value: str) -> str:
    parts = value.removeprefix("rgb(").removeprefix("rgba(").removesuffix(")").split(",")
    if len(parts) < 3:
        return value

    red, green, blue = [max(0, min(255, int(float(part.strip())))) for part in parts[:3]]
    return f"#{red:02x}{green:02x}{blue:02x}"
