/**
 * Markdown spec parser
 * Parses the 8 sections of an AI agent spec from Markdown format
 */

/**
 * Parse the version header line
 * Format: > Version: X | Status: Y | Domain: Z
 */
export function parseVersionHeader(content) {
  const match = content.match(/^>\s*Version:\s*([^\|]+)\s*\|\s*Status:\s*([^\|]+)\s*\|\s*Domain:\s*(.+)$/m);
  if (!match) {
    return { version: null, status: null, domain: null };
  }
  return {
    version: match[1].trim(),
    status: match[2].trim(),
    domain: match[3].trim()
  };
}

/**
 * Extract the agent name from the title
 * Format: # Agent Spec: Name
 */
export function parseTitle(content) {
  const match = content.match(/^#\s+Agent Spec:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Parse key-value pairs from a section
 * Format: **Key:** value
 */
export function parseKeyValuePairs(section) {
  const result = {};
  const regex = /\*\*([^:]+):\*\*\s*(.+)/g;
  let match;
  while ((match = regex.exec(section)) !== null) {
    const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    result[key] = match[2].trim();
  }
  return result;
}

/**
 * Parse the Identity section
 */
export function parseIdentity(section) {
  const pairs = parseKeyValuePairs(section);
  return {
    name: pairs.name || null,
    role: pairs.role || null,
    personality: pairs.personality || null
  };
}

/**
 * Parse a markdown table into an array of objects
 */
export function parseTable(section) {
  const lines = section.split('\n').filter(line => line.trim().startsWith('|'));
  if (lines.length < 3) return []; // Need header, separator, and at least one data row

  // Extract headers from first row
  const headerLine = lines[0];
  const headerParts = headerLine.split('|');
  // Remove empty first and last elements from split
  const headers = headerParts
    .slice(1, headerParts.length - 1)
    .map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  // Skip separator line (index 1), parse data rows
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cellParts = lines[i].split('|');
    // Remove empty first and last elements from split
    const cells = cellParts.slice(1, cellParts.length - 1).map(c => c.trim());

    if (cells.length === headers.length) {
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = cells[idx] === '-' ? null : cells[idx];
      });
      rows.push(row);
    }
  }
  return rows;
}

/**
 * Parse the Capabilities section
 */
export function parseCapabilities(section) {
  const rows = parseTable(section);
  return rows.map(row => ({
    capability: row.capability || null,
    description: row.description || null,
    delegatesTo: row.delegates_to || null
  }));
}

/**
 * Parse bullet list items from a section
 */
export function parseBulletList(section) {
  const items = [];
  const regex = /^[-*]\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(section)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

/**
 * Parse the Knowledge section with In Scope / Out of Scope subsections
 */
export function parseKnowledge(section) {
  const result = {
    inScope: [],
    outOfScope: []
  };

  // Split by subsection headers
  const inScopeMatch = section.match(/###\s*In Scope\s*([\s\S]*?)(?=###|$)/i);
  const outOfScopeMatch = section.match(/###\s*Out of Scope\s*([\s\S]*?)(?=###|$)/i);

  if (inScopeMatch) {
    result.inScope = parseBulletList(inScopeMatch[1]);
  }
  if (outOfScopeMatch) {
    result.outOfScope = parseBulletList(outOfScopeMatch[1]);
  }

  return result;
}

/**
 * Parse numbered list items with bold statement and rationale
 * Format: 1. **Statement** - rationale
 */
export function parseNumberedConstraints(section) {
  const constraints = [];
  // Match: 1. **Statement** - rationale
  // Statement can contain backticked code with * characters
  const regex = /^\d+\.\s+\*\*(.+?)\*\*\s*[-–—]\s*(.+)$/gm;
  let match;
  while ((match = regex.exec(section)) !== null) {
    constraints.push({
      statement: match[1].trim(),
      rationale: match[2].trim()
    });
  }
  return constraints;
}

/**
 * Parse soft constraints (numbered list without bold/rationale split)
 * Format: 1. Prefer X over Y (reason)
 */
export function parseSoftConstraints(section) {
  const constraints = [];
  const regex = /^\d+\.\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(section)) !== null) {
    const text = match[1].trim();
    // Try to split on common patterns: (reason), - reason
    const parenMatch = text.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      constraints.push({
        statement: parenMatch[1].trim(),
        rationale: parenMatch[2].trim()
      });
    } else {
      constraints.push({
        statement: text,
        rationale: null
      });
    }
  }
  return constraints;
}

/**
 * Parse the Constraints section with Hard/Soft subsections
 */
