"""
Centralized config loader for YAML files.
"""

import yaml
import os


PROMPT_CONFIG_PATH = r"E:\C4-MVP-Projects\ai-defenders\Work\src\config\prompt_config.yaml"
APP_CONFIG_PATH = r"E:\C4-MVP-Projects\ai-defenders\Work\src\config\config.yaml"

with open(PROMPT_CONFIG_PATH, "r", encoding="utf-8") as f:
    ALL_PROMPT_CONFIGS = yaml.safe_load(f)

with open(APP_CONFIG_PATH, "r", encoding="utf-8") as f:
    APP_CONFIG = yaml.safe_load(f)
