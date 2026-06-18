# -*- coding: utf-8 -*-
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "images"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1400, 860
BLUE = (24, 103, 190)
BG = (246, 248, 251)
WHITE = (255, 255, 255)
BORDER = (216, 226, 236)
TEXT = (32, 42, 54)
MUTED = (110, 124, 140)
GREEN = (225, 245, 228)
GREEN_TXT = (35, 125, 58)
PURPLE = (242, 230, 250)
PURPLE_TXT = (105, 55, 150)
PINK = (255, 232, 236)
PINK_TXT = (185, 35, 52)
CYAN = (224, 249, 252)
CYAN_TXT = (0, 120, 135)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\NotoSansSC-VF.ttf",
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\simsun.ttc",
    ]
    for item in candidates:
        path = Path(item)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F14 = font(14)
F16 = font(16)
F18 = font(18)
F20 = font(20)
F24 = font(24)
B14 = font(14, True)
B16 = font(16, True)
B18 = font(18, True)
B20 = font(20, True)
B24 = font(24, True)
B30 = font(30, True)


def round_rect(draw: ImageDraw.ImageDraw, xy, fill, outline=None, width=1, r=10) -> None:
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def pill(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fill, color, pad: int = 12) -> int:
    bbox = draw.textbbox((0, 0), text, font=B14)
    width = bbox[2] - bbox[0] + pad * 2
    height = 28
    round_rect(draw, (x, y, x + width, y + height), fill, r=14)
    draw.text((x + pad, y + 4), text, font=B14, fill=color)
    return x + width + 8


def topbar(draw: ImageDraw.ImageDraw, title: str) -> None:
    draw.rectangle((0, 0, W, 76), fill=BLUE)
    round_rect(draw, (24, 16, 72, 64), WHITE, r=8)
    draw.text((33, 26), "Win", font=B14, fill=BLUE)
    draw.text((92, 22), title, font=B30, fill=WHITE)


def draw_sidebar(draw: ImageDraw.ImageDraw) -> None:
    draw.rectangle((0, 76, 330, H), fill=WHITE, outline=BORDER)
    draw.text((56, 108), "位号目录", font=B20, fill=BLUE)
    draw.line((34, 146, 296, 146), fill=BLUE, width=3)
    devices = [
        ("煤气化装置仪表图 030000", "1136"),
        ("一氧化碳变换仪表图 040100", "1958"),
        ("酸性气体脱除仪表图 040200", "2670"),
        ("硫回收仪表图 040900", "876"),
        ("全厂外管仪表图 370000", "541"),
    ]
    y = 198
    for name, count in devices:
        draw.polygon([(58, y + 4), (58, y + 26), (76, y + 15)], fill=BLUE)
        draw.text((92, y), name, font=B16, fill=BLUE)
        draw.text((92, y + 24), f"{count} 个位号", font=F14, fill=MUTED)
        y += 82


def draw_search_box(draw: ImageDraw.ImageDraw, query: str) -> None:
    round_rect(draw, (370, 116, 1330, 182), WHITE, outline=BLUE, width=2, r=14)
    draw.ellipse((398, 138, 424, 164), outline=(150, 160, 170), width=4)
    draw.line((420, 160, 434, 174), fill=(150, 160, 170), width=4)
    draw.text((454, 132), query, font=F24, fill=TEXT)


def save_search_overview() -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    topbar(draw, "新都化工合成氨仪表查询系统 / Instrument Query")
    draw_sidebar(draw)
    draw_search_box(draw, "04FE-02025  |  富甲醇流量")
    draw.text((370, 228), "共 6 条结果 / 6 results", font=F18, fill=MUTED)
    rows = [
        ("04F/FE/FT/FI-02025", "酸脱1#框架三楼 EL-0.150", "至04E0207B壳程入口富甲醇流量 · 0~400 m3/h", ["基本", "位置", "数据表", "计算书"]),
        ("04FI-02025", "酸脱1#框架三楼 EL-0.150", "至04E0207B壳程入口富甲醇流量指示 · 0~400 m3/h", ["基本", "监控", "DCS程序"]),
        ("04FT-02025", "酸脱1#框架三楼 EL-0.150", "至04E0207B壳程入口富甲醇流量变送器 · 4~20mA", ["基本", "位置", "数据表"]),
        ("04PG-09016", "", "仪表空气进界区就地压力 · 0~1 MPa", ["基本", "数据表", "厂家"]),
    ]
    y = 270
    for tag, floor, desc, labels in rows:
        draw.rectangle((370, y, 1330, y + 100), fill=WHITE, outline=BORDER)
        draw.text((398, y + 18), tag, font=B24, fill=TEXT)
        tx = 398
        if floor:
            tx = pill(draw, tx, y + 52, floor, PINK, PINK_TXT)
        draw.text((584, y + 54), desc, font=F18, fill=(82, 96, 112))
        lx = 398
        for label in labels:
            color = (GREEN, GREEN_TXT) if label not in ("位置", "数据表") else ((224, 240, 255), BLUE)
            lx = pill(draw, lx, y + 72, label, color[0], color[1])
        y += 122
    img.save(OUT / "readme-search-overview.png")


