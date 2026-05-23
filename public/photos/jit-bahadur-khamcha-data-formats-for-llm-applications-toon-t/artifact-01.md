# Data Formats for LLM Applications
## JSON vs YAML vs CSV vs TOON

---

## What is TOON?

**Token-Oriented Object Notation**

Compact, human-readable serialization of JSON data for LLM prompts.

![alt text](image.png)

```
Workflow:  JSON  -->  encode()  -->  TOON  -->  LLM
```


**Token Savings: ~30-60% less**

---

## TOON Syntax Examples

**Simple Objects:**
```toon
id: 123
name: Ada
active: true
```

**Nested Objects:**
```toon
user:
  id: 123
  name: Ada
```

**Arrays of Primitives:**
```toon
tags[3]: foo,bar,baz
```

**Uniform Object Arrays (Major token savings):**
```toon
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

---

## TOON Features

- **Token-efficient encoding** - 30-60% fewer tokens than JSON
- **Lossless round-trip** - Encodes to TOON, decodes back to identical JSON
- **Self-documenting schema** - Array headers declare field names inline
- **Human-readable** - Clean, minimal syntax without braces/brackets
- **Nested structure support** - Handles objects, arrays, and deep hierarchies
- **Multiple data type support** - Strings, numbers, booleans, null, arrays, objects
- **Uniform array optimization** - Tables with shared fields get maximum compression

---

## TOON: Pros and Cons

| Pros | Cons |
|------|------|
| Significant token savings (30-60%) | Less mature ecosystem than JSON/YAML |
| Higher LLM retrieval accuracy (73.9%) | Learning curve for new syntax |
| Preserves full JSON structure | Not suitable for REST APIs |
| Clean, readable format | Limited tooling/IDE support |
| Self-documenting with inline schemas | Not a web standard |
| Works with all major languages | Requires encode/decode step |

---

## Benchmark Comparison

| Format | Avg Tokens | Retrieval Accuracy | Best For |
|--------|:----------:|:------------------:|----------|
| **TOON** | Less | **73.9%** | Repeated structure, tables |
| **JSON** | More | 69.7% | Varying fields, deep trees |

---

## Real-World Comparison

**Data:** MARE Medical Claim Schema (193 fields + 39 rules + 32 fields)

| Format | Size | Est. Tokens | Savings |
|--------|-----:|------------:|--------:|
| JSON (Pretty) | 143 KB | ~35,700 | baseline |
| JSON (Compact) | 101 KB | ~25,200 | -29% |
| YAML | 114 KB | ~28,400 | -20% |
| Markdown | 48 KB | ~12,100 | -66% |
| CSV | 42 KB | ~10,400 | -71% |
| **TOON** | **43 KB** | **~10,900** | **-70%** |

---

## Why TOON Over Alternatives?

| Requirement | JSON | CSV | TOON |
|-------------|:----:|:---:|:----:|
| Preserves nested structure | Yes | No | Yes |
| Machine-parseable | Yes | Yes | Yes |
| Lossless round-trip | Yes | No | Yes |
| Token efficient | No | Yes | Yes |
| Self-documenting schema | No | No | Yes |

**TOON = CSV efficiency + JSON structure**

---

## When to Use TOON

**Best For:**
- Repeated structure
- Tables
- Lists of similar elements with shared fields
- AI prompting with structured data
- Token-billed API applications

**Use JSON For:**
- Varying fields
- Deep trees
- REST APIs
- Non-uniform structures

---

## Try It

```bash
# CLI
npx @toon-format/cli *.json

# Python
pip install toon-py
```

```python
from toon_py import encode

data = {"users": [{"id": 1, "name": "Alice"}]}
toon_output = encode(data)
```

---

## Getting Started

**Official Resources:**
- GitHub: https://github.com/toon-format/toon
- Specification: https://github.com/toon-format/spec

**Available Libraries:**
- Python: `pip install toon-py`
- TypeScript/JavaScript: `npx @toon-format/cli`
- Elixir, PHP, R, Go, Rust, .NET

---

## Summary

| Format | Best For |
|--------|----------|
| **JSON** | Varying fields, deep trees |
| **TOON** | Repeated structure, tables |

**Bottom Line:** TOON reduces LLM token usage by 30-60% with higher retrieval accuracy (73.9% vs 69.7%).
