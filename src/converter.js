/**
 * Format converter
 * Converts parsed spec objects to YAML and JSON
 */

import yaml from 'js-yaml';
import { deriveKeywords } from './parser.js';

/**
 * Build a routing object for agent selection / Task tool routing.
 *
 * @param {object} spec  - Parsed spec from parseSpec()
 * @param {string} agentName - Directory slug (e.g. "php", "wordpress-developer")
 * @returns {object} Routing metadata
 */
function buildRoutingObject(spec, agentName) {
  const name = agentName || null;

  const description = spec.identity?.role || spec.name || null;

  const domain = spec.domain ? spec.domain.toLowerCase() : null;

  const status = spec.status ? spec.status.toLowerCase() : null;

  // Derive standalone boolean from interfaces
  let standalone = null;
  if (spec.interfaces?.standalone) {
    const val = spec.interfaces.standalone.toLowerCase();
    standalone = val.includes('yes') || val.includes('independently');
  }

  // Direct (non-delegated) capability names
  const capabilities = (spec.capabilities || [])
    .filter(c => !c.delegatesTo && c.capability)
    .map(c => c.capability);

  // Delegations: capability + target pairs
  const delegations = (spec.capabilities || [])
    .filter(c => c.delegatesTo && c.capability)
    .map(c => ({ capability: c.capability, target: c.delegatesTo }));

  const keywords = deriveKeywords(spec, agentName);

  return {
    name,
    description,
    domain,
    status,
    standalone,
    capabilities: capabilities.length > 0 ? capabilities : null,
    delegations: delegations.length > 0 ? delegations : null,
    keywords: keywords.length > 0 ? keywords : null
  };
}

/**
 * Convert spec object to YAML string.
 * When agentName is provided, a top-level `routing` key is prepended.
 */
export function toYaml(spec, agentName) {
  const obj = agentName
    ? { routing: buildRoutingObject(spec, agentName), ...spec }
    : spec;

  return yaml.dump(obj, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false
  });
}

/**
 * Convert spec object to JSON string.
 * When agentName is provided, a top-level `routing` key is prepended.
 */
export function toJson(spec, agentName) {
  const obj = agentName
    ? { routing: buildRoutingObject(spec, agentName), ...spec }
    : spec;

  return JSON.stringify(obj, null, 2);
}

/**
 * Convert spec object to Markdown with YAML frontmatter.
 * When agentName is provided, the frontmatter includes full routing fields.
 */
export function toMarkdown(spec, originalMarkdownContent, agentName) {
  let frontmatter;

  if (agentName) {
    const routing = buildRoutingObject(spec, agentName);
    frontmatter = {
      name: routing.name,
      description: routing.description,
      domain: routing.domain,
      status: routing.status,
      model: spec.model || null,
      tools: spec.tools && spec.tools.length > 0 ? spec.tools : null,
      version: spec.version || null,
      standalone: routing.standalone,
      capabilities: routing.capabilities,
      delegations: routing.delegations,
      keywords: routing.keywords
    };
  } else {
    // Legacy path: minimal frontmatter (backward compat)
    frontmatter = {
      name: spec.name ? spec.name.toLowerCase().replace(/\s+/g, '-') : null,
      description: spec.identity?.role || spec.name || null,
      model: spec.model || null,
      tools: spec.tools && spec.tools.length > 0 ? spec.tools : null,
      version: spec.version || null
    };
  }

  // Use yaml.dump for correct nested object/array serialization
  const yamlStr = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    // Don't quote simple strings unnecessarily
    quotingType: '"',
    forceQuotes: false
  }).trimEnd();

  const frontmatterBlock = `---\n${yamlStr}\n---\n\n`;

  // Use original markdown if provided, otherwise generate from spec object
  if (originalMarkdownContent) {
    return frontmatterBlock + originalMarkdownContent;
  }

  // Fallback: regenerate markdown from parsed spec (less ideal but works)
  return frontmatterBlock + regenerateMarkdownFromSpec(spec);
}

/**
 * Regenerate markdown from parsed spec object
 * This is a fallback when original markdown is not available
 */
function regenerateMarkdownFromSpec(spec) {
  const lines = [];

  // Title
  if (spec.name) {
    lines.push(`# Agent Spec: ${spec.name}\n`);
  }

  // Version header
  const versionHeader = [
    `Version: ${spec.version || 'N/A'}`,
    `Status: ${spec.status || 'draft'}`,
    `Domain: ${spec.domain || 'N/A'}`
  ];
  if (spec.model || (spec.tools && spec.tools.length > 0)) {
    lines.push(`> ${versionHeader.join(' | ')}`);
    const modelToolsLine = [
      `Model: ${spec.model || ''}`,
      `Tools: ${spec.tools && spec.tools.length > 0 ? spec.tools.join(', ') : '-'}`
    ];
    lines.push(`> ${modelToolsLine.join(' | ')}`);
  } else {
    lines.push(`> ${versionHeader.join(' | ')}`);
  }
  lines.push('');

  // Identity
  if (spec.identity) {
    lines.push('## Identity\n');
    if (spec.identity.name) lines.push(`**Name:** ${spec.identity.name}`);
    if (spec.identity.role) lines.push(`**Role:** ${spec.identity.role}`);
    if (spec.identity.personality) lines.push(`**Personality:** ${spec.identity.personality}`);
    lines.push('\n---\n');
  }

  // Capabilities
  if (spec.capabilities && spec.capabilities.length > 0) {
    lines.push('## Capabilities\n');
    lines.push('| Capability | Description | Delegates To |');
    lines.push('|------------|-------------|--------------|');
    spec.capabilities.forEach(cap => {
      const delegates = cap.delegatesTo || '-';
      lines.push(`| ${cap.capability || ''} | ${cap.description || ''} | ${delegates} |`);
    });
    lines.push('');
  }

  // (Additional sections would follow similarly)
  // For brevity, focusing on the structure above

  return lines.join('\n');
}
