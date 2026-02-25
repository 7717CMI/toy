"""
Generate Toy Market data files:
- segmentation_analysis.json (structure)
- value.json (market value in Million USD)
- volume.json (volume in Million Units)
"""

import json
import random
import math

random.seed(42)

YEARS = list(range(2021, 2034))  # 2021-2033

# === SEGMENT DEFINITIONS ===

# By Toy Category (hierarchical)
TOY_CATEGORY = {
    "Electronic & Tech-Enabled Toys": [
        "Interactive electronic toys",
        "Robotic toys",
        "App-connected toys",
        "AI / smart toys",
        "Others Electronic Toys"
    ],
    "Licensed / Theme Toys": [
        "Transformers / Marvel / Disney toys",
        "Anime & gaming franchises (One Piece, Pokémon, etc.)",
        "Movie & TV show merchandise",
        "Character action figures & playsets",
        "Other Theme-based Toys"
    ],
    "STEM / Educational Toys": [
        "Robotics & coding kits",
        "Science experiment kits",
        "Engineering kits",
        "Learning board games",
        "Other STEM Toys"
    ],
    "Construction & Block-Building Toys": [
        "LEGO & compatible brick toys",
        "Magnetic building sets",
        "Motorized building kits",
        "Construction vehicles & playsets",
        "Other Block Toys"
    ],
    "Collectibles & Hobby Toys": [
        "Trading cards (Pokémon, sports cards, etc.)",
        "Mini-collectibles & blind boxes",
        "Action figures & statues",
        "Hobby kits & model kits",
        "Other Collectables"
    ],
    "Other Toys": []  # leaf node (no children)
}

# By Price Tier (flat)
PRICE_TIER = [
    "Economy / Mass-market toys",
    "Mid-range toys",
    "Premium & collector edition toys"
]

# By Age Group (flat)
AGE_GROUP = [
    "0–3 years (infant & toddler toys)",
    "3–5 years (preschool toys)",
    "5–12 years (core toy consumption segment)",
    "Teens & adult collectors (12+ years)"
]

# By Sales Channel (hierarchical)
SALES_CHANNEL = {
    "Offline": [
        "Toy specialty stores",
        "Mass retail / supermarkets",
        "Department stores",
        "Hobby & collectibles stores"
    ],
    "Online": [
        "E-commerce marketplaces (Amazon, Walmart, Target)",
        "Brand-owned websites"
    ]
}

# Geography
GEOGRAPHIES = {
    "North America": ["U.S.", "Canada"]
}


def generate_time_series(base_value, growth_rate, volatility=0.02):
    """Generate a time series with compounding growth and some noise."""
    values = {}
    current = base_value
    for year in YEARS:
        noise = random.uniform(-volatility, volatility)
        current = current * (1 + growth_rate + noise)
        values[str(year)] = round(current, 1)
    return values


def split_to_children(parent_series, num_children, shares=None):
    """Split a parent time series into children that sum to parent."""
    if shares is None:
        # Generate random shares
        raw_shares = [random.uniform(0.5, 2.0) for _ in range(num_children)]
        total = sum(raw_shares)
        shares = [s / total for s in raw_shares]

    children = []
    for i in range(num_children):
        child = {}
        for year_str, value in parent_series.items():
            # Add slight drift to shares over time
            drift = 1.0 + random.uniform(-0.01, 0.01) * (int(year_str) - 2021)
            child_val = value * shares[i] * drift
            child[year_str] = round(child_val, 1)
        children.append(child)

    # Adjust last child to ensure sum matches parent exactly
    for year_str in parent_series:
        total_others = sum(children[j][year_str] for j in range(num_children - 1))
        children[-1][year_str] = round(parent_series[year_str] - total_others, 1)

    return children


