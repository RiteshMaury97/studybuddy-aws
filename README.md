# StudyBuddy — AWS Builder Center #agents prototype

A React + AWS Lambda + API Gateway + Amazon Bedrock + Amazon DynamoDB learning workspace.

The backend uses Amazon Bedrock Converse API for AI responses and DynamoDB for workspace persistence. The browser receives only the public API URL. In AWS, the Lambda execution role is the recommended authentication method for Bedrock and DynamoDB. An optional backend-only Bedrock API key setting is documented for compatible local/backend SDK environments; never expose it to the browser.

## Expanded website workspace

The frontend now includes these browser-side tools in addition to the AI chat:

- **My Notes:** create, search, and delete notes; save an AI response as a note. Workspace data syncs to DynamoDB when the API is configured, with browser local storage retained as an offline fallback.
- **To-do & Assignments:** add tasks with due dates and priority, mark them complete, and clear completed tasks.
- **Focus Room:** 25-minute focus timer, 5-minute break preset, and local completed-session count.
- **Flashcard Studio:** create topic-based practice prompts, flip cards to reveal guidance, and keep them in this browser. These starter cards are templates, not AI-generated answers.
- **AI Assistant:** level-based explanations, quiz prompts, and revision planning through the deployed API.

Notes, tasks, flashcards, exam dates, focus-session counts, goals, and accessibility text scale are saved to a DynamoDB workspace record when cloud sync is available. A client-generated workspace ID is used for this demo; it is not authentication and must not be treated as private or secure user isolation. Add Amazon Cognito/JWT authorization before production use. Voice transcription, PDF upload/question answering, reminders, and genuinely AI-generated flashcards are roadmap items and are not implemented in this prototype yet.

## Features
- Explain, quiz, and revision modes
- Beginner / intermediate / advanced level selector
- “Learning Ladder” instruction for explanations
- Friendly first-run prompts, loading state, input validation, and readable errors
- Bounded recent conversation history (last 8 messages sent to the backend)
- AWS SAM infrastructure template
- Unit tests that mock Bedrock calls

## Prerequisites
- Node.js 18+ and npm
- Python 3.12 for local unit tests
- AWS CLI configured for an account where you are allowed to deploy Lambda/API Gateway resources
- AWS SAM CLI
- Amazon Bedrock model access in the selected region

## 1. Deploy backend

The SAM template provisions:
- An HTTP API with `/chat` and `/data` endpoints
- A Lambda function that calls Amazon Bedrock Converse and reads/writes DynamoDB
- An encrypted, on-demand DynamoDB table with point-in-time recovery
- Least-scope DynamoDB permissions for the Lambda function

Use an AWS Region where your chosen Bedrock model is available. The frontend `.env` file is public build-time configuration only; never put API keys or AWS credentials in it. For deployment, prefer the Lambda execution role instead of a long-lived Bedrock API key.


From this folder:

```bash
sam validate
sam build
sam deploy --guided
```

Choose a stack name such as `studybuddy-demo`, and select a region where your chosen Bedrock model supports the Converse API. The template defaults to `amazon.nova-lite-v1:0`; verify that model ID and availability in your account/region before deploying. If needed, override it at deployment with `--parameter-overrides ModelId=YOUR_SUPPORTED_MODEL_ID`.

After deployment, copy the `ApiUrl` output. The API endpoint is the base URL; the frontend appends `/chat`.

## 2. Configure and run frontend
```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` and set the deployed API URL:

```dotenv
VITE_API_URL=https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com
```

Then run:

```bash
npm run dev
```

Open the local URL Vite prints. Restart the dev server after changing `.env`.

## 3. Run unit tests
From the project root, with Python 3.12 and boto3/botocore available:

```bash
python -m unittest discover -s tests -v
```

These tests mock the Bedrock API. They do not prove that AWS credentials, model access, CORS, deployment, or live inference work.

## 4. Important deployment notes
- The SAM template's CORS origin is set to `http://localhost:5173` for local development. Before hosting the frontend publicly, add your exact production origin to `AllowOrigins` and remove localhost if it is no longer needed.
- The Lambda response sets `Access-Control-Allow-Origin` to the configured `ALLOWED_ORIGIN`; keep this value aligned with the API Gateway CORS `AllowedOrigin` parameter. Configure the exact production frontend origin before hosting publicly.
- The example IAM statement scopes `bedrock:InvokeModel` to the selected foundation-model ARN. If you use an inference profile or a model with a different resource format, update IAM permissions according to AWS documentation.
- Never put AWS credentials, Bedrock API keys, or other secrets in frontend environment variables. Anything prefixed with `VITE_` can be exposed in the built browser bundle.
- `backend/.env.example` documents backend-only settings. `AWS_BEARER_TOKEN_BEDROCK` is optional and only works where the installed AWS SDK supports Bedrock API-key authentication. It is not needed for the deployed Lambda when using its IAM execution role. Do not commit real `.env` files.
- The repository `.gitignore` excludes local environment files, dependencies, build output, SAM artifacts, caches, and logs while allowing `.env.example` files to be committed.
- Configure an AWS Budget alert. Bedrock inference, API Gateway, Lambda, and any hosting resources may incur charges.
- The demo persists data but has no user authentication or authorization. The client-generated workspace ID can be spoofed. Add Cognito/JWT validation, per-user authorization, rate limiting, and abuse controls before public production use.
- Model outputs can be incorrect. The interface warns learners to verify important facts.

