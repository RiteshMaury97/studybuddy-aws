import json
import unittest
from unittest.mock import patch, MagicMock
import sys
import os
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-1")
sys.path.insert(0, "backend")
import app

class StudyBuddyHandlerTests(unittest.TestCase):
    def event(self, payload):
        return {"body": json.dumps(payload), "requestContext": {"http": {"method": "POST"}}}

    def test_empty_message_is_rejected(self):
        result = app.lambda_handler(self.event({"message": "  "}), None)
        self.assertEqual(result["statusCode"], 400)
        self.assertIn("Type a topic", json.loads(result["body"])["error"])

    def test_unknown_mode_is_rejected(self):
        result = app.lambda_handler(self.event({"message": "fractions", "mode": "hack"}), None)
        self.assertEqual(result["statusCode"], 400)

    @patch.object(app.bedrock, "converse")
    def test_successful_answer(self, converse):
        converse.return_value = {"output": {"message": {"content": [{"text": "A fraction is part of a whole."}]}}}
        result = app.lambda_handler(self.event({"message": "Explain fractions"}), None)
        self.assertEqual(result["statusCode"], 200)
        self.assertEqual(json.loads(result["body"])["answer"], "A fraction is part of a whole.")

    @patch.object(app.bedrock, "converse", side_effect=Exception("internal detail"))
    def test_provider_failure_does_not_leak_details(self, converse):
        result = app.lambda_handler(self.event({"message": "Explain fractions"}), None)
        self.assertEqual(result["statusCode"], 500)
        self.assertNotIn("internal detail", result["body"])

if __name__ == "__main__":
    unittest.main()
