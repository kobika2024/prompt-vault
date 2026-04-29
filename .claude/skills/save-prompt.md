# save-prompt

Save amazing prompts found online directly into PromptVault — with automatic categorization.

## When to use

Invoke this skill whenever the user shares a URL and wants to save prompt(s) from it to PromptVault.
Trigger phrases: "שמור את הפרומפט", "הוסף לוולט", "save this prompt", "add to vault", or just a bare URL with context that it's a prompt.

## What you do

### Step 1 — Fetch the page
Use WebFetch to load the URL the user provided. Read the full page content.

### Step 2 — Extract all prompts
Scan the page for every prompt you can identify. A prompt is any block of text clearly intended to be given to an AI model. Look for:
- Code blocks or blockquotes containing instruction text
- Sections labeled "Prompt", "Template", "Example prompt", "Try this", etc.
- Numbered/bulleted lists where each item is a usable prompt
- Single long-form prompts that fill most of the article

For each prompt extract:
- **title**: A short descriptive name you invent (max 60 chars, English)
- **prompt_text**: The full verbatim prompt text
- **source_url**: The URL the user gave you
- **output_description**: What this prompt produces (infer from page context)
- **notes**: Any tips, model recommendations, or parameters mentioned on the page

### Step 3 — Categorize intelligently

For each prompt, assign **category** and **output_type** based on content analysis:

**category** rules (pick exactly one):
| Category | Assign when the prompt is about… |
|---|---|
| `image-gen` | generating images — mentions Midjourney, DALL-E, Stable Diffusion, Flux, Firefly, "image prompt", portrait, landscape, photography style |
| `video-gen` | generating video — mentions Sora, Runway, Kling, Pika, animation, motion, cinematic |
| `coding` | writing, reviewing, debugging, or explaining code — mentions Python, JavaScript, TypeScript, function, API, bug, refactor, architecture |
| `writing` | writing text — blog posts, essays, copywriting, email, LinkedIn, story, poem, script, SEO content |
| `productivity` | personal systems — GTD, routines, scheduling, task management, focus, habit, morning routine |
| `learning` | explaining concepts, tutoring, study aids, flashcards, summaries, teaching |
| `business` | business strategy, marketing, sales, pitch decks, startup, product, growth |
| `other` | anything that doesn't clearly fit above |

**output_type** rules (pick exactly one):
| Type | When |
|---|---|
| `image` | prompt produces an image |
| `video` | prompt produces a video |
| `text` | prompt produces written text (default for most) |
| `skill` | prompt creates a reusable Claude/GPT skill or persona |
| `routine` | prompt creates a system, plan, or repeatable routine |
| `other` | unclear |

**tags**: Extract 2–6 relevant lowercase keywords from the prompt content and page context.

**output_url**: If the page shows a sample output image or video, capture its URL.

### Step 4 — Save each prompt via API

For each extracted prompt, call `POST http://localhost:3000/api/prompts` with JSON body:

```json
{
  "title": "...",
  "prompt_text": "...",
  "source_url": "...",
  "category": "...",
  "tags": ["...", "..."],
  "output_type": "...",
  "output_url": "...",
  "output_description": "...",
  "notes": "..."
}
```

Use the Bash tool to make the HTTP call:
```bash
curl -s -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -d '<JSON_BODY>'
```

If the API returns a non-201 status or an error field, report the failure for that prompt but continue with the others.

### Step 5 — Report results

After saving all prompts, show the user a clean summary table in Hebrew:

```
✅ נשמרו X פרומפטים מ-[domain]:

| # | שם | קטגוריה | סוג תוצר |
|---|---|---|---|
| 1 | Ultra-Detailed City Prompt | image-gen 🖼️ | image |
| 2 | Senior Code Reviewer | coding 💻 | text |

🔗 פתח את ה-Vault: http://localhost:3000
```

If a prompt failed to save, show it in red with the error reason.

## Edge cases

- **Page behind login / paywall**: Tell the user you can't access the content and ask them to paste the prompt text directly.
- **No prompts found**: Tell the user what you did find on the page and ask them to point you to the specific section.
- **Single prompt vs. many**: Works for both — save one or twenty, same flow.
- **Non-English prompts**: Save as-is, but write the `title` in English for consistency.
- **Duplicate detection**: If the API returns a conflict, mention it but don't treat it as an error.

## Important

- Never ask the user for category or tags — figure it out yourself from the content.
- Never skip prompts that are clearly present on the page.
- The PromptVault API runs on `http://localhost:3000` — the user's Next.js dev server must be running.
