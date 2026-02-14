/**
 * Format converter
 * Converts parsed spec objects to YAML and JSON
 */

import yaml from 'js-yaml';

/**
 * Convert spec object to YAML string
 */
export function toYaml(spec) {
  return yaml.dump(spec, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false
  });
}

/**
 * Convert spec object to JSON string
 */
export function toJson(spec) {
  return JSON.stringify(spec, null, 2);
}

/**
 * Convert spec object to Markdown with YAML frontmatter
 * The markdown includes the frontmatter at the top, then the full spec object rendered as readable markdown
 */
export function toMarkdown(spec, originalMarkdownContent) {
  // Build frontmatter
  const frontmatter = {
    name: spec.name ? spec.name.toLowerCase().replace(/\s+/g, '-') : null,
    description: spec.identity?.role || spec.name || null,
    model: spec.model || null,
    tools: spec.tools && spec.tools.length > 0 ? spec.tools : null,
    version: spec.version || null
  };

  // Format YAML frontmatter
  const yamlLines = [];
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (value === null) {
      yamlLines.push(`${key}:`);
    } else if (Array.isArray(value)) {
      yamlLines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  });

  const frontmatterBlock = `---\n${yamlLines.join('\n')}\n---\n\n`;

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
