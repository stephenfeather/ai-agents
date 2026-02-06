#!/usr/bin/env node

/**
 * CLI for converting AI agent specs from Markdown to YAML/JSON
 */

import { Command } from 'commander';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { basename, dirname, join, resolve } from 'path';
import { parseSpec } from '../src/parser.js';
import { toYaml, toJson } from '../src/converter.js';

const program = new Command();

program
  .name('spec-convert')
  .description('Convert AI agent specs from Markdown to YAML/JSON')
  .version('1.0.0')
  .argument('<input>', 'Input file or directory containing spec.md files')
  .option('-f, --format <format>', 'Output format: yaml or json', 'yaml')
  .option('-o, --output <path>', 'Output file path (default: dist/{agent-name}.{format})')
  .action((input, options) => {
    const inputPath = resolve(input);
    const format = options.format.toLowerCase();

    if (!['yaml', 'json'].includes(format)) {
      console.error(`Error: Invalid format "${format}". Use "yaml" or "json".`);
      process.exit(1);
    }

    // Determine if input is file or directory
    if (!existsSync(inputPath)) {
      console.error(`Error: Input path does not exist: ${inputPath}`);
      process.exit(1);
    }

    const stat = statSync(inputPath);

    if (stat.isFile()) {
      // Single file conversion
      convertFile(inputPath, format, options.output);
    } else if (stat.isDirectory()) {
      // Directory conversion - find all ai-agent-*/spec.md files
      const specs = findSpecs(inputPath);
      if (specs.length === 0) {
        console.error('No spec.md files found in ai-agent-* directories.');
        process.exit(1);
      }
      specs.forEach(specPath => {
        convertFile(specPath, format, null);
      });
    } else {
      console.error('Error: Input must be a file or directory.');
      process.exit(1);
    }
  });

/**
 * Find all spec.md files in ai-agent-* directories
 */
function findSpecs(dir) {
  const specs = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    if (entry.startsWith('ai-agent-')) {
      const specPath = join(dir, entry, 'spec.md');
      if (existsSync(specPath)) {
        specs.push(specPath);
      }
    }
  }

  return specs;
}

/**
 * Convert a single spec file
 */
function convertFile(inputPath, format, outputPath) {
  try {
    // Read and parse
    const content = readFileSync(inputPath, 'utf-8');
    const spec = parseSpec(content);

    // Convert to target format
    const output = format === 'yaml' ? toYaml(spec) : toJson(spec);

    // Determine output path
    if (!outputPath) {
      // Extract agent name from directory or spec name
      const parentDir = basename(dirname(inputPath));
      const agentName = parentDir.startsWith('ai-agent-')
        ? parentDir.replace('ai-agent-', '')
        : (spec.name || 'spec').toLowerCase().replace(/\s+/g, '-');

      // Ensure dist directory exists
      const distDir = resolve(dirname(inputPath), '..', 'dist');
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      outputPath = join(distDir, `${agentName}.${format}`);
    } else {
      // Ensure output directory exists
      const outDir = dirname(outputPath);
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }
    }

    // Write output
    writeFileSync(outputPath, output, 'utf-8');
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}: ${error.message}`);
    process.exit(1);
  }
}

program.parse();
