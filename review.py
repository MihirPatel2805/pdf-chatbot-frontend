import os
import json
from google import genai
from github import Github

# ------------------------
# Config
# ------------------------

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)

g = Github(os.environ["GITHUB_TOKEN"])

repo = g.get_repo(os.environ["GITHUB_REPOSITORY"])

pr_number = int(os.environ["PR_NUMBER"])

pr = repo.get_pull(pr_number)

# ------------------------
# Read files
# ------------------------

with open("diff.txt", "r", encoding="utf-8") as f:
    diff = f.read()

with open(".ai-review/rules.md", "r", encoding="utf-8") as f:
    rules = f.read()

# Skip empty PRs
if not diff.strip():
    print("No changes detected.")
    exit(0)

# ------------------------
# Prompt
# ------------------------

prompt = f"""
You are a senior React + TypeScript reviewer.

Follow these rules:

{rules}

Review the following git diff:

{diff}

Return ONLY valid JSON.

Format:

[
  {{
    "severity": "error",
    "message": "Avoid using any type.",
    "suggestion": "Use a proper interface instead."
  }},
  {{
    "severity": "warning",
    "message": "Missing loading state.",
    "suggestion": "Add loading UI while fetching data."
  }}
]

Severity can be:
- error
- warning
- suggestion

Return only JSON.
"""

# ------------------------
# Call Gemini
# ------------------------

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

raw = response.text

print(raw)

# Remove markdown code fences if Gemini adds them

raw = raw.replace("```json", "").replace("```", "").strip()

try:
    findings = json.loads(raw)

except Exception as e:
    print("Failed to parse Gemini output")
    print(e)

    pr.create_issue_comment(
        f"⚠️ Failed to parse AI review.\n\n```\n{raw}\n```"
    )

    raise

# ------------------------
# Create separate comments
# ------------------------

emoji_map = {
    "error": "❌",
    "warning": "⚠️",
    "suggestion": "💡"
}

count = 0

for finding in findings:

    severity = finding.get("severity", "suggestion")
    message = finding.get("message", "")
    suggestion = finding.get("suggestion", "")

    body = f"""
{emoji_map.get(severity,'💡')} **{severity.upper()}**

{message}

### Suggestion

{suggestion}
"""

    pr.create_issue_comment(body)

    count += 1

print(f"Posted {count} comments.")