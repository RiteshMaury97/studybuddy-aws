# StudyBuddy: Building a More Human Learning Experience with AWS

> **Submission note:** This is a draft based on the included prototype source code and infrastructure template. Before publishing, deploy it, run the checklist in `README.md`, add your own screenshot or demo link, and replace the verification notes with the results you actually observe. Do not claim deployment or successful testing until it has happened.

## The problem: learning can feel harder than it needs to

Students often search for help when a topic is confusing, but a long answer filled with unfamiliar terms can create more questions than it solves. StudyBuddy is a student-focused AI learning assistant designed around a simple idea: help learners take one useful step at a time.

StudyBuddy is intended for school, college, and self-directed learners who want to understand a topic, practise it, or organise revision. It offers three modes: explain a topic, create a short practice quiz, and prepare a revision plan. Learners can select beginner, intermediate, or advanced level so that the assistant has a clear signal about how deeply to explain a concept.

## How I designed the experience

The feature I care most about is the “Learning Ladder.” For explanations, StudyBuddy is instructed to organise its answer around four steps: understand the idea in plain language, see a concrete example, try a short question, and explore an optional next step. The intention is to make a conversation feel more like guided learning and less like copying a block of generated text.

The interface reinforces that approach with a welcoming first-run screen, example prompts, a visible learning-level selector, distinct learning modes, a thinking state while a response is being generated, and a friendly error message when a request fails. Students can start from an example instead of having to invent the perfect prompt. They can also start a new session without reloading the page.

These are design choices, not proof of improved learning outcomes. To evaluate the experience, I plan to ask a few students to complete the same learning task with and without the starter prompts, then collect short feedback on clarity, effort, and whether the next step was obvious. I will report the actual results after running that evaluation.

## How I built StudyBuddy on AWS

The prototype uses React for the browser interface and a Python AWS Lambda function for the backend. Amazon API Gateway provides an HTTP endpoint at `/chat`, and the Lambda function calls Amazon Bedrock through its Converse API. This API provides a consistent conversational interface for supported models, which keeps the application code separate from much of the model-specific request formatting.

The frontend sends the student's message, selected mode, learning level, and a bounded recent conversation history to the API. The Lambda handler validates the request, rejects empty or oversized messages, checks that the selected mode and level are supported, and limits the amount of history sent to the model. It then adds StudyBuddy's teaching instructions and invokes the configured Bedrock model.

The backend also handles failures deliberately. Rather than returning provider exception details to the browser, it logs the error for debugging and returns a simple message asking the learner to try again or check model access. The frontend displays that message in a dedicated error area. The included AWS SAM template describes the HTTP API, Lambda function, environment configuration, and model invocation permission so the infrastructure can be deployed from a repeatable template.

The model ID is configurable because model availability and access depend on the selected AWS Region and account. Before deployment, I will confirm that the chosen model supports the Converse API in my region and that my account has permission to invoke it. I will also configure a budget alert and review usage because model requests can incur charges.

## Testing and what I learned

The project includes unit tests for empty input, unsupported modes, a successful mocked model response, and provider failure handling. These tests check important request-validation and error-handling paths without requiring a live model call. They do not replace integration testing against AWS.

Before calling the project ready, I will deploy it with AWS SAM, test the real API endpoint, and verify all three learning modes. I will also test mobile layout, loading behaviour, network failures, and long input. For the public demo, I will capture a screenshot or short recording showing a real question, the generated response, and the Learning Ladder experience.

The current prototype does not store student conversations in a database, authenticate users, or connect answers to a verified curriculum. It is a learning aid rather than an authoritative source. A future version could add an opt-in study history, curriculum documents with retrieval, and feedback controls, but those features should be added only after evaluating the basic experience.

## Try it

**Demo:** [Add your deployed StudyBuddy URL here]

**Proof it works:** [Add a screenshot or short demo clip here]

StudyBuddy starts with a small promise: make the next step in learning feel achievable. By combining a simple interface, structured teaching instructions, bounded context, and a serverless AWS backend, the prototype provides a foundation I can test and improve with real learners.

#agents
