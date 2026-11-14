# CLAUDE.md — Field Shift: Adapting Farms with NASA Data

## 0. Project identity

**Hackathon:** NASA Space Apps Challenge 2026  
**Challenge:** Field Shift: Adapting Farms with NASA Data  
**Event:** November 14–15, 2026  
**Working language:** Spanish for team discussion; English for code, docs, UI labels if useful  
**Primary goal:** Build a convincing, technically grounded decision-support prototype that helps a farmer explore crop-rotation strategies using NASA Earth observations + local agricultural information + farmer priorities.

Official challenge:
https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/

The official challenge describes the task as creating a decision-support tool that combines NASA Earth observations with local soil information, crop characteristics, and farmer priorities to explore rotation strategies that can strengthen soil health and adapt farms to changing conditions.

NASA explicitly frames the tool as **supporting, not replacing, farmer judgment**. We must preserve that principle in the product, UI, model outputs, and pitch.

---

# 1. Context from the team discussion

## Initial product hypothesis

The strongest concept discussed so far is a **rotation scenario / what-if engine**.

Instead of building a generic agricultural dashboard, the user experience should answer:

> **"I have this field. Given its environmental conditions and my priorities, what rotation strategies are worth exploring over the next few seasons, and why?"**

The prototype should compare the farmer's current rotation against at least two alternatives and explain the trade-offs.

Example:

```text
Current:
SOY → CORN → SOY → CORN

Alternative A:
SOY → WHEAT/SOY → CORN → COVER

Alternative B:
CORN → COVER → SOY → WHEAT
```

The system should produce evidence-backed indicators such as:

- water stress / water availability
- rainfall reliability
- heat stress
- vegetation condition
- soil moisture
- erosion / terrain risk
- expected crop compatibility
- soil-health contribution
- farmer-priority alignment

Do NOT pretend to produce precise agronomic yield predictions unless the data genuinely supports that claim.

The preferred framing is:

> **Decision support / scenario exploration, not autonomous agronomic recommendation.**

---

# 2. Product concept

Working concept:

## "Field Shift — Test your field's future."

A farmer selects or describes a field and specifies priorities.

Example priorities:

```text
Water conservation       35%
Soil health              30%
Climate resilience       20%
Yield / productivity     10%
Market suitability        5%
```

The system then:

1. Retrieves NASA Earth-observation/environmental data.
2. Derives meaningful indicators.
3. Combines those indicators with local soil/crop information.
4. Evaluates several crop-rotation scenarios.
5. Shows trade-offs.
6. Explains why each scenario scores the way it does.
7. Shows uncertainty and missing information.
8. Makes clear where farmer/agronomist validation is required.

The core UX should be:

```text
FIELD
  ↓
CURRENT CONDITIONS
  ↓
FARMER PRIORITIES
  ↓
ROTATION SCENARIOS
  ↓
TRADE-OFFS
  ↓
WHY?
  ↓
DECISION SUPPORT
```

---

# 3. Important challenge requirements / opportunities

The official challenge explicitly allows:

- apps
- models
- interactive maps
- decision-support tools
- statistical/SI approaches
- data fusion
- geospatial visualization
- scenario sliders
- comparison of at least three rotation strategies, including the existing rotation

The challenge specifically calls out:

- temperature
- soil moisture
- rainfall
- evaporation / evapotranspiration
- frost risk
- extreme precipitation
- vegetation stress
- long-term water trends
- soil information
- crop characteristics
- farmer priorities

It also explicitly encourages explaining:

- why a strategy was suggested
- what evidence supports it
- potential benefits
- information gaps
- risks requiring local review

The challenge also discusses harmonizing datasets with different spatial/temporal resolutions.

These are not optional "nice-to-haves" from a product perspective: they are opportunities to demonstrate that the project actually solves the stated problem.

---

# 4. NASA / external data resources

The challenge resources include the following major data sources.

## Tier 1 — likely MVP

### NASA POWER

Use for:
- temperature
- precipitation
- solar radiation
- humidity
- wind
- agroclimatology variables

Why:
- easy API
- point/regional time series
- no complicated Earthdata download workflow
- excellent first dataset for exploration

Potential features:

```text
mean_temperature
temperature_anomaly
precipitation_total
precipitation_anomaly
precipitation_variability
solar_radiation
relative_humidity
wind_speed
hot_days
cold_days
dry_spell_length
```

NASA POWER API:
https://power.larc.nasa.gov/

---

### GPM / IMERG

Use for:
- rainfall
- rainfall accumulation
- rainfall variability
- extreme precipitation
- water input

Potential features:

```text
annual_precipitation
seasonal_precipitation
precipitation_variance
heavy_rain_days
dry_spell_days
rainfall_anomaly
```

---

### SMAP

Use for:
- soil moisture
- water availability
- drought / water stress signals
- freeze/thaw where relevant

Potential features:

```text
mean_soil_moisture
soil_moisture_anomaly
soil_moisture_variability
minimum_soil_moisture
days_below_threshold
```

Important:
SMAP is relatively coarse compared with field-scale imagery. Do NOT claim field-level precision that the dataset cannot support.

---

## Tier 2 — strong visual / remote-sensing addition

### Landsat

Use for:
- vegetation condition
- crop vigor
- bare soil
- seasonal transitions
- field monitoring

Potential features:

```text
NDVI
EVI
NDMI
vegetation_variability
bare_soil_period
seasonal_peak
seasonal_integral
```

---

### MODIS / VIIRS

Useful for:
- longer historical vegetation signals
- NDVI / vegetation indices
- broader temporal trends
- regional context

Potential downside:
spatial resolution may be too coarse for a single small field.

---

### ECOSTRESS

Use for:
- land-surface temperature
- evapotranspiration
- heat stress
- crop water demand

Potential features:

```text
LST_mean
LST_max
ET_mean
ET_anomaly
heat_stress_days
evaporative_stress
```

This is a potentially powerful "advanced" addition, but do not let acquisition/processing block the MVP.

---

## Tier 3 — contextual / optional

### SRTM

Use for:

- elevation
- slope
- terrain
- runoff
- erosion risk

Potential features:

```text
elevation
slope
aspect
terrain_variability
erosion_proxy
```

Useful if the selected region has meaningful terrain variation.

---

### GRACE / GRACE-FO

Use for:

- long-term water-storage trends
- groundwater / total water storage context

Very useful for regional climate/water context, but probably too coarse for field-level decisions.

Do not use it just because it sounds impressive.

---

## Space Agency Partner data

ESA resources listed for the challenge include:

### Sentinel-2

Useful for:

- high-resolution vegetation monitoring
- NDVI/EVI
- red-edge features
- crop stress
- field-scale visualization

This can complement Landsat/HLS.

### ERA5

Useful for:

- continuous climate time series
- temperature
- precipitation
- wind
- humidity
- radiation
- temporal features

Again: use only if it adds clear value.

---

# 5. Local agricultural data

NASA observations are NOT sufficient by themselves.

The challenge explicitly expects local soil, crop and farmer information.

Possible sources depend on the geographic case study.

Potential variables:

## Soil

```text
soil_texture
organic_matter
pH
drainage
water_holding_capacity
infiltration
erosion_risk
soil_depth
nutrient_status
```

## Crop

```text
crop
growing_season
water_demand
root_depth
nitrogen_fixing
cover_value
erosion_protection
market_value
rotation_constraints
```

## Farmer

```text
water_priority
soil_priority
yield_priority
income_priority
risk_tolerance
equipment_constraints
market_constraints
```

Do not invent local soil values. If they are unavailable, represent them explicitly as unknown inputs and/or use a documented illustrative case.

---

# 6. Geographic strategy

A previously discussed idea was to focus on Argentina / Zona Núcleo / Pampas because it makes the project more concrete and connects naturally with the team's context.

This is a **working hypothesis, not a requirement**.

Before locking the geography, run a quick feasibility check:

1. Can we obtain reliable soil/crop information?
2. Can we obtain suitable NASA observations?
3. Can we define realistic crops and rotations?
4. Can we explain the agricultural context in the final pitch?
5. Can we build a compelling map/demo within the hackathon?

If Argentina is difficult because of data availability, choose a region where the complete data chain is stronger.

**Rule: a well-grounded case study beats a geographically ambitious but poorly supported global product.**

---

# 7. Proposed architecture

Keep the architecture simple enough to finish in the hackathon.

