# vocabulists

A collection of browser-based tools for health terminology analysts. Each tool is a self-contained HTML file that can be opened directly in a web browser — no installation or server required.

The tools generally work with FHIR terminology resources and APIs, though other technologies may be used where appropriate.

## Tools

### fhir_diff.html

Compares two versions of a FHIR CodeSystem or ValueSet exported as JSON, and generates three CSV files:

- A full listing of all concepts in the older version
- A full listing of all concepts in the newer version
- A diff showing all concepts added or deleted between the two versions

The tool auto-detects whether the input files are CodeSystems or ValueSets. For ValueSets, the system URL is included in the output. Both files must be the same resource type.

**Usage:** Open `fhir_diff/fhir_diff.html` in a browser. Load the older and newer JSON files using the file slots (click or drag), then click Run Comparison. Download links for the three CSV files will appear once the comparison is complete.

Full instructions are available in `fhir_diff/fhir_diff_instructions.docx`.

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
