# Setup — WebDev 11-11

This repository contains the Google Apps Script source, a Cloudflare Worker gateway, and an OpenAPI schema for a custom GPT Action.

## Architecture

ChatGPT Custom GPT Action → Cloudflare Worker (validates Bearer API key) → Apps Script Web App (validates bridge secret) → Google Sheets.

The Worker is important because Apps Script Web Apps do not expose arbitrary incoming HTTP headers to `doPost(e)`. Do not put API keys in the Apps Script URL or in the OpenAPI schema.

## 1. Create the Apps Script project

1. Open https://script.google.com/ and create a standalone project named **WebDev 11-11 Sheets API**.
2. Copy `apps-script/Code.gs` into the Apps Script editor.
3. In **Project Settings → Script Properties**, add:
   - Property: `BRIDGE_SECRET`
   - Value: generate a long random secret (at least 32 bytes). Keep it private.
4. Save the project.

## 2. Deploy Apps Script as a Web App

1. Select **Deploy → New deployment → Web app**.
2. Set **Execute as** to your account.
3. Set access to the narrowest option that allows the gateway to call it. For a server-to-server call, this may require **Anyone**; if your Google Workspace policy disallows that, stop and use an authenticated Google Cloud endpoint instead.
4. Deploy, authorize the requested Google Sheets permissions, and copy the URL ending in `/exec`.
5. Keep the deployment URL private. Do not paste secrets into chat.

The script creates a new spreadsheet when the `createSpreadsheet` action is called. It can list tabs, read ranges, append rows, and update ranges.

## 3. Deploy the Cloudflare Worker gateway

Install Node.js and Wrangler, then from `cloudflare-worker/`:

```bash
npm install --save-dev wrangler
npx wrangler login
npx wrangler deploy
```

Set the secrets:

```bash
npx wrangler secret put GPT_ACTION_KEY
npx wrangler secret put BRIDGE_SECRET
npx wrangler secret put APPS_SCRIPT_URL
```

- `GPT_ACTION_KEY`: a separate random key used by the GPT Action's Bearer authentication.
- `BRIDGE_SECRET`: the exact same value stored in Apps Script Script Properties.
- `APPS_SCRIPT_URL`: the Apps Script deployment URL ending in `/exec`.

After deployment, copy the Worker URL (for example, `https://webdev-11-11-gpt-bridge.<your-subdomain>.workers.dev`).

## 4. Configure the Custom GPT Action

1. Open the GPT editor and create or edit a GPT.
2. In **Actions**, choose **Create new action**.
3. Set Authentication to **API Key → Bearer** and enter the value of `GPT_ACTION_KEY`.
4. Paste the contents of `openapi/gpt-action.yaml`.
5. Replace `https://YOUR-WORKER.workers.dev` with your actual Worker URL.
6. Save and test the action.

Suggested GPT instructions:

> Use the WebDev 11-11 Google Sheets action when the user asks to create or manage a spreadsheet. Create a spreadsheet when requested and return its URL. For edits, use the specified spreadsheet and exact range or append rows. The user has authorized automatic execution for ordinary spreadsheet changes. Never delete sheets, delete rows, share files, change permissions, or perform destructive bulk operations. Confirm the target spreadsheet and range from context before editing; if ambiguous, ask one concise clarification. Report the exact cells or rows changed.

## 5. Available operations

| Action | Required fields | Behavior |
|---|---|---|
| `createSpreadsheet` | `title` optional | Creates a spreadsheet in the deploying Google account's Drive |
| `listSheets` | `spreadsheetId` | Lists tabs and used dimensions |
| `readRange` | `spreadsheetId` | Reads an A1 range (defaults to A1:Z50) |
| `appendRows` | `spreadsheetId`, `values` | Appends rows at the end of a tab |
| `updateRange` | `spreadsheetId`, `range`, `values` | Replaces values in an exact A1 range |

Limits: 500 rows and 30 columns per write request. Update dimensions must match the selected range exactly.

## 6. Local development and GitHub sync

Install clasp and sign in:

```bash
npm install -g @google/clasp
clasp login
```

Create a local Apps Script project or clone the Script ID, then use `clasp push` to upload and `clasp pull` to download. Keep Script IDs, deployment URLs, API keys, and bridge secrets out of Git.

## Security notes

- Never commit `GPT_ACTION_KEY`, `BRIDGE_SECRET`, OAuth tokens, or private spreadsheet data.
- Do not enable delete, share, or permission-changing operations in this initial version.
- The Worker validates the GPT Bearer key; Apps Script separately validates the bridge secret.
- Review Google's deployment access options and your Workspace administrator's policies before exposing a Web App.
- The GPT Action executes writes automatically as requested. Keep a version history in Sheets and GitHub, and use a test spreadsheet before production data.