```text
                    NASA / LOCAL DATA
                           │
          ┌────────────────┼─────────────────┐
          ↓                ↓                 ↓
       POWER             GPM               SMAP
          │                │                 │
          └────────────────┼─────────────────┘
                           ↓
                  DATA INGESTION
                           ↓
                  NORMALIZATION
                           ↓
                 FEATURE ENGINEERING
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
        Environmental             Agricultural
           features                  features
              │                         │
              └────────────┬────────────┘
                           ↓
                    ROTATION ENGINE
                           ↓
                  SCORING / MODELING
                           ↓
                     EXPLANATIONS
                           ↓
                        API
                           ↓
                      WEB APP
```

Suggested repository:

```text
field-shift/
├── CLAUDE.md
├── README.md
├── pyproject.toml
├── .env.example
│
├── data/
│   ├── raw/
│   ├── interim/
│   └── processed/
│
├── notebooks/
│   ├── 01_data_inventory.ipynb
│   ├── 02_power_exploration.ipynb
│   ├── 03_gpm_exploration.ipynb
│   ├── 04_smap_exploration.ipynb
│   ├── 05_remote_sensing_exploration.ipynb
│   └── 06_model_experiments.ipynb
│
├── src/
│   ├── data/
│   ├── features/
│   ├── models/
│   ├── scoring/
│   └── utils/
│
├── api/
├── web/
│
├── docs/
│   ├── data_dictionary.md
│   ├── assumptions.md
│   ├── model_card.md
│   └── decisions.md
│
└── tests/
```

---

# 8. Data exploration plan

## Phase 0 — 30–60 minutes: define the case

Before coding heavily, answer:

- Where is our example field?
- What crops do we consider?
- What is the existing rotation?
- What alternatives are agronomically plausible?
- What farmer priorities matter?
- What NASA datasets cover the location?
- What local data can we actually obtain?

Create a small `case_study.yaml` or JSON.

Example:

```yaml
location:
  name: "Example farm"
  lat: -33.0
  lon: -60.0

crops:
  - soybean
  - maize
  - wheat
  - cover_crop

current_rotation:
  - soybean
  - maize

priorities:
  water: 0.35
  soil_health: 0.30
  climate_resilience: 0.20
  yield: 0.10
  market: 0.05
```

---

# 9. Data inventory

For every dataset create a small record:

```text
dataset
provider
product
spatial_resolution
temporal_resolution
coverage
access_method
license / usage constraints
latency
missingness
expected_use
```

Do not download huge datasets before understanding their resolution and coverage.

---

# 10. First exploration sequence

## Step 1 — NASA POWER

Start here.

Questions:

- What does the API return for the case-study coordinates?
- Which variables are available?
- How far back can we retrieve data?
- Can we calculate seasonal statistics?
- Can we identify anomalies and dry/heat periods?

Deliverable:

`notebooks/02_power_exploration.ipynb`

Output:

```text
climate_summary.csv
```

and at least:

- temperature time series
- precipitation time series
- seasonal aggregation
- anomaly calculation
- dry-spell indicator

---

## Step 2 — GPM

Questions:

- Does GPM agree with POWER?
- What is the spatial/temporal resolution?
- Can we detect dry periods?
- Can we detect extreme rainfall?
- Does it materially improve the model/features?

Deliverable:

`notebooks/03_gpm_exploration.ipynb`

Do not keep GPM just because it is NASA. Keep it if it improves the decision.

---

## Step 3 — SMAP

Questions:

- Is soil moisture sufficiently resolved for our case?
- Can we calculate anomalies?
- Does soil moisture add information beyond rainfall?
- Can it identify stress periods?

Deliverable:

`notebooks/04_smap_exploration.ipynb`

---

## Step 4 — vegetation / remote sensing

Only after the first three work.

Candidate:

- Landsat
- Sentinel-2
- HLS
- MODIS

Goal:

derive vegetation condition / seasonal dynamics.

Possible features:

```text
NDVI_mean
NDVI_min
NDVI_max
NDVI_variance
NDVI_anomaly
NDVI_integral
bare_soil_duration
```

This is the strongest place to reuse the team's existing Computer Vision / remote-sensing knowledge.

---

# 11. Feature engineering

Create a clear feature table.

