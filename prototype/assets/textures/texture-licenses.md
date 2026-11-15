# Texture licences

All textures used by Climate Twin are CC0 1.0 (public domain dedication). They were downloaded once (2026-11-15), resized and recompressed for the web (colour 1024 px, normal 512 px, roughness 256 px, JPEG). They are served as local files and loaded on demand by `twinMateriales()` in `src/app.tpl.html`. Nothing is fetched from the libraries at runtime.

| Files (`*-color`, `*-normal` OpenGL, `*-rough`) | Asset | Library / author | Real-world tile size | Licence | Used for |
|---|---|---|---|---|---|
| `farm-furrows-*` | [Farm Furrows](https://polyhaven.com/a/farm_furrows) | Poly Haven / Amal Kumar | 2.10 m | [CC0](https://polyhaven.com/license) | Soil base for wheat and barley |
| `dirt-*` | [Dirt](https://polyhaven.com/a/dirt) | Poly Haven / Charlotte Baglioni | 2.00 m | [CC0](https://polyhaven.com/license) | Fallow (neutral soil, no tillage assumed) |
| `ground103-*` | [Ground 103](https://ambientcg.com/view?id=Ground103) | ambientCG | ~2 m (not published; assumed) | [CC0](https://docs.ambientcg.com/license/) | Soil base for maize, soybean, sorghum and sunflower |
| `grass001-*` | [Grass 001](https://ambientcg.com/view?id=Grass001) | ambientCG | 1.40 m | [CC0](https://docs.ambientcg.com/license/) | Dense cover crops (grasses) |
| `sparse-grass-*` | [Sparse Grass](https://polyhaven.com/a/sparse_grass) | Poly Haven / Amal Kumar | 2.00 m | [CC0](https://polyhaven.com/license) | Partial cover crops (legumes) |

The crop rows (spacing, width, colour) are drawn procedurally in a shader on top of these soils. They are illustrative: they do not represent the phenological stage, the real sowing direction or observed vegetation.