def generate_segment_data_for_geography(geo_name, is_country=False, scale=1.0):
    """Generate all segment data for a geography."""
    data = {}

    # === By Toy Category (hierarchical) ===
    toy_cat_data = {}
    # Base values for each parent category (in Million USD for value)
    parent_bases = {
        "Electronic & Tech-Enabled Toys": 4200 * scale,
        "Licensed / Theme Toys": 5800 * scale,
        "STEM / Educational Toys": 2800 * scale,
        "Construction & Block-Building Toys": 3500 * scale,
        "Collectibles & Hobby Toys": 2200 * scale,
        "Other Toys": 1500 * scale
    }
    parent_growth = {
        "Electronic & Tech-Enabled Toys": 0.065,
        "Licensed / Theme Toys": 0.045,
        "STEM / Educational Toys": 0.072,
        "Construction & Block-Building Toys": 0.048,
        "Collectibles & Hobby Toys": 0.058,
        "Other Toys": 0.035
    }

    for parent_name, children_names in TOY_CATEGORY.items():
        parent_series = generate_time_series(parent_bases[parent_name], parent_growth[parent_name])

        if children_names:
            children_data = split_to_children(parent_series, len(children_names))
            # Include parent aggregated year data alongside children
            toy_cat_data[parent_name] = {}
            # Add parent year data at the same level (processor reads these as aggregated)
            toy_cat_data[parent_name].update(parent_series)
            toy_cat_data[parent_name]["_aggregated"] = True
            toy_cat_data[parent_name]["_level"] = 2
            for j, child_name in enumerate(children_names):
                toy_cat_data[parent_name][child_name] = children_data[j]
        else:
            # "Other Toys" is a leaf node
            toy_cat_data[parent_name] = parent_series

    data["By Toy Category"] = toy_cat_data

    # === By Price Tier (flat) ===
    price_bases = [8500 * scale, 7200 * scale, 4300 * scale]
    price_growth = [0.038, 0.052, 0.068]
    price_data = {}
    for i, name in enumerate(PRICE_TIER):
        price_data[name] = generate_time_series(price_bases[i], price_growth[i])
    data["By Price Tier"] = price_data

    # === By Age Group (flat) ===
    age_bases = [3800 * scale, 4600 * scale, 7500 * scale, 4100 * scale]
    age_growth = [0.042, 0.048, 0.045, 0.062]
    age_data = {}
    for i, name in enumerate(AGE_GROUP):
        age_data[name] = generate_time_series(age_bases[i], age_growth[i])
    data["By Age Group"] = age_data

    # === By Sales Channel (hierarchical) ===
    channel_data = {}
    channel_parent_bases = {
        "Offline": 12000 * scale,
        "Online": 8000 * scale
    }
    channel_growth = {
        "Offline": 0.028,
        "Online": 0.085
    }

    for parent_name, children_names in SALES_CHANNEL.items():
        parent_series = generate_time_series(channel_parent_bases[parent_name], channel_growth[parent_name])
        children_data = split_to_children(parent_series, len(children_names))
        channel_data[parent_name] = {}
        # Add parent aggregated year data
        channel_data[parent_name].update(parent_series)
        channel_data[parent_name]["_aggregated"] = True
        channel_data[parent_name]["_level"] = 2
        for j, child_name in enumerate(children_names):
            channel_data[parent_name][child_name] = children_data[j]

    data["By Sales Channel"] = channel_data

    return data


def generate_volume_segment_data(geo_name, is_country=False, scale=1.0):
    """Generate all segment volume data for a geography (in Million Units)."""
    data = {}

    # === By Toy Category (hierarchical) ===
    toy_cat_data = {}
    parent_bases = {
        "Electronic & Tech-Enabled Toys": 180 * scale,
        "Licensed / Theme Toys": 320 * scale,
        "STEM / Educational Toys": 145 * scale,
        "Construction & Block-Building Toys": 210 * scale,
        "Collectibles & Hobby Toys": 165 * scale,
        "Other Toys": 95 * scale
    }
    parent_growth = {
        "Electronic & Tech-Enabled Toys": 0.055,
        "Licensed / Theme Toys": 0.038,
        "STEM / Educational Toys": 0.062,
        "Construction & Block-Building Toys": 0.042,
        "Collectibles & Hobby Toys": 0.048,
        "Other Toys": 0.028
    }

    for parent_name, children_names in TOY_CATEGORY.items():
        parent_series = generate_time_series(parent_bases[parent_name], parent_growth[parent_name])

        if children_names:
            children_data = split_to_children(parent_series, len(children_names))
            toy_cat_data[parent_name] = {}
            # Add parent aggregated year data
            toy_cat_data[parent_name].update(parent_series)
            toy_cat_data[parent_name]["_aggregated"] = True
            toy_cat_data[parent_name]["_level"] = 2
            for j, child_name in enumerate(children_names):
                toy_cat_data[parent_name][child_name] = children_data[j]
        else:
            toy_cat_data[parent_name] = parent_series

    data["By Toy Category"] = toy_cat_data

    # === By Price Tier (flat) ===
    price_bases = [520 * scale, 380 * scale, 115 * scale]
    price_growth = [0.032, 0.044, 0.058]
    price_data = {}
    for i, name in enumerate(PRICE_TIER):
        price_data[name] = generate_time_series(price_bases[i], price_growth[i])
    data["By Price Tier"] = price_data

    # === By Age Group (flat) ===
    age_bases = [210 * scale, 280 * scale, 390 * scale, 135 * scale]
    age_growth = [0.036, 0.041, 0.038, 0.052]
    age_data = {}
    for i, name in enumerate(AGE_GROUP):
        age_data[name] = generate_time_series(age_bases[i], age_growth[i])
    data["By Age Group"] = age_data

    # === By Sales Channel (hierarchical) ===
    channel_data = {}
    channel_parent_bases = {
        "Offline": 600 * scale,
        "Online": 415 * scale
    }
    channel_growth = {
        "Offline": 0.022,
        "Online": 0.075
    }

    for parent_name, children_names in SALES_CHANNEL.items():
        parent_series = generate_time_series(channel_parent_bases[parent_name], channel_growth[parent_name])
        children_data = split_to_children(parent_series, len(children_names))
        channel_data[parent_name] = {}
        # Add parent aggregated year data
        channel_data[parent_name].update(parent_series)
        channel_data[parent_name]["_aggregated"] = True
        channel_data[parent_name]["_level"] = 2
        for j, child_name in enumerate(children_names):
            channel_data[parent_name][child_name] = children_data[j]

    data["By Sales Channel"] = channel_data

    return data


