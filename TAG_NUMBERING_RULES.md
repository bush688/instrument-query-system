# Coal Chemical Instrument Tag Rules

Updated: 2026-05-10

These rules are mandatory for the coal chemical instrument lookup system unless
the user gives a later explicit override. All source data used to apply these
rules must come from `E:\仪表管理查询系统测试用图纸`.

## Device Drawing Codes

| Code | Unit / drawing scope |
| --- | --- |
| 030000 | 煤气化装置仪表图 |
| 030100 | 煤浆制备与输送仪表图 |
| 030200 | 气化仪表图 |
| 030300 | 渣水处理仪表图 |
| 040100 | 一氧化碳变换仪表图 |
| 040200 | 酸性气体脱除仪表图 |
| 040300 | 气体精制仪表图 |
| 040500 | 氨合成仪表图 |
| 040800 | 除氧给水仪表图 |
| 040900 | 硫回收仪表图 |
| 090200 | 尿素主装置仪表图 |
| 200000 | 原水加压及消防仪表图 |
| 210000 | 循环冷却水站仪表图 |
| 290000 | 余热发电仪表图 |
| 300000 | 动力站仪表图 |
| 350200 | 空分现场机柜间仪表图 |
| 350300 | 气化合成氨现场机柜间仪表 |
| 370000 | 全厂外管仪表图 |
| 400100 | 球罐区仪表图 |
| 400200 | 常压氨罐区仪表图 |
| 400300 | 甲醇罐区仪表图 |
| 400400 | 硫酸罐区仪表图 |
| 400800 | 汽车装卸栈台仪表图 |

## General Tag Format

The design note `21216-030300-IN05 仪表设计说明.pdf` defines the instrument tag
format as:

```text
UU-HHHH-VVWXX Y Z-G
```

Operational interpretation for this project:

- `UU`: two-digit main device / unit code.
- `HHHH`: instrument function letters.
- `VV`: process or sub-device code.
- `W`: series number. In gasification this normally identifies common signals
  or gasifier A/B/C series.
- `XX`: sequence number.
- `Y`, `Z`, `G`: optional loop, tag, and repeated-device suffixes.

Example: `03FT-02113` means main unit `03`, gasification sub-unit `02`, and
instrument sequence `113`.

Example: in `040100` drawings, `04` is the combined main unit and `0100` is the
carbon monoxide shift sub-unit. Tags under other `04xx00` drawings follow the
same main-unit plus sub-unit rule.

## 040800 Deaeration Feedwater Exception

For `040800` 除氧给水仪表图, the design institute tag and the DCS actual tag do
not use the same literal form. The system must treat them as aliases:

```text
FUNC-0408NN[suffix]  <->  04FUNC-080NN[suffix]
```

Required example:

```text
PT-040801  <->  04PT-08001
```

When mapping point tables, wiring tables, datasheets, and location drawings for
`040800`, both forms must resolve to the same instrument. The DCS actual tag is
used for DCS point metadata, while the design tag can carry datasheet and
location references.

## Derived Signal Rules

The design note also defines related DCS signal tags for valves, motors, and
electrical devices. The system must keep related tags grouped by their physical
instrument or device, for example:

- `FE` / `FT` / `FI` are one flow instrument group.
- `TE` / `TI` are one temperature instrument group.
- `PT` / `PI` and `PDT` / `PDI` are one pressure / differential pressure group.
- Valve and motor derived tags such as `ZSO`, `ZSC`, `YA`, `YX`, `HSO`, `HSC`,
  `HSS`, `XSO`, `XSC`, and `XSS` must group with their controlled equipment
  number when the number portion identifies equipment rather than a process
  measurement loop.

## Tag Matching Normalization

When matching tags across point tables, wiring tables, datasheets, location
drawings, monitoring tables, and vendor/reference documents, separators are not
semantic. Matching must ignore:

- leading underscores, for example `_03PZT_02042A`;
- underscores `_`;
- hyphens `-`;
- whitespace and line breaks introduced by spreadsheet cell wrapping.

Required example:

```text
_03PZT_02042A  =  03PZT-02042A  =  03PZT_02042A
```

The display form may remain the project canonical form with a hyphen, but lookup
and data association must use the normalized comparison key.

## Local Gauge Rules

`TG`, `PG`, `LG`, and `FG` are local field gauges. They are not connected to
DCS, SIS, or GDS and must not be treated as system IO points.

Examples:

```text
03TG-01052A
03PG-01051A
```

For these tags the lookup system keeps only datasheet and vendor references.
Monitoring tables, system wiring tables, IO tables, position records, process
connection references, and other system documents are not current references for
the local gauge tag itself.

## Tag Directory Device Codes

The left tag directory is grouped only by the device codes listed in this file.
Tags whose references cannot be assigned to one of these codes are excluded from
the directory until the user explicitly adds a device code rule.

## Processing Rules

- New point table data must replace old basic-information metadata.
- Tags absent from the current point table / wiring table must not be retained
  as current point metadata.
- Existing datasheet, location, vendor, DCS, and other non-point references are
  preserved unless a newer approved source explicitly replaces them.
- Wiring table references must be regenerated from approved files under
  `E:\仪表管理查询系统测试用图纸\接线图`.
- Any script that updates production data must default to dry-run and require an
  explicit write/upload flag.
