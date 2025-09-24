import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ENV_FPATH = os.path.join(ROOT_DIR, ".env")

CODE_DIR = os.path.join(ROOT_DIR, "AI")

APP_CONFIG_FPATH = os.path.join( ROOT_DIR,"config", "config.yaml")
PROMPT_CONFIG_FPATH = os.path.join( ROOT_DIR, "config", "prompt_config.yaml")

OUTPUT_DIR = os.path.join(CODE_DIR, "outputs")

DATA_DIR = os.path.join(ROOT_DIR, "data")
PDFS_DIR = os.path.join(DATA_DIR, "pdfs")