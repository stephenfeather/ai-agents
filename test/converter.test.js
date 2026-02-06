/**
 * Tests for the spec converter
 * Uses Node.js built-in test runner
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  parseVersionHeader,
  parseTitle,
  parseKeyValuePairs,
  parseIdentity,
  parseTable,
  parseCapabilities,
  parseBulletList,
  parseKnowledge,
  parseConstraints,
  parseInteractionStyle,
  parseSuccessCriteria,
  parseInterfaces,
  parseVersionHistory,
  parseSpec
} from '../src/parser.js';

import { toYaml, toJson } from '../src/converter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the PHP Expert spec as reference
const phpSpecPath = resolve(__dirname, '../ai-agent-php/spec.md');
const phpSpecContent = readFileSync(phpSpecPath, 'utf-8');

describe('parseVersionHeader', () => {
  test('extracts version, status, and domain', () => {
    const result = parseVersionHeader(phpSpecContent);
    assert.equal(result.version, '0.2.0');
    assert.equal(result.status, 'draft');
    assert.equal(result.domain, 'software-development');
  });

  test('returns nulls for missing header', () => {
    const result = parseVersionHeader('# No header here');
    assert.equal(result.version, null);
  });
});

describe('parseTitle', () => {
  test('extracts agent name from title', () => {
    const result = parseTitle(phpSpecContent);
    assert.equal(result, 'PHP Expert');
  });
});

describe('parseKeyValuePairs', () => {
  test('extracts bold key-value pairs', () => {
    const section = '**Name:** Test\n**Role:** Does things';
    const result = parseKeyValuePairs(section);
    assert.equal(result.name, 'Test');
    assert.equal(result.role, 'Does things');
  });
});

describe('parseIdentity', () => {
  test('parses identity section', () => {
    const section = `
**Name:** PHP Expert

**Role:** Writes PHP code and provides expert guidance on all aspects of PHP development.

**Personality:** Technical tone. Pragmatic toward legacy code. Terse unless asked to elaborate.
`;
    const result = parseIdentity(section);
    assert.equal(result.name, 'PHP Expert');
    assert.ok(result.role.includes('PHP code'));
    assert.ok(result.personality.includes('Technical'));
  });
});

describe('parseTable', () => {
  test('parses markdown table', () => {
    const section = `
| Capability | Description | Delegates To |
|------------|-------------|--------------|
| Write code | Write new PHP code | - |
| Database/SQL | Complex queries | Database Expert |
`;
    const result = parseTable(section);
    assert.equal(result.length, 2);
    assert.equal(result[0].capability, 'Write code');
    assert.equal(result[0].delegates_to, null);
    assert.equal(result[1].delegates_to, 'Database Expert');
  });
});

describe('parseCapabilities', () => {
  test('parses capabilities from PHP spec', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.capabilities.length > 10);

    // Check a direct capability
    const writeCode = spec.capabilities.find(c => c.capability === 'Write code');
    assert.ok(writeCode);
    assert.equal(writeCode.delegatesTo, null);

    // Check a delegated capability
    const database = spec.capabilities.find(c => c.capability === 'Database/SQL');
    assert.ok(database);
    assert.equal(database.delegatesTo, 'Database Expert');
  });
});

describe('parseKnowledge', () => {
  test('parses in-scope and out-of-scope', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.knowledge.inScope.length > 5);
    assert.ok(spec.knowledge.outOfScope.length > 0);
    assert.ok(spec.knowledge.inScope.some(item => item.includes('PHP 7.4')));
  });
});

describe('parseConstraints', () => {
  test('parses hard and soft constraints', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.constraints.hard.length >= 15);
    assert.ok(spec.constraints.soft.length >= 7);

    // Check hard constraint structure
    const noSecrets = spec.constraints.hard.find(c => c.statement.includes('hardcoded secrets'));
    assert.ok(noSecrets);
    assert.ok(noSecrets.rationale.includes('env vars'));

    // Check soft constraint
    const instanceMethods = spec.constraints.soft.find(c => c.statement.includes('instance methods'));
    assert.ok(instanceMethods);
    assert.equal(instanceMethods.rationale, 'testability');
  });
});

describe('parseInteractionStyle', () => {
  test('parses interaction style fields', () => {
    const spec = parseSpec(phpSpecContent);
    assert.equal(spec.interactionStyle.tone, 'Technical');
    assert.ok(spec.interactionStyle.verbosity.includes('Terse'));
    assert.ok(spec.interactionStyle.initiative.includes('Switchable'));
    assert.ok(spec.interactionStyle.clarification.includes('Ask early'));
  });
});

describe('parseSuccessCriteria', () => {
  test('parses metrics table', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.successCriteria.metrics.length >= 9);

    const codeStyle = spec.successCriteria.metrics.find(m => m.metric === 'Code style');
    assert.ok(codeStyle);
    assert.equal(codeStyle.target, 'Passes PSR-12');
    assert.equal(codeStyle.tool, 'PHP_CodeSniffer');
  });

  test('parses subsection notes', () => {
    const spec = parseSpec(phpSpecContent);
    const noteKeys = Object.keys(spec.successCriteria.notes);
    assert.ok(noteKeys.some(k => k.includes('phpstan')));
  });
});

describe('parseInterfaces', () => {
  test('parses standalone and handoff lists', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.interfaces.standalone.includes('independently'));
    assert.ok(spec.interfaces.acceptsHandoffsFrom.length >= 3);
    assert.ok(spec.interfaces.handsOffTo.length >= 7);
    assert.ok(spec.interfaces.handsOffTo.some(h => h.includes('Database Expert')));
  });
});

describe('parseVersionHistory', () => {
  test('parses version history table', () => {
    const spec = parseSpec(phpSpecContent);
    assert.ok(spec.versionHistory.length >= 3);
    assert.equal(spec.versionHistory[0].version, '0.2.0');
  });
});

describe('full spec parsing', () => {
  test('parses complete PHP Expert spec', () => {
    const spec = parseSpec(phpSpecContent);

    assert.equal(spec.name, 'PHP Expert');
    assert.equal(spec.version, '0.2.0');
    assert.equal(spec.status, 'draft');
    assert.equal(spec.domain, 'software-development');
    assert.ok(spec.identity);
    assert.ok(spec.capabilities.length > 0);
    assert.ok(spec.knowledge);
    assert.ok(spec.constraints);
    assert.ok(spec.interactionStyle);
    assert.ok(spec.successCriteria);
    assert.ok(spec.interfaces);
    assert.ok(spec.versionHistory.length > 0);
  });
});

describe('toYaml', () => {
  test('converts spec to valid YAML', () => {
    const spec = parseSpec(phpSpecContent);
    const yaml = toYaml(spec);

    assert.ok(yaml.includes('name: PHP Expert'));
    assert.ok(yaml.includes('version: 0.2.0'));
    assert.ok(yaml.includes('capabilities:'));
  });
});

describe('toJson', () => {
  test('converts spec to valid JSON', () => {
    const spec = parseSpec(phpSpecContent);
    const json = toJson(spec);

    // Should be parseable
    const parsed = JSON.parse(json);
    assert.equal(parsed.name, 'PHP Expert');
    assert.equal(parsed.version, '0.2.0');
    assert.ok(parsed.capabilities.length > 0);
  });
});
