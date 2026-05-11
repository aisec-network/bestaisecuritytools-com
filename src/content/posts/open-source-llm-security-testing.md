---
title: "Open Source LLM Security Testing Tools: The Practitioner's Toolkit"
description: "A curated review of the open-source tools actually worth deploying for LLM security testing — red-teaming, fuzzing, evaluation, and monitoring — with honest notes on what each one does and doesn't do."
pubDate: 2026-05-09
tags: ["open-source", "red-teaming", "llm-security", "testing", "tools"]
category: "reviews"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/bestaisecuritytools.com/open-source-llm-security-testing.png
heroAlt: "Open source LLM security testing tools"
schema:
  type: "TechArticle"
---

The commercial LLM security tool market is crowded and expensive. The open-source alternatives are underrated. Most production security teams we've spoken with have built their LLM security testing practice primarily on open-source tooling, supplemented with one or two commercial products for specific gaps. Our [AI firewall and guardrail solutions review](/posts/ai-firewall-guardrail-solutions) covers the commercial guardrail products most commonly used to fill those gaps.

This is a curated survey of the open-source tools worth your time, organized by what phase of testing they support. We've used all of these in actual evaluation work and we'll tell you where each one falls short.

## Pre-Deployment Red Teaming

### PyRIT (Python Risk Identification Toolkit for Generative AI)

**Maintainer:** Microsoft  
**License:** MIT  
**GitHub:** microsoft/PyRIT