Example:

```text
field_id
date
season
temperature_mean
temperature_max
precipitation_total
precipitation_anomaly
dry_spell_days
soil_moisture_mean
soil_moisture_anomaly
lst_mean
et_mean
ndvi_mean
ndvi_anomaly
slope
crop
```

Then derive higher-level features:

### Climate stress

```text
heat_stress_days
cold_stress_days
dry_spell_length
rainfall_variability
rainfall_anomaly
```

### Water

```text
soil_moisture_deficit
water_balance_proxy
et_precip_ratio
```

### Vegetation

```text
vegetation_stress
seasonal_peak
seasonal_integral
bare_period
```

### Terrain

```text
slope
elevation
runoff_proxy
erosion_proxy
```

---

# 12. Modeling strategy — IMPORTANT

## Do NOT start by training a model.

First establish a transparent baseline.

The biggest risk is building a "model" without enough labels.

A hackathon dataset may contain environmental observations but no ground-truth labels for:

- optimal crop rotation
- soil health improvement
- yield
- farmer utility
- long-term rotation resilience

Without labels, supervised ML can become scientifically weak.

Therefore:

## Baseline first

Build a transparent multi-objective scoring engine.

Example:

```text
rotation_score =
    w_water * water_score
  + w_soil * soil_score
  + w_climate * climate_score
  + w_yield * yield_proxy
  + w_market * market_score
```

All component scores should be explainable.

---

# 13. ML experiments to evaluate

Only train a model if the data exploration demonstrates that it is justified.

## Candidate A — Gradient boosting

Try:

- XGBoost
- LightGBM
- CatBoost

Best use case:

Predict a measurable outcome such as:

- crop stress
- vegetation response
- soil moisture
- historical yield, if reliable labels exist

Advantages:

- strong tabular baseline
- interpretable feature importance
- fast training
- works well with heterogeneous features

---

## Candidate B — Random Forest

Use as:

- baseline
- sanity check
- feature importance comparison

It is often sufficient for a hackathon.

---

## Candidate C — ranking / learning-to-rank

Potentially useful if we can construct reliable examples of "better vs worse" rotation strategies.

But do not invent preference labels.

---

## Candidate D — optimization instead of ML

This may actually be the most appropriate approach.

Treat rotation selection as a multi-objective optimization problem:

```text
maximize:
    soil_health
    water_resilience
    climate_resilience
    farmer_utility

subject to:
    crop compatibility
    growing season
    farmer constraints
    market constraints
```

Then use:

- weighted scoring
- Pareto frontier
- constrained search
- grid search over candidate rotations

This may be more defensible than pretending to have a trained predictor.

---

# 14. Time-series model experiments

Only consider:

- XGBoost with lag features
- LightGBM with lag features
- simple statistical baselines

Do NOT jump to:

- LSTM
- Transformer
- Temporal Fusion Transformer
- deep neural networks

unless the data volume and labels clearly justify it.

For this hackathon, sophisticated temporal deep learning is more likely to consume time than improve the project.

---

# 15. Computer Vision / remote sensing experiments

The team has prior CV experience, so CV is a possible differentiator.

Potential task:

```text
satellite imagery
      ↓
vegetation indices
      ↓
field condition
      ↓
crop stress / bare soil / crop phase
```

But distinguish:

### Good hackathon use

- calculate NDVI/EVI/NDMI
- map vegetation condition
- detect seasonal transitions
- compare current vs historical vegetation

### Risky hackathon use

Training a new segmentation model from scratch without labels.

If field boundaries are required, prefer:

- existing field polygons
- public boundaries
- manually selected polygons
- simple GIS operations

before attempting deep segmentation.

---

# 16. Validation strategy

Every result must answer:

> "How do we know this is reasonable?"

Use:

### Internal validation

- temporal holdout
- spatial holdout where possible
- cross-validation for tabular ML
- compare against simple baseline

### Scientific sanity checks

Check whether:

- low rainfall corresponds to lower soil moisture
- heat periods correspond to stress indicators
- vegetation indices behave seasonally
- results are physically plausible

### Sensitivity analysis

Change farmer priorities:

```text
water = 0.6
soil = 0.2
climate = 0.1
yield = 0.1
```

Then:

```text
water = 0.1
soil = 0.4
climate = 0.4
yield = 0.1
```

The ranking of rotations should change in intuitive ways.

This is a strong demo.

---

# 17. Uncertainty and data gaps

The UI must distinguish:

### Observed

Directly derived from a dataset.

### Derived

Computed from observed data.

### Modeled

Produced by an ML/statistical model.

### Assumed

Provided by the team because data is unavailable.

### Unknown

Not enough evidence.

Never present assumptions as satellite measurements.

Example:

```text
NASA observation:
Soil moisture anomaly: -18%

Derived:
High water-stress period

Agronomic assumption:
Cover crop improves soil protection

Confidence:
Medium

Needs local validation:
Crop-specific water demand
```

This will make the system much more credible.

---

# 18. Suggested MVP

The minimum useful product should contain:

## 1. Field selection

Map or coordinate input.

## 2. Current conditions

At least:

- precipitation
- temperature
- soil moisture
- vegetation indicator

## 3. Farmer priorities

Simple sliders / weights.

## 4. Three rotations

At minimum:

```text
Current rotation
Alternative A
Alternative B
```

## 5. Comparison

For each:

```text
Water resilience
Soil-health contribution
Climate resilience
Farmer-priority alignment
Risk
```

## 6. Explanation

"Why did this score higher?"

## 7. Evidence

Show which NASA dataset contributed to each indicator.

## 8. Uncertainty

Explicitly show missing data and assumptions.

---

# 19. Example product output

```text
FIELD SHIFT

Field:
Pergamino, Buenos Aires

Observed conditions:
──────────────────────────────
Rainfall anomaly       -12%
Soil moisture anomaly  -18%
Heat stress             HIGH
Vegetation condition    MEDIUM

Farmer priorities:
──────────────────────────────
Water                  35%
Soil health            30%
Climate resilience     20%
Yield                  10%
Market                  5%

ROTATION COMPARISON
──────────────────────────────

Current
SOY → CORN → SOY

Resilience       61
Water            52
Soil             59
Climate          63

Alternative A
SOY → WHEAT/SOY → CORN

Resilience       78
Water            74
Soil             81
Climate          79

Alternative B
CORN → COVER → SOY

Resilience       73
Water            69
Soil             86
Climate          71

WHY ALTERNATIVE A?

+ lower estimated water stress
+ improved seasonal soil coverage
+ better alignment with current rainfall pattern
- slightly higher management complexity

Evidence:
SMAP · GPM · NASA POWER · vegetation index

Confidence: MEDIUM

Requires local validation:
crop-specific water demand,
soil nutrient status,
market constraints.
```

Numbers above are illustrative only. NEVER hard-code them as real predictions.

---

# 20. 48-hour execution plan

## Phase 1 — Explore (first 2–4 hours)

- choose geographic case
- choose crops
- identify current rotation
- test NASA POWER
- test GPM
- test SMAP
- inspect one remote-sensing source
- document resolutions and limitations

**Decision gate:**

If a dataset is painful and doesn't materially improve the prototype, drop it.

---

## Phase 2 — Build the feature pipeline

Create:

```text
raw data
    ↓
cleaning
    ↓
common spatial/temporal representation
    ↓
features
    ↓
feature table
```

The feature table is the central artifact.

---

## Phase 3 — Build baseline decision engine

Before ML:

```text
features
   ↓
transparent scoring
   ↓
rotation ranking
```

Make this work end-to-end.

---

## Phase 4 — Evaluate ML

Ask:

1. Do we have labels?
2. Are they trustworthy?
3. Is there enough data?
4. Is there a meaningful target?
5. Does ML outperform the baseline?
6. Can we explain the model?

If any answer is "no", stay with the transparent scoring / optimization engine.

If yes:

- train baseline Random Forest
- train XGBoost/LightGBM
- compare validation metrics
- inspect feature importance
- decide whether ML belongs in the final product

---

## Phase 5 — Build UI

Prioritize:

1. map
2. field conditions
3. farmer priorities
4. rotation comparison
5. explanation
6. evidence
7. uncertainty

Do not spend half the hackathon on visual polish before the pipeline works.

---

## Phase 6 — Demo / pitch

The demo should follow:

