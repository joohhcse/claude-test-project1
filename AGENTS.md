<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Project: claude-test-project1

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS

## Commands
- dev: `npm run dev`
- build: `npm run build`
- lint: `npm run lint`
- typecheck: `npx tsc --noEmit`

## Code Style
- 파일: kebab-case · 클래스: PascalCase · 함수: camelCase
- Server Component 기본, "use client"는 상호작용 필요할 때만
- 폼 유효성: Zod 사용

## Architecture
- 도메인 로직은 반드시 `src/domain/` 아래에 위치
- API 호출은 Server Action으로, Route Handler는 외부 webhook 전용

## Don't
- `pages/` 라우터 절대 사용 금지 (App Router만)
- `middleware.ts` 대신 `proxy.ts` (Next.js 16 변경사항)
- `any` 타입 금지, `unknown`으로 대체

# CLAUDE.md — Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Communication
**Respond in Korean unless code/error messages dictate otherwise.**
- 응답은 한국어로. 단 코드 주석, 변수명, 커밋 메시지는 영어.
- 기술 용어(Server Component, Route Handler 등)는 번역하지 말고 영어 그대로.


---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