PyRIT is the most capable open-source red-teaming framework for LLMs. Its architecture separates targets (the thing you're testing), orchestrators (the attack strategy), converters (input transformations), and scorers (output evaluation) — which means you can compose sophisticated multi-step attacks without writing them from scratch.

**What it does well:**
- Multi-turn attack orchestrations (jailbreaks that unfold over several exchanges)
- Converter chaining: apply translation → paraphrase → character substitution → inject
- Integration with Azure OpenAI, OpenAI, and local models
- Automated scoring using a judge LLM
- Memory store for tracking attack outcomes across sessions

**What it doesn't do:**
- It's a framework, not a CLI tool. Getting started requires meaningful Python work
- No built-in reporting format for compliance or audit outputs
- Attack coverage depends on what you build; default attack library is reasonable but not exhaustive

**Time to useful results:** 2-4 hours for a developer familiar with Python; half a day for setting up a repeatable campaign.

### Garak

**Maintainer:** NVIDIA  
**License:** Apache 2.0  
**GitHub:** NVIDIA/garak

Garak takes the opposite approach from PyRIT: it's designed to run immediately against a configured target with minimal setup. `garak -m openai -n gpt-4o -p all` generates a broad vulnerability scan report. The probe library covers prompt injection, jailbreaks, data leakage, hallucination triggers, toxic generation, and more.

**What it does well:**
- Extremely fast to run: 20-minute scan gives breadth coverage across most vulnerability categories
- Good report format: HTML output with pass/fail by probe category
- Extensible probe YAML format for custom checks
- Regularly updated probe library

**What it doesn't do:**
- Breadth-first design means shallow coverage within any single attack family
- Adaptive attacks (attacks that adjust to model responses) aren't well supported
- Less useful for complex multi-step scenarios

**Time to useful results:** Under an hour for first results.

**Practical combination:** Run Garak for broad baseline coverage, PyRIT for targeted deep dives. The two tools complement each other well.

### PromptBench

**Maintainer:** Microsoft Research  
**License:** MIT  
**GitHub:** microsoft/promptbench

PromptBench evaluates LLM robustness against adversarial prompts and distribution shift. It's more evaluation framework than red-team tool — useful for measuring how much a model's task performance degrades under various input perturbations.

**Best for:** Teams fine-tuning models who want to verify that fine-tuning hasn't increased susceptibility to adversarial inputs. Less useful for black-box security testing of deployed applications.

## Input/Output Scanning Libraries

### LLM Guard (ProtectAI)

**License:** Apache 2.0  
**GitHub:** protectai/llm-guard

As covered in our [LLM vulnerability scanner benchmark](/posts/top-llm-vulnerability-scanners), LLMGuard is the best open-source library for input/output scanning with a production-integration focus. Key scanners:

- **Input:** Prompt injection, ban topics, secrets detection, token limit, language detection
- **Output:** PII detection, no-refusal check, relevant topics, code scanner

**Practical integration:**

```python
from llm_guard.input_scanners import PromptInjection, BanTopics
from llm_guard.output_scanners import Sensitive, PIIData
from llm_guard import scan_prompt, scan_output

sanitized_prompt, results_valid, results_score = scan_prompt(
    [PromptInjection(), BanTopics(topics=["internal systems"])],
    user_prompt
)
```

The library is well-maintained and the production integration path is clearer than most alternatives. For teams deploying LLMs that handle sensitive data, LLMGuard's PII output scanner is one of the best freely available options.

[AI Moderation Tools](https://aimoderationtools.com) has an extended review covering LLMGuard's configuration options.

### Rebuff

**License:** MIT  
**GitHub:** protectai/rebuff

Rebuff focuses narrowly on prompt injection detection with a multi-layer approach: canary tokens, vector similarity against a known-injection database, and LLM-based classification. The combination outperforms single-method approaches.

For deployment, Rebuff requires either a self-hosted vector store or use of their managed API. The self-hosted path is documented but requires more operational investment than LLMGuard.

### Guardrails AI

**License:** Apache 2.0  
**GitHub:** guardrails-ai/guardrails

Guardrails AI provides a framework for defining structured outputs with validation. From a security standpoint, its output validation capabilities are useful for ensuring LLM responses conform to expected schemas and don't contain injected content.

The hub has community-contributed validators for toxic language detection, PII detection, competitor mentions, URL safety, and more. For teams who need flexible output validation as part of their security stack, Guardrails AI is worth evaluating.

## Evaluation and Benchmarking

### EleutherAI's LM Evaluation Harness

**License:** MIT  
**GitHub:** EleutherAI/lm-evaluation-harness

LM Eval Harness is the gold-standard benchmark suite for open LLMs. From a security standpoint, it includes evaluation tasks for:

- TruthfulQA (calibrated truth-telling)
- BIG-Bench Hard (reasoning manipulation resistance)
- Some safety-adjacent tasks

Not a security-specific tool, but an essential baseline for evaluating models before deployment. If a model's performance on reasoning tasks has degraded (e.g., due to a poisoning attack or problematic fine-tune), LM Eval Harness will catch it. [AI Sec Bench](https://aisecbench.com) maintains up-to-date benchmark results for common models.

### EvalPlus

**License:** Apache 2.0  
**GitHub:** evalplus/evalplus

EvalPlus focuses specifically on code generation quality and security. It extends HumanEval and MBPP with tests that include security-relevant code patterns — injection vulnerabilities, use of deprecated unsafe APIs, etc. For teams deploying code-generation LLMs, it's a useful part of the evaluation pipeline.

## Runtime Monitoring

### WhyLogs (WhyLabs)

**License:** Apache 2.0  
**GitHub:** whylabs/whylogs

WhyLogs provides statistical profiling for ML data and LLM inputs/outputs. From a security standpoint, it's useful for detecting distribution shift in inputs (which can indicate probing or attack campaigns) and monitoring output distribution (which can indicate model behavior changes).

**Practical use:** Deploy as a sidecar to your LLM application. Profile incoming prompts for statistical anomalies — sudden increases in long inputs, high token counts, unusual character distributions — that indicate adversarial probing. [ML Observe](https://mlobserve.com) has a deployment guide for WhyLogs in LLM contexts.

### Phoenix (Arize AI)

**License:** Apache 2.0  
**GitHub:** Arize-ai/phoenix

Phoenix is an observability platform for LLM and ML applications. Its LLM tracing capabilities are useful for forensic analysis of security incidents — reconstructing what a conversation looked like when an attack occurred, what the context window contained, what tools were called.

For security operations, the ability to query conversation traces and identify patterns across many interactions is valuable.

## Supply Chain Security

### ModelScan (ProtectAI)

**License:** Apache 2.0  
**GitHub:** protectai/modelscan

ModelScan scans model files (pickle, PyTorch, TensorFlow, Keras) for unsafe operations that could execute malicious code on deserialization. It's simple to run:

```bash
modelscan scan -p ./model.pkl
```

Any team loading model files from external sources (HuggingFace Hub, shared drives, CI artifacts) should have ModelScan or equivalent in their pipeline. Pickle-based deserialization attacks against ML models are well-documented and trivially easy to exploit without a scanner. [ML CVEs](https://mlcves.com) maintains a list of CVEs in ML frameworks that modelscan-class tools would have caught.

### Sigstore / Cosign for Model Signing

Not a scanner, but Sigstore's code signing primitives are increasingly used to sign model artifacts for provenance verification. If you're building an MLOps pipeline that consumes models from registries, integrating Sigstore-based signing lets you verify provenance before loading.

## Building Your Stack

A minimal open-source LLM security testing stack that covers the most important ground:

1. **Pre-deployment red-teaming:** Garak (breadth) + PyRIT (targeted campaigns)
2. **Input/output scanning:** LLMGuard (production) + Rebuff (prompt injection specialist)
3. **Supply chain:** ModelScan on all model file loads
4. **Runtime monitoring:** WhyLogs or Phoenix for anomaly detection
5. **Evaluation:** LM Evaluation Harness baseline before any model deployment

Total infrastructure cost: essentially zero for self-hosted. Engineering time for integration: 2-3 days for a competent engineer.

The commercial add-ons worth considering: Lakera Guard for production-quality injection detection with lower false positives, HiddenLayer for enterprise runtime monitoring, Robust Intelligence for continuous adversarial robustness testing.

Track new tool releases at [AI Alert](https://ai-alert.org) and [AI Sec Weekly](https://aisecweekly.com).