def save_detail_view() -> None:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 72), fill=BLUE)
    draw.text((32, 20), "←", font=B30, fill=WHITE)
    draw.text((92, 10), "04FE-02025", font=B24, fill=WHITE)
    draw.text((92, 42), "至04E0207B壳程入口富甲醇流量传感元件 0~400 m3/h  位置图楼层 酸脱1#框架三楼 EL-0.150", font=F16, fill=(230, 242, 255))
    tabs = ["基本信息", "位置图", "数据表", "监控数据表", "DCS底层程序", "电缆表", "回路接线图", "计算书"]
    x = 36
    for i, tab in enumerate(tabs):
        draw.text((x, 100), tab, font=B18 if i == 0 else F18, fill=BLUE if i == 0 else (90, 90, 90))
        if i == 0:
            draw.line((x, 136, x + 78, 136), fill=BLUE, width=3)
        x += 142
    round_rect(draw, (300, 170, 1160, 420), WHITE, outline=BORDER, r=14)
    draw.rectangle((300, 170, 1160, 220), fill=(230, 248, 232), outline=(196, 226, 200))
    draw.text((324, 188), "关联信号", font=B20, fill=(32, 120, 48))
    signals = [
        ("DCS-AI", "04FI-02025", "指示", "0~400 m3/h"),
        ("DCS-AI", "04FE-02025", "传感元件", "0~400 m3/h"),
        ("DCS-AI", "04FT-02025", "变送器", "4~20mA"),
        ("DCS", "04F-02025", "测量", "0~400 m3/h"),
    ]
    y = 238
    for badge, tag, role, rng in signals:
        pill(draw, 326, y, badge, (226, 240, 255) if "AI" in badge else (235, 235, 235), BLUE if "AI" in badge else (90, 90, 90), 10)
        draw.text((430, y + 4), tag, font=B16, fill=TEXT)
        draw.text((632, y + 4), role, font=F16, fill=(85, 85, 85))
        draw.text((1018, y + 4), rng, font=F16, fill=BLUE)
        y += 42
    round_rect(draw, (300, 455, 1160, 690), WHITE, outline=BORDER, r=14)
    draw.rectangle((300, 455, 1160, 505), fill=(224, 242, 255), outline=(190, 220, 245))
    draw.text((324, 472), "点表信息", font=B20, fill=BLUE)
    fields = [
        ("位置图楼层", "酸脱1#框架三楼 EL-0.150"),
        ("描述", "至04E0207B壳程入口富甲醇流量传感元件"),
        ("量程", "0~400"),
        ("量纲", "m3/h"),
        ("信号类型", "DCS-AI"),
    ]
    y = 520
    for k, v in fields:
        draw.text((324, y), k, font=F16, fill=MUTED)
        draw.text((468, y), v, font=F16, fill=TEXT)
        y += 30
    img.save(OUT / "readme-detail-view.png")


def save_position_map() -> None:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 72), fill=BLUE)
    draw.text((32, 20), "←", font=B30, fill=WHITE)
    draw.text((92, 10), "04FE-02025", font=B24, fill=WHITE)
    draw.text((92, 42), "位置图楼层 酸脱1#框架三楼 EL-0.150", font=F16, fill=(230, 242, 255))
    draw.text((36, 100), "位置图", font=B20, fill=BLUE)
    draw.line((36, 136, 110, 136), fill=BLUE, width=3)
    round_rect(draw, (220, 165, 1180, 780), WHITE, outline=BORDER, r=14)
    pill(draw, 250, 188, "酸性气体脱除", GREEN, GREEN_TXT)
    pill(draw, 390, 188, "酸脱1#框架三楼 EL-0.150", PINK, PINK_TXT)
    draw.rectangle((270, 245, 1130, 735), fill=(252, 252, 252), outline=(70, 70, 70), width=2)
    for x in range(340, 1080, 120):
        draw.line((x, 245, x, 735), fill=(210, 210, 210), width=1)
    for y in range(310, 710, 80):
        draw.line((270, y, 1130, y), fill=(210, 210, 210), width=1)
    draw.rectangle((410, 360, 560, 470), outline=(120, 120, 120), width=3)
    draw.text((430, 405), "04E0207B", font=F16, fill=MUTED)
    draw.line((560, 415, 740, 415), fill=(80, 80, 80), width=3)
    draw.ellipse((720, 392, 768, 440), outline=PINK_TXT, width=5)
    draw.line((744, 392, 744, 356), fill=PINK_TXT, width=3)
    draw.text((694, 336), "04FE-02025", font=B16, fill=PINK_TXT)
    draw.text((738, 446), "x=0.63  y=0.42", font=F14, fill=BLUE)
    draw.rectangle((860, 300, 1060, 620), outline=(160, 160, 160), width=2)
    for i, tag in enumerate(["04FI-02025", "04FE-02025", "04FT-02025", "04F-02025"]):
        draw.text((886, 326 + i * 46), tag, font=F14, fill=TEXT)
    img.save(OUT / "readme-position-map.png")


def save_document_preview() -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    topbar(draw, "资料预览 / Document Preview")
    draw.text((80, 120), "04FE-02025 关联资料", font=B24, fill=TEXT)
    cards = [
        ("修改后计算书 - 04FE-02025-反.pdf", "第 1 页", "节流件计算结果、最大流量、常用流量、压损等参数"),
        ("系统回路接线表_合成单元.xls", "第 147 页", "DCS 接线、柜号、端子号、信号类型"),
        ("仪表说明书 - 电磁流量计.pdf", "第 3 页", "安装、接线、调试和维护说明"),
    ]
    y = 170
    for title, page, desc in cards:
        round_rect(draw, (90, y, 1310, y + 170), WHITE, outline=BORDER, r=12)
        draw.text((120, y + 24), title, font=B20, fill=TEXT)
        draw.text((120, y + 58), page, font=F16, fill=MUTED)
        draw.rectangle((120, y + 88, 1280, y + 140), fill=(244, 246, 248), outline=(236, 240, 244))
        draw.text((142, y + 103), desc, font=F18, fill=(82, 96, 112))
        y += 198
    img.save(OUT / "readme-document-preview.png")


def main() -> None:
    save_search_overview()
    save_detail_view()
    save_position_map()
    save_document_preview()
    print(f"Generated README images in {OUT}")


if __name__ == "__main__":
    main()
