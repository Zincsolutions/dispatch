// Prompts can declare fill-in variables with {{double_braces}},
// e.g. "Write a follow-up email to {{client_name}} about {{topic}}".

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_][a-zA-Z0-9_ .-]*?)\s*\}\}/g

export function extractVariables(body: string): string[] {
  const names: string[] = []
  for (const match of body.matchAll(VARIABLE_PATTERN)) {
    const name = match[1].trim()
    if (!names.includes(name)) names.push(name)
  }
  return names
}

export function fillVariables(
  body: string,
  values: Record<string, string>
): string {
  return body.replace(VARIABLE_PATTERN, (full, name: string) => {
    const value = values[name.trim()]
    return value !== undefined && value !== "" ? value : full
  })
}