def main():
    # ===== 1. SEGMENTATION ANALYSIS =====
    segmentation = {
        "Global": {
            "By Toy Category": {},
            "By Price Tier": {},
            "By Age Group": {},
            "By Sales Channel": {},
            "By Region": {
                "North America": {
                    "U.S.": {},
                    "Canada": {}
                }
            }
        }
    }

    # Build By Toy Category hierarchy
    for parent_name, children_names in TOY_CATEGORY.items():
        if children_names:
            segmentation["Global"]["By Toy Category"][parent_name] = {
                child: {} for child in children_names
            }
        else:
            segmentation["Global"]["By Toy Category"][parent_name] = {}

    # Build By Price Tier (flat)
    for name in PRICE_TIER:
        segmentation["Global"]["By Price Tier"][name] = {}

    # Build By Age Group (flat)
    for name in AGE_GROUP:
        segmentation["Global"]["By Age Group"][name] = {}

    # Build By Sales Channel hierarchy
    for parent_name, children_names in SALES_CHANNEL.items():
        segmentation["Global"]["By Sales Channel"][parent_name] = {
            child: {} for child in children_names
        }

    with open("public/data/segmentation_analysis.json", "w", encoding="utf-8") as f:
        json.dump(segmentation, f, indent=2, ensure_ascii=False)
    print("Written segmentation_analysis.json")

    # ===== 2. VALUE DATA =====
    # Reset seed for consistency
    random.seed(42)

    value_data = {}

    # U.S. data (~85% of North America)
    random.seed(100)
    us_data = generate_segment_data_for_geography("U.S.", is_country=True, scale=0.85)
    us_data["By Country"] = {}  # Countries don't have "By Country"

    # Canada data (~15% of North America)
    random.seed(200)
    canada_data = generate_segment_data_for_geography("Canada", is_country=True, scale=0.15)

    # North America = sum of U.S. + Canada (approximately, with its own growth pattern)
    random.seed(300)
    na_data = generate_segment_data_for_geography("North America", scale=1.0)
    # Add "By Country" for North America
    na_by_country = {}
    # Generate country-level totals for By Country
    na_by_country["U.S."] = generate_time_series(17000, 0.052)
    na_by_country["Canada"] = generate_time_series(3000, 0.048)
    na_data["By Country"] = na_by_country

    value_data["North America"] = na_data
    value_data["U.S."] = {k: v for k, v in us_data.items() if k != "By Country"}
    value_data["Canada"] = {k: v for k, v in canada_data.items() if k != "By Country"}

    with open("public/data/value.json", "w", encoding="utf-8") as f:
        json.dump(value_data, f, indent=2, ensure_ascii=False)
    print("Written value.json")

    # ===== 3. VOLUME DATA =====
    volume_data = {}

    # U.S. volume
    random.seed(400)
    us_vol = generate_volume_segment_data("U.S.", is_country=True, scale=0.85)

    # Canada volume
    random.seed(500)
    canada_vol = generate_volume_segment_data("Canada", is_country=True, scale=0.15)

    # North America volume
    random.seed(600)
    na_vol = generate_volume_segment_data("North America", scale=1.0)
    # Add "By Country"
    na_vol_country = {}
    na_vol_country["U.S."] = generate_time_series(850, 0.042)
    na_vol_country["Canada"] = generate_time_series(165, 0.038)
    na_vol["By Country"] = na_vol_country

    volume_data["North America"] = na_vol
    volume_data["U.S."] = us_vol
    volume_data["Canada"] = canada_vol

    with open("public/data/volume.json", "w", encoding="utf-8") as f:
        json.dump(volume_data, f, indent=2, ensure_ascii=False)
    print("Written volume.json")

    # Print summary
    print("\n=== Summary ===")
    print(f"Geographies: {list(value_data.keys())}")
    for geo in value_data:
        print(f"  {geo}: {list(value_data[geo].keys())}")
        for seg_type in value_data[geo]:
            items = value_data[geo][seg_type]
            count = 0
            for k, v in items.items():
                if isinstance(v, dict) and any(str(y) in v for y in YEARS):
                    count += 1
                elif isinstance(v, dict):
                    count += len(v)
            print(f"    {seg_type}: {count} leaf segments")


if __name__ == "__main__":
    main()
