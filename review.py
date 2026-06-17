from google import genai
from github import Github
import os

print("Starting review.py")

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)

print("Reading files")

with open("diff.txt") as f:
    diff = f.read()

with open(".ai-review/rules.md") as f:
    rules = f.read()

print("Diff length:", len(diff))

prompt = f"""
You are a senior React engineer.

Rules:

{rules}

Review this PR:

{diff}
"""

print("Calling Gemini")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

print("Gemini response received")

review = response.text

print(review)

print("Connecting to GitHub")

g = Github(os.environ["GITHUB_TOKEN"])

print("Repository:", os.environ["GITHUB_REPOSITORY"])

repo = g.get_repo(os.environ["GITHUB_REPOSITORY"])

print("PR number:", os.environ["PR_NUMBER"])

pr = repo.get_pull(int(os.environ["PR_NUMBER"]))

print("Creating comment")

pr.create_issue_comment(review)

print("Done")