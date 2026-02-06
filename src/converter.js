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
