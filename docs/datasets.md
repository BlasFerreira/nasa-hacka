# Datasets — Field Shift: Adapting Farms with NASA Data

Source: official challenge page, *Resources* tab
<https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources>

> NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites. For non-U.S. Government websites, participants must comply with any data use parameters of that specific website.

Coverage notes in the **Scope** column come from the page text. Size notes at the bottom are rough estimates, not from the page.

## 1. NASA data

| Dataset | Link | What it gives us | Useful for |
|---|---|---|---|
| **SMAP** (Soil Moisture Active Passive) | [link](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/smap) | Global surface soil moisture and freeze/thaw state, every 2–3 days | Drought stress, water availability, infiltration, early crop-stress signals |
| **GPM / IMERG** | [link](https://gpm.nasa.gov/data) | Global precipitation rate and accumulation. Worldview IMERG layers can be downloaded directly as high-resolution images | Rainfall reliability, extreme storms, erosion risk, comparing rotations under different precipitation scenarios |
| **Landsat** | [link](https://earthexplorer.usgs.gov/) | Reflectance, NDVI, vegetation indices at 30 m | Crop vigor, seasonal transitions, stress periods |
| **MODIS** | [link](https://lpdaac.usgs.gov/products/) | Reflectance, NDVI, vegetation indices at 250–1000 m | Same as Landsat, coarser but denser in time |
| **VIIRS** | [link](https://search.earthdata.nasa.gov/search?q=VIIRS) | Reflectance, NDVI, vegetation indices at 250–1000 m | Same as MODIS |
| **NASA POWER** | [link](https://power.larc.nasa.gov/) | Solar, meteorological and climatology data (temperature, humidity, radiation, derived indicators) | Crop water use, growing-season conditions, frost risk, climate suitability |
| **SRTM** | [link](https://www.earthdata.nasa.gov/data/instruments/srtm) | Global elevation | Slope, runoff, erosion risk, water flow |
| **ECOSTRESS** | [link](https://ecostress.jpl.nasa.gov/data) | Land-surface temperature and evapotranspiration at high resolution | Heat hotspots, plant stress, crop-water demand, field-level microclimate |
| **GEDI** | [link](https://gedi.umd.edu/data) | Laser-based canopy height, leaf area index, above-ground biomass (L4 biomass products) | Vegetation structure and land-cover shifts around fields. Most effective where vegetation is tall |
| **NLDAS / GLDAS** | [link](https://www.earthdata.nasa.gov/) (search "NLDAS" or "GLDAS" in Earthdata Search) | Gridded temperature, precipitation, soil moisture, ET proxies, radiation at sub-daily resolution | Drought onset, moisture deficits, continuous climate time series for the models |

## 2. Complementary agricultural / environmental data

| Dataset | Link | What it gives us | Scope |
|---|---|---|---|
| **USDA Ag Data Commons** | [link](https://www.nal.usda.gov/services/agdatacommons) | Open datasets on soils, crops, climate, land management, phenology, water quality | — |
| **Web Soil Survey (WSS)** | [link](https://websoilsurvey.nrcs.usda.gov/app/) | Soil maps, texture, organic matter, drainage, erosion risk, hydrologic ratings, land-use suitability | U.S. |
| **USDA NRCS SSURGO / STATSGO2** | [link](https://www.nrcs.usda.gov/resources/data-and-reports/soils) | Soil attributes: texture, organic matter, drainage class, hydrologic soil group, restrictive layers, water-holding capacity. SSURGO is field-scale, STATSGO2 regional | U.S. |
| **Cropland Data Layer (CDL / CropScape)** | [link](https://nassgeodata.gmu.edu/CropScape/) | Annual 30 m crop-type classification (corn, soybeans, cotton, wheat, alfalfa, …). Can serve as labeled land-cover inputs | U.S. |
| **PRISM Climate Data** (Oregon State) | [link](https://prism.oregonstate.edu) | Daily, monthly and 30-year normals for precipitation, temperature, dewpoint, frost/freeze dates. Accounts for topography | U.S. |
| **NAIP** | [link](https://naip-usdaonline.hub.arcgis.com/) | ~1 m aerial imagery in the growing season | U.S. |
| **USGS NLCD** | [link](https://www.usgs.gov/centers/eros/science/national-land-cover-database) | 30 m land cover / land use over multiple decades | U.S. |
| **FAO GAEZ** | [link](https://gaez.fao.org) | Agro-climatic crop suitability, soil constraints, water availability, yield potential | Global |
| **CoCoRaHS** | [link](https://www.cocorahs.org/Maps) | Crowd-sourced daily precipitation. Useful to validate IMERG | North America |
| **USGS NWIS** | [link](https://waterdata.usgs.gov/nwis) | Groundwater levels, streamflow, river stages, water quality | U.S. |
| **USDA AMS Market News** | [link](https://www.ams.usda.gov/market-news) | Commodity prices, demand trends, market conditions. Tells us if a rotation crop has a viable market | U.S. |
| **USDA NASS QuickStats** | [link](https://quickstats.nass.usda.gov) | County/state yields, planted acreage, production history, crop frequency | U.S. |
| **OpenET** | [link](https://openetdata.org) | Field-scale evapotranspiration from satellite-driven models. Complements ECOSTRESS and POWER | Western U.S. |
| **USFS LANDFIRE** | [link](https://www.landfire.gov) | Vegetation type and condition, fuel models, landscape characteristics | U.S. |

## 3. Space agency partner resources (ESA)

| Dataset | Link | What it gives us |
|---|---|---|
| **Copernicus Sentinel-2** | [link](https://dataspace.copernicus.eu) | 10–20 m multispectral imagery with red-edge, NIR and SWIR bands. NDVI/EVI, bare soil, crop stress. Finer than Landsat/MODIS |
| **ERA5** (ECMWF reanalysis) | [link](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview) | Hourly global temperature, precipitation, wind, humidity, soil temperature, radiation. Fills gaps where stations are sparse |

## 4. If the field is outside the U.S.

The page describes these as global: SMAP, GPM/IMERG, NASA POWER, SRTM, FAO GAEZ, Sentinel-2 and ERA5. Landsat, MODIS/VIIRS, ECOSTRESS and GEDI are satellite products that are also generally global (not stated on the page). NLDAS is North America only and GLDAS is global (our knowledge, not stated on the page). The USDA, USGS, PRISM, OpenET, LANDFIRE and CoCoRaHS sources cover the U.S. (or North America) only.

## 5. Size notes (rough estimates, not from the page)

The full archives are far too large to download (NASA Earthdata as a whole is >100 PB; for the products listed here we estimate tens of PB). For the prototype, request only a spatial subset and time window for the chosen field, which is typically a few GB. Several sources (SMAP, ECOSTRESS, Landsat/MODIS via Earthdata, Copernicus) require a free account login.
