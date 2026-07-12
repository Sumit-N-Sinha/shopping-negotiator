import unittest

from services.ai_logic.utils.prompt_templates import build_gemini_prompt


class GeminiPromptTemplateTests(unittest.TestCase):
    def test_prompt_contains_json_structure_and_query(self) -> None:
        prompt = build_gemini_prompt("best laptop under 1000", "text", "electronics")

        self.assertIn("Return JSON only", prompt)
        self.assertIn('"deals"', prompt)
        self.assertIn("User request:", prompt)
        self.assertIn("best laptop under 1000", prompt)


if __name__ == "__main__":
    unittest.main()
