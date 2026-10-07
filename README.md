# Faith Frenzy · CCD Arcade

A Preact + Vite classroom game for **two teams**, with the retro Faith Frenzy Arcade design, ten transparent clip-art illustrations, six distinct clue illustrations and large text-only category headings, animated clue reveals, score popups, and confetti. The 30-clue board alternates three Ten Commandments categories and three Parts of the Mass categories. Content uses Catholic numbering and is written for sixth graders.

## Run locally

Use Node.js 22.12 or newer (Node 22 recommended).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm test` checks scoring and saved-game rules; `npm run test:browser` runs the interaction and responsive checks against a running dev server (requires Google Chrome installed); `npm run build` creates `dist/`; `npm run preview` serves the production build.

## Host on GitHub Pages

1. Create the GitHub repository `ccd-jeopardy` and upload this project, including `package-lock.json` and `.github/workflows/deploy.yml`. Do not upload `node_modules` or `dist`.
2. Use `main` as the default branch (or update the workflow's branch name).
3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
4. Push to `main`, or run **Deploy to GitHub Pages** from the Actions tab. The workflow tests, builds, and deploys the game.
5. Open the URL shown in the successful deployment. Typical project URL: `https://ksantiagoBAH.github.io/ccd-jeopardy/`.

Vite uses relative asset paths, so this works at a repository subpath or a root/custom domain without changing configuration. There is no server, account, database, or API key to configure. Animations respect the device’s reduced-motion preference. Google Fonts are optional; local fallback fonts work if the classroom network blocks them.

## Classroom controls

- **Host tools:** name two teams, adjust scores, choose a 10–60-second timer (or no timer), enable/disable deductions and sounds, edit every clue and the final question, or start a new game.
- **Team cards:** click to choose who controls the board.
- **Clue:** the 10-second timer starts automatically when a clue opens; pause/reset it if needed; reveal with the button or `R`; select who answered and score the response. A score decision closes the clue. Correct answers give that team control; incorrect answers pass control to the other team. “No points” retires the clue without a score change. Closing without scoring keeps the clue available.
- **Undo:** reverses the last scoring, clue retirement, settings save, or final-round action during this session. Undo history clears on refresh.
- **Final challenge:** both teams write wagers privately, then the host enters and locks them before the clue appears. Each may wager from zero to its positive score. Teams at zero or below can participate with a zero wager. Both teams write their answers; the teacher reveals, marks each correct/incorrect, and shows the results. Final play can start early. Undo can reopen board play after locking wagers.
- **Fullscreen:** available on supported browsers.

Progress and teacher edits save to local storage on this browser/device. Refreshing restores the board, scores, settings, and locked final round. An open regular clue and its timer are not saved. This is one shared teacher screen: students answer aloud or on paper; there are no remote buzzers or synchronized devices.

## Customize the shared question bank

Edit `src/content.js` to change the default content for everyone. The in-game editor only changes the current browser. The sixth-grade update upgrades unchanged original clues in saved games while preserving teacher edits and scores. For future custom deployments, clear local site data to load a different default deck. Review clues against your wife's curriculum before class; equivalent wording and thoughtful answers are encouraged.

Teacher references: [USCCB Order of Mass](https://www.usccb.org/prayer-and-worship/the-mass/order-of-mass), [General Instruction, Chapter II](https://www.usccb.org/prayer-and-worship/the-mass/general-instruction-of-the-roman-missal/girm-chapter-2), and the [Catechism's Ten Commandments section](https://www.vatican.va/content/catechism/en/part_three/section_two.html).