## 5. Submission proof
Before publishing the Builder Center article:
1. Deploy the stack and open the frontend.
2. Ask one explanation question and verify all four Learning Ladder steps appear.
3. Test quiz mode and revision mode.
4. Capture a screenshot or short clip of the real deployed app.
5. Record actual test results, limitations, and any latency or usage observations.
6. Add the real demo URL and screenshot/clip to `ARTICLE_DRAFT.md`.
7. Complete Builder Profile image, country, and About section.
8. Publish the article with the tag `#agents` within the challenge window.

## Cleanup
To remove resources created by the SAM stack:

```bash
sam delete
```

Check your AWS console for any separately created resources before finishing.


## Frontend folder structure

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # App state and feature routing
    ├── styles.css                # Shared design system and responsive styles
    └── components/
        ├── layout/
        │   ├── AppSidebar.jsx     # Workspace navigation
        │   └── AppHeader.jsx      # Page title and session controls
        └── common/
            ├── FeatureIntro.jsx   # Reusable feature-page introduction
            └── EmptyState.jsx     # Reusable empty-state display
```

### Install and run the frontend

From the `frontend` directory, run `npm install`, then `npm run dev`. To verify a production bundle, run `npm run build`. The build requires the dependencies in `package.json` to be installed and available. Copy `.env.example` to `.env` and set `VITE_API_URL` to the deployed API base URL before using AI requests.


## Frontend routing

The frontend uses React Router DOM (`BrowserRouter`, `Routes`, `Route`, and `NavLink`). Workspace pages have dedicated URLs such as `/notes`, `/tasks`, `/planner`, and `/analytics`. For production hosting, configure the web server/CDN to serve `index.html` for unknown application paths (SPA fallback), otherwise refreshing a nested route may return a 404.

## DynamoDB persistence and environment configuration

`frontend/.env.example` contains `VITE_API_URL`, which must be the `ApiUrl` output from `sam deploy`. Create `frontend/.env` by copying that example. Vite variables are embedded in the frontend bundle and are visible to users, so only put the public API base URL there.

The Lambda environment variables `MODEL_ID`, `TABLE_NAME`, and `ALLOWED_ORIGIN` are set by `template.yaml` and should not be copied into the frontend `.env`. The Lambda execution role grants access to the provisioned DynamoDB table and the selected Bedrock model.

The `/data` endpoint stores the workspace as one DynamoDB item and rejects payloads larger than 300 KB to remain under DynamoDB's 400 KB item limit. For a larger production app, split data into per-feature records and enforce authenticated user identity on the server.


## Environment files and API-key handling

There are two separate environment examples:

- `frontend/.env.example`: contains only `VITE_API_URL`, the public API Gateway base URL. Copy it to `frontend/.env`.
- `backend/.env.example`: documents backend-side settings, including an optional `AWS_BEARER_TOKEN_BEDROCK` variable for Bedrock API-key authentication in SDK/runtime environments that support it. Copy it to `backend/.env` only for a compatible local backend workflow; this repository's deployed Lambda handler does not load `.env` files automatically.

**Recommended AWS deployment:** leave the Bedrock API key unset and use the Lambda execution role defined in `template.yaml`. Do not add `AWS_BEARER_TOKEN_BEDROCK` or any secret to a `VITE_*` variable, frontend source code, or Git. If you choose API-key authentication in a supported backend runtime, keep the key in a local ignored `.env` file or a managed secret store, and verify that your installed boto3/botocore versions support that authentication method. The current SAM deployment is configured around IAM permissions.

### Local configuration examples

Frontend (`frontend/.env`):

```dotenv
VITE_API_URL=https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com
```

Backend-only example (`backend/.env`, for compatible local tooling only):

```dotenv
AWS_BEARER_TOKEN_BEDROCK=
MODEL_ID=amazon.nova-lite-v1:0
TABLE_NAME=
ALLOWED_ORIGIN=http://localhost:5173
```

The current frontend calls the deployed API Gateway endpoint; adding `backend/.env` alone does not start a local API server or change Lambda configuration. For AWS deployment, configure values through `template.yaml`/SAM parameters and use IAM roles for credentials.