export function parseConstraints(section) {
  const result = {
    hard: [],
    soft: []
  };

  const hardMatch = section.match(/###\s*Hard Constraints[^\n]*\s*([\s\S]*?)(?=###|$)/i);
  const softMatch = section.match(/###\s*Soft Constraints[^\n]*\s*([\s\S]*?)(?=###|$)/i);

  if (hardMatch) {
    result.hard = parseNumberedConstraints(hardMatch[1]);
  }
  if (softMatch) {
    result.soft = parseSoftConstraints(softMatch[1]);
  }

  return result;
}

/**
 * Parse the Interaction Style section
 */
export function parseInteractionStyle(section) {
  const pairs = parseKeyValuePairs(section);
  return {
    tone: pairs.tone || null,
    verbosity: pairs.verbosity || null,
    initiative: pairs.initiative || null,
    clarification: pairs.clarification || null
  };
}

/**
 * Parse the Success Criteria section (table + optional subsections)
 */
export function parseSuccessCriteria(section) {
  const result = {
    metrics: [],
    notes: {}
  };

  // Parse the main table
  const tableRows = parseTable(section);
  result.metrics = tableRows.map(row => ({
    metric: row.metric || null,
    target: row.target || null,
    tool: row.tool || null
  }));

  // Find subsections (e.g., "### PHPStan Progression")
  const subsectionRegex = /###\s*([^\n]+)\s*([\s\S]*?)(?=###|$)/g;
  let match;
  while ((match = subsectionRegex.exec(section)) !== null) {
    const title = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    const content = match[2].trim();
    // Parse as numbered list
    const items = [];
    const itemRegex = /^\d+\.\s+(.+)$/gm;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(content)) !== null) {
      items.push(itemMatch[1].trim());
    }
    if (items.length > 0) {
      result.notes[title] = items;
    }
  }

  return result;
}

/**
 * Parse the Interfaces section
 */
export function parseInterfaces(section) {
  const result = {
    standalone: null,
    acceptsHandoffsFrom: [],
    handsOffTo: []
  };

  const pairs = parseKeyValuePairs(section);
  result.standalone = pairs.standalone || null;

  // Find "Accepts handoffs from:" subsection
  const acceptsMatch = section.match(/\*\*Accepts handoffs from:\*\*\s*([\s\S]*?)(?=\*\*|$)/i);
  if (acceptsMatch) {
    result.acceptsHandoffsFrom = parseBulletList(acceptsMatch[1]);
  }

  // Find "Hands off to:" subsection
  const handsMatch = section.match(/\*\*Hands off to:\*\*\s*([\s\S]*?)(?=\*\*|$)/i);
  if (handsMatch) {
    result.handsOffTo = parseBulletList(handsMatch[1]);
  }

  return result;
}

/**
 * Parse the Version History section
 */
export function parseVersionHistory(section) {
  const rows = parseTable(section);
  return rows.map(row => ({
    version: row.version || null,
    date: row.date || null,
    changes: row.changes || null
  }));
}

/**
 * Split content into sections by ## headers
 */
export function splitSections(content) {
  const sections = {};

  // Split by ## headers
  const parts = content.split(/^##\s+/m);

  // First part is header (before any ##)
  if (parts.length > 0) {
    sections._header = parts[0];
  }

  // Process each section
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIdx = part.indexOf('\n');
    if (newlineIdx === -1) continue;

    const sectionName = part.slice(0, newlineIdx).trim().toLowerCase().replace(/\s+/g, '_');
    const sectionContent = part.slice(newlineIdx + 1);
    sections[sectionName] = sectionContent;
  }

  return sections;
}

/**
 * Parse a complete spec from Markdown content
 */
export function parseSpec(content) {
  const sections = splitSections(content);
  const header = parseVersionHeader(content);
  const title = parseTitle(content);

  return {
    name: title,
    version: header.version,
    status: header.status,
    domain: header.domain,
    identity: sections.identity ? parseIdentity(sections.identity) : null,
    capabilities: sections.capabilities ? parseCapabilities(sections.capabilities) : [],
    knowledge: sections.knowledge ? parseKnowledge(sections.knowledge) : null,
    constraints: sections.constraints ? parseConstraints(sections.constraints) : null,
    interactionStyle: sections.interaction_style ? parseInteractionStyle(sections.interaction_style) : null,
    successCriteria: sections.success_criteria ? parseSuccessCriteria(sections.success_criteria) : null,
    interfaces: sections.interfaces ? parseInterfaces(sections.interfaces) : null,
    versionHistory: sections.version_history ? parseVersionHistory(sections.version_history) : []
  };
}
