import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
from llms import get_llm
from langchain_core.messages import HumanMessage
import datetime

sys.path.append(str(Path(__file__).parent.parent))

from utils import load_yaml_config, load_env, save_text_to_file
from paths import PROMPT_CONFIG_FPATH, APP_CONFIG_FPATH, OUTPUT_DIR
from prompt_builder import build_prompt_from_config


def invoke_llm(
    prompt: str, model: str = "gemini-2.5-flash-lite", temperature: float = 0.0
) -> Optional[str]:
    """Calls the LLM with a prompt and returns the response."""
    try:
        llm = get_llm(model)
        message = HumanMessage(content=prompt)
        response = llm.invoke([message])
        return response.content
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return None


def run_prompt_example(
    all_prompts_config: Dict[str, Any],
    prompt_config_key: str,
    model_name: str,
    app_config: Dict[str, Any],
    user_prompt: str,
) -> None:
    """Builds a survey prompt, runs it with the LLM, and saves the response."""
    if prompt_config_key not in all_prompts_config:
        print(f"Config key '{prompt_config_key}' not found in configuration")
        return

    # Load prompt config
    prompt_config = all_prompts_config[prompt_config_key].copy()


    # Replace placeholders in instruction
    if "{prompt}" in prompt_config.get("instruction", ""):
        prompt_config["instruction"] = prompt_config["instruction"].replace(
            "{prompt}", user_prompt
        )
    if "{results}" in prompt_config.get("instruction", ""):
        prompt_config["instruction"] = prompt_config["instruction"].replace(
            "{results}", user_prompt
        )

    # Build final LLM-ready prompt
    prompt = build_prompt_from_config(prompt_config, app_config)

    # Call LLM
    llm_response = invoke_llm(prompt, model=model_name)

    if llm_response:
        print("\n=== LLM Response ===\n")
        print(llm_response)


        # Create unique filename
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        if "Survey_Generator_cfg" in prompt_config_key:
            filename = f"survey_generated_{timestamp}.txt"
        elif "Survey_Analyzer_cfg" in prompt_config_key:
            filename = f"survey_analyzed_{timestamp}.txt"
        else:
            filename = f"llm_output_{timestamp}.txt"

        from pathlib import Path

        OUTPUT_DIR = Path("E:/C4-MVP-Projects/ai-defenders/work/src/AI/outputs")

        output_path = OUTPUT_DIR / filename
        save_text_to_file(llm_response, output_path)
        print(f"\n✅ Output saved to: {output_path}")
    else:
        print("❌ No response received from the LLM.")


def main(prompt_config_key: str) -> None:
    """Main entry point."""
    try:
        app_config = load_yaml_config(APP_CONFIG_FPATH)
        model_name = app_config.get("llm", "gemini-2.5-flash-lite")
        all_prompts_config = load_yaml_config(PROMPT_CONFIG_FPATH)

        if prompt_config_key not in all_prompts_config:
            print(f"Error: Prompt config key '{prompt_config_key}' not found.")
            return

        # Ask user for their topic/prompt
        if "Survey_Generator_cfg" in prompt_config_key:
            user_prompt = input("Enter your topic for survey generation: ")
        elif "Survey_Analyzer_cfg" in prompt_config_key:
            user_prompt = input("Paste the survey results for analysis: ")
        else:
            user_prompt = input("Enter your input prompt: ")

        run_prompt_example(
            all_prompts_config=all_prompts_config,
            prompt_config_key=prompt_config_key,
            model_name=model_name,
            app_config=app_config,
            user_prompt=user_prompt,
        )

    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    prompt_cfg_key = "Survey_Generator_cfg"
    main(prompt_config_key=prompt_cfg_key)
