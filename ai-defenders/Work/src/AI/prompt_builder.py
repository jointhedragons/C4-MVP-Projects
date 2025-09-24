"""
Prompt template construction functions for building modular prompts.
"""

import yaml
from typing import Union, List, Optional, Dict, Any
from config_loader import ALL_PROMPT_CONFIGS, APP_CONFIG


def lowercase_first_char(text: str) -> str:
    return text[0].lower() + text[1:] if text else text


def format_prompt_section(lead_in: str, value: Union[str, List[str]]) -> str:
    if isinstance(value, list):
        formatted_value = "\n".join(f"- {item}" for item in value)
    else:
        formatted_value = value
    return f"{lead_in}\n{formatted_value}"


def build_prompt_from_config(
    config: Dict[str, Any],
    app_config: Optional[Dict[str, Any]] = None,
) -> str:
    """Builds a complete prompt string based on a config dictionary."""
    if not isinstance(config, dict):
        raise TypeError(f"Expected config to be a dict, got {type(config)}")

    prompt_parts = []

    if role := config.get("role"):
        prompt_parts.append(f"You are {lowercase_first_char(role.strip())}.")

    instruction = config.get("instruction")
    if not instruction:
        raise ValueError("Missing required field: 'instruction'")
    prompt_parts.append(format_prompt_section("Your task is as follows:", instruction))

    if context := config.get("context"):
        prompt_parts.append(f"Here’s some background that may help you:\n{context}")

    if constraints := config.get("output_constraints"):
        prompt_parts.append(
            format_prompt_section(
                "Ensure your response follows these rules:", constraints
            )
        )

    if tone := config.get("style_or_tone"):
        prompt_parts.append(
            format_prompt_section(
                "Follow these style and tone guidelines in your response:", tone
            )
        )

    if format_ := config.get("output_format"):
        prompt_parts.append(
            format_prompt_section("Structure your response as follows:", format_)
        )

    if examples := config.get("examples"):
        prompt_parts.append("Here are some examples to guide your response:")
        if isinstance(examples, list):
            for i, example in enumerate(examples, 1):
                prompt_parts.append(f"Example {i}:\n{example}")
        else:
            prompt_parts.append(str(examples))

    if goal := config.get("goal"):
        prompt_parts.append(f"Your goal is to achieve the following outcome:\n{goal}")

    reasoning_strategy = config.get("reasoning_strategy")
    if reasoning_strategy and reasoning_strategy != "None" and app_config:
        strategies = app_config.get("reasoning_strategies", {})
        if strategy_text := strategies.get(reasoning_strategy):
            prompt_parts.append(strategy_text.strip())

    prompt_parts.append("Now perform the task as instructed above.")
    return "\n\n".join(prompt_parts)


def print_prompt_preview(prompt: str, max_length: int = 500) -> None:
    print("=" * 60)
    print("CONSTRUCTED PROMPT:")
    print("=" * 60)
    if len(prompt) > max_length:
        print(prompt[:max_length] + "...")
        print(f"\n[Truncated - Full prompt is {len(prompt)} characters]")
    else:
        print(prompt)
    print("=" * 60)
