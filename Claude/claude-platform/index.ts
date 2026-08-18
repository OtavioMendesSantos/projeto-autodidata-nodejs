import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const msg = await client.messages.create({
  model: "claude-opus-4-7", // which Claude model handles the request
  max_tokens: 1024, // a cap on how long the response can be
  messages: [{
    role: "user",
    content: "Hello, Claude",
  }],
});

// Claude Opus - Mais caro, mais lento, mais inteligente
// Claude Sonnet - Meio termo
// Claude Haiku - Mais barato, mais rápido, menos inteligente