```text
"I own this field."
        ↓
"Here are my priorities."
        ↓
"NASA tells us these conditions are changing."
        ↓
"Here are three possible rotations."
        ↓
"Here is how each performs against my priorities."
        ↓
"Here is why."
        ↓
"Here is what we still don't know."
```

The final message:

> **Field Shift doesn't tell farmers what to do. It gives them a way to test what could happen before they make the decision.**

---

# 21. Team engineering rules

## Do

- keep data provenance
- save raw data separately
- document transformations
- write small reproducible scripts
- use notebooks for exploration, scripts/modules for production
- keep model experiments reproducible
- record assumptions
- make uncertainty visible
- prefer simple models that can be explained

## Don't

- invent ground truth
- claim causality from correlation
- call a heuristic "AI" without explaining it
- claim field-level precision from coarse satellite data
- train deep models just because we can
- download huge datasets before checking resolution
- build a dashboard disconnected from the decision problem
- hide missing data
- spend the entire hackathon on frontend polish

---

# 22. Suggested Python stack

Prefer:

```text
Python 3.12+
pandas
numpy
scikit-learn
xgboost (only if useful)
matplotlib
seaborn (only for internal exploration if desired)
geopandas
shapely
rasterio
xarray
rioxarray
requests
earthaccess
```

For API:

```text
FastAPI
```

For frontend:

```text
React / Next.js
```

For maps:

```text
MapLibre / Leaflet / deck.gl
```

Do not add infrastructure unless necessary.

---

# 23. First coding tasks for Claude Code

When starting implementation, Claude should work in this order:

### Task 1

Create the repository structure.

### Task 2

Create a `case_study.yaml`.

### Task 3

Implement a NASA POWER client.

Requirements:

- configurable coordinates
- configurable date range
- configurable variables
- retries
- caching
- raw JSON saved to `data/raw/`

### Task 4

Build POWER exploration notebook.

### Task 5

Implement GPM ingestion.

### Task 6

Implement SMAP ingestion.

### Task 7

Create a unified feature table.

### Task 8

Implement transparent rotation scorer.

### Task 9

Create at least three rotation scenarios.

### Task 10

Only then evaluate whether a trained model is warranted.

---

# 24. Definition of done for data exploration

We are ready to build the product when we can answer:

- What region are we modeling?
- What crops are we modeling?
- What is the current rotation?
- What are the alternative rotations?
- What NASA data do we use?
- At what spatial resolution?
- At what temporal resolution?
- What features do we derive?
- Which features actually influence the decision?
- What local data are assumptions?
- What are the limitations?
- Can we reproduce the pipeline from scratch?

---

# 25. Definition of done for ML

A model is allowed into the final product only if:

- there is a defensible target
- there is enough training data
- labels are credible
- a baseline exists
- validation is performed correctly
- the model provides useful improvement
- feature importance / explanation is possible
- uncertainty can be communicated

Otherwise, use the transparent multi-objective scoring / optimization engine.

**A scientifically honest non-ML system is better than a fake ML system.**

---

# 26. Important scientific framing

The product is not:

> "NASA predicts the best crop rotation."

The product is:

> "NASA Earth observations provide environmental evidence that can be combined with local agricultural information and farmer priorities to explore plausible rotation strategies."

This distinction must remain consistent throughout:

- README
- UI
- pitch
- model documentation
- submission

---

# 27. Current working hypotheses

These are hypotheses to test, not facts:

1. A farmer-facing scenario comparison is more useful than a generic environmental dashboard.
2. NASA POWER + GPM + SMAP may provide enough environmental signal for an MVP.
3. Vegetation data from Landsat/Sentinel/HLS could materially improve the product.
4. A transparent multi-objective scorer may be more defensible than supervised ML.
5. If reliable labels exist, gradient boosting is the first ML family to evaluate.
6. Farmer priorities should change the ranking of rotations.
7. Showing evidence + uncertainty can be a major differentiator.
8. A geographically focused case study will be more compelling than pretending to solve global agriculture.

---

# 28. Guiding principle

Build the smallest system that makes the following statement believable:

> **"Given a real field, real environmental observations, real agricultural constraints, and a farmer's priorities, Field Shift lets them compare plausible crop rotations and understand the evidence and trade-offs behind each one."**

Everything else is secondary.
